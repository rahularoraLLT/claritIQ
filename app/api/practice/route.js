import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  const { board, classYear, subject, chapter, topic, difficulty = 'medium', count = 5 } = await request.json()

  if (!topic) {
    return new Response(JSON.stringify({ error: 'Topic required' }), { status: 400 })
  }

  const cacheKey = `${board}|${classYear}|${subject}|${chapter}|${topic}|${difficulty}`.toLowerCase()

  // Check cache first
  const { data: cached } = await supabase
    .from('questions_cache')
    .select('questions')
    .eq('cache_key', cacheKey)
    .single()

  if (cached?.questions) {
    // Return cached questions (shuffle them for variety)
    const all = cached.questions
    const shuffled = all.sort(() => Math.random() - 0.5).slice(0, count)
    return new Response(JSON.stringify({ topic, difficulty, questions: shuffled }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Not cached — generate fresh
  const context = [board, classYear, subject, chapter, topic].filter(Boolean).join(' › ')

  const prompt = `You are ClaritIQ — an expert at creating high-quality MCQ practice questions for Indian students.

Create exactly 15 multiple choice questions on: ${context}
Difficulty level: ${difficulty} (${difficulty === 'easy' ? 'basic recall and understanding' : difficulty === 'hard' ? 'application, analysis, and tricky variants' : 'conceptual understanding and basic application'})

Rules for great questions:
- Questions should test understanding, not just memorisation
- Include 1-2 tricky "common misconception" questions
- For numerical topics: include calculation-based questions
- Options should be plausible — wrong answers should be common mistakes
- Explain WHY the correct answer is right (and why others are wrong) in the explanation

Return ONLY valid JSON — no markdown, no backticks, no extra text:
{
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "id": 1,
      "question": "Question text here",
      "options": {
        "A": "Option A text",
        "B": "Option B text",
        "C": "Option C text",
        "D": "Option D text"
      },
      "correct": "A",
      "explanation": "Clear explanation of why A is correct and why other options are wrong."
    }
  ]
}`

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].text.trim()
    const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()

    const data = JSON.parse(cleaned)

    // Save all 15 to cache
    await supabase.from('questions_cache').insert({
      cache_key: cacheKey,
      board, class_year: classYear, subject, chapter, topic,
      difficulty, questions: data.questions
    })

    // Return only the requested count
    const selected = data.questions.slice(0, count)
    return new Response(JSON.stringify({ topic, difficulty, questions: selected }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Practice API error:', err)
    return new Response(JSON.stringify({ error: 'Failed to generate questions' }), { status: 500 })
  }
}