import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  const { board, classYear, subject, chapter, topic } = await request.json()

  if (!topic) {
    return new Response(JSON.stringify({ error: 'Topic required' }), { status: 400 })
  }

  const cacheKey = `sim|${board}|${classYear}|${subject}|${chapter}|${topic}`.toLowerCase()

  // Check cache first
  const { data: cached } = await supabase
    .from('simulations_cache')
    .select('simulation_html, svg_diagram')
    .eq('cache_key', cacheKey)
    .single()

  if (cached?.simulation_html || cached?.svg_diagram) {
    return new Response(JSON.stringify({
      simulation_html: cached.simulation_html,
      svg_diagram: cached.svg_diagram,
      fromCache: true
    }), { headers: { 'Content-Type': 'application/json' } })
  }

  const context = [board, classYear, subject, chapter, topic].filter(Boolean).join(' › ')

  const prompt = `You are an expert educational content creator for ClaritIQ, an Indian ed-tech app.

Topic: ${context}

Your job: Create TWO things for this topic.

---

PART 1: AN INTERACTIVE HTML SIMULATION
Create a self-contained HTML page with Canvas/JavaScript that visually demonstrates this topic.

Rules for the simulation:
- Use ONLY vanilla JavaScript and HTML Canvas — no external libraries
- Must be visually beautiful with a dark theme (#0a0f1e background, colorful elements)
- Must be INTERACTIVE — buttons to start/stop/reset, sliders to change variables
- Must have labels and annotations explaining what's happening
- Must be educational — show the physics/concept in action
- Use smooth animations with requestAnimationFrame
- Include a legend or key explaining the visual elements
- Font: use system fonts only
- Size: design for 800px wide, 400px tall canvas

For topics that don't have obvious physics simulations (like history, grammar, literature):
- Create a beautiful animated CONCEPT MAP or TIMELINE instead
- Show relationships between concepts with animated connections

Return the simulation as a complete HTML document starting with <!DOCTYPE html>

---

PART 2: AN SVG DIAGRAM
Create a clear, educational SVG diagram that shows the key concept, formula, or structure.

Rules for SVG:
- viewBox="0 0 800 300"
- Dark theme: background #0f1729, text #e2e8f0
- Use colors: #60a5fa (blue), #34d399 (green), #fbbf24 (yellow), #a78bfa (purple), #f87171 (red)
- Include labels, arrows, and annotations
- Show the key formula or relationship if applicable
- Clean, minimal, professional look

---

Return your response as valid JSON only (no markdown, no backticks):
{
  "simulation_html": "<!DOCTYPE html>...(complete HTML)...",
  "svg_diagram": "<svg viewBox=\\"0 0 800 300\\"...>...</svg>"
}`

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].text.trim()
    const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()

    let data
    try {
      data = JSON.parse(cleaned)
    } catch {
      // Try to extract JSON if Claude added extra text
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        data = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Could not parse response')
      }
    }

    // Save to cache
    await supabase.from('simulations_cache').insert({
      cache_key: cacheKey,
      board, class_year: classYear, subject, chapter, topic,
      simulation_html: data.simulation_html,
      svg_diagram: data.svg_diagram
    })

    return new Response(JSON.stringify({
      simulation_html: data.simulation_html,
      svg_diagram: data.svg_diagram,
      fromCache: false
    }), { headers: { 'Content-Type': 'application/json' } })

  } catch (err) {
    console.error('Simulation API error:', err)
    return new Response(JSON.stringify({ error: 'Failed to generate simulation' }), { status: 500 })
  }
}