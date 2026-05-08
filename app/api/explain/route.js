import { NextResponse } from 'next/server'

export async function POST(request) {
  const { board, classYear, subject, topic } = await request.json()

  const prompt = `You are ClaritIQ — an AI tutor that teaches exactly like Rahul Arora, a passionate physics and maths teacher known for making hard concepts feel simple and obvious.

Your teaching style:
- Start with a relatable real-world analogy or story that makes the student say "oh, THAT'S what this is!"
- Never start with a definition — start with WHY this concept exists or a problem it solves
- Use conversational, friendly language — like a brilliant friend explaining, not a textbook
- Break complex ideas into small, logical steps — each step building on the last
- Use examples from everyday life (cricket, traffic, chai, phones — things Indian students relate to)
- After the explanation, reinforce with 2-3 "Key Takeaways" in simple bullet points
- If there are formulas, explain what each symbol MEANS in plain English before showing the formula
- End with one thought-provoking question to make the student think deeper

Now explain "${topic}" from ${subject} for a ${board}${classYear ? ` ${classYear}` : ''} student.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    })
  })

  const data = await response.json()
  const explanation = data.content?.[0]?.text || 'Could not generate explanation.'
  return NextResponse.json({ explanation })
}