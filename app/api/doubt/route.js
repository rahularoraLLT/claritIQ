import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request) {
  const { question, board, classYear, subject, conversationHistory = [] } = await request.json()

  if (!question?.trim()) {
    return new Response(JSON.stringify({ error: 'Question required' }), { status: 400 })
  }

  const context = [board, classYear, subject].filter(Boolean).join(' › ')

  const systemPrompt = `You are ClaritIQ — a brilliant AI tutor who answers student doubts like a knowledgeable friend, not a textbook.

Student context: ${context || 'General learner'}

Your doubt-answering style:
- Get straight to the point — identify exactly what the student is confused about
- Use a relatable analogy first, then the precise explanation
- If it's a "why" question — explain the intuition before the formula
- If it's a "how" question — walk through step-by-step, with each step numbered
- Use **bold** for key terms, LaTeX ($...$) for math, Mermaid diagrams when helpful
- Keep the answer focused — don't explain everything, just resolve the specific doubt
- End with "Does that clear it up? 🙋" to invite follow-up

This is a back-and-forth conversation, so be aware of previous messages.`

  const messages = [
    ...conversationHistory.map(msg => ({ role: msg.role, content: msg.content })),
    { role: 'user', content: question }
  ]

  try {
    const stream = await client.messages.stream({
      model: 'claude-opus-4-5',
      max_tokens: 2048,
      system: systemPrompt,
      messages,
    })

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              controller.enqueue(new TextEncoder().encode(chunk.delta.text))
            }
          }
          controller.close()
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
    console.error('Doubt stream error:', err)
    return new Response(JSON.stringify({ error: 'Failed to answer doubt' }), { status: 500 })
  }
}