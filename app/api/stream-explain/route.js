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

  const cacheKey = `${board}|${classYear}|${subject}|${chapter}|${topic}`.toLowerCase()

  // Check cache first
  const { data: cached } = await supabase
    .from('explanations_cache')
    .select('content')
    .eq('cache_key', cacheKey)
    .single()

  if (cached?.content) {
    // Return cached content as a stream
    const readableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(cached.content))
        controller.close()
      }
    })
    return new Response(readableStream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    })
  }

  // Not cached — generate fresh
  const context = [board, classYear, subject, chapter].filter(Boolean).join(' › ')

  const prompt = `You are ClaritIQ — an AI tutor that teaches exactly like Rahul Arora, a passionate teacher known for making hard concepts feel simple and obvious.

Your teaching style:
- Start with a relatable real-world analogy or story that makes the student say "oh, THAT'S what this is!"
- Never start with a definition — start with WHY this concept exists or a problem it solves
- Use conversational, friendly language — like a brilliant friend explaining, not a textbook
- Break complex ideas into small, logical steps — each step building on the last
- Use examples from everyday life (cricket, traffic, chai, phones — things Indian students relate to)
- Use **bold** for key terms, ## for section headings, --- for dividers
- If there are formulas, explain what each symbol MEANS in plain English before showing the formula using LaTeX (wrap in $...$ for inline, $$...$$ for display)
- When a process or system is best shown as a diagram, describe it using a simple text flow using arrows like: Step 1 → Step 2 → Step 3
- Use markdown tables when comparing things side by side
- After the explanation, add a "## 🔑 Key Takeaways" section with 3-4 bullet points
- End with "## 💭 Think About This" — one thought-provoking question to make the student curious

Context: ${context}
Topic to explain: **${topic}**

Now teach this topic in your signature style. Make it feel like a conversation, not a lecture.`

  try {
    const stream = await client.messages.stream({
      model: 'claude-opus-4-5',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    let fullContent = ''

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              fullContent += chunk.delta.text
              controller.enqueue(new TextEncoder().encode(chunk.delta.text))
            }
          }
          controller.close()

          // Save to cache after streaming completes
          await supabase.from('explanations_cache').insert({
            cache_key: cacheKey,
            board, class_year: classYear, subject, chapter, topic,
            content: fullContent
          })
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Accel-Buffering': 'no',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (err) {
    console.error('Stream error:', err)
    return new Response(JSON.stringify({ error: 'Failed to generate explanation' }), { status: 500 })
  }
}