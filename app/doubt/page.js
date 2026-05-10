'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

// Reuse the same renderContent and renderInline from study page
function renderInline(text) {
  if (!text) return ''
  const parts = []
  const regex = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\*\*[^*]+?\*\*|`[^`]+`)/g
  let last = 0
  let match
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    const token = match[0]
    if (token.startsWith('$$') || token.startsWith('$')) {
      parts.push(
        <span key={match.index} style={{ color: '#fbbf24', fontFamily: 'monospace' }}>
          {token}
        </span>
      )
    } else if (token.startsWith('**')) {
      parts.push(<strong key={match.index} style={{ color: '#f1f5f9' }}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('`')) {
      parts.push(
        <code key={match.index} style={{ background: '#1e293b', color: '#34d399', padding: '1px 6px', borderRadius: 4, fontSize: '0.875em' }}>
          {token.slice(1, -1)}
        </code>
      )
    }
    last = match.index + token.length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts
}

function renderMessage(text) {
  if (!text) return []
  const lines = text.split('\n')
  const elements = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.startsWith('## ')) {
      elements.push(<h3 key={i} style={{ color: '#60a5fa', fontSize: '1rem', fontWeight: 700, margin: '0.8rem 0 0.3rem' }}>{renderInline(line.replace(/^## /, ''))}</h3>)
    } else if (line.startsWith('### ')) {
      elements.push(<h4 key={i} style={{ color: '#a78bfa', fontSize: '0.95rem', fontWeight: 600, margin: '0.6rem 0 0.2rem' }}>{renderInline(line.replace(/^### /, ''))}</h4>)
    } else if (line.trim() === '---') {
      elements.push(<hr key={i} style={{ border: 'none', borderTop: '1px solid #334155', margin: '0.8rem 0' }} />)
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const items = []
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(lines[i].replace(/^[-*] /, ''))
        i++
      }
      elements.push(<ul key={`ul-${i}`} style={{ paddingLeft: '1.2rem', margin: '0.3rem 0', color: '#e2e8f0' }}>{items.map((it, li) => <li key={li} style={{ margin: '0.2rem 0' }}>{renderInline(it)}</li>)}</ul>)
      continue
    } else if (/^\d+\. /.test(line)) {
      const items = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ''))
        i++
      }
      elements.push(<ol key={`ol-${i}`} style={{ paddingLeft: '1.2rem', margin: '0.3rem 0', color: '#e2e8f0' }}>{items.map((it, li) => <li key={li} style={{ margin: '0.2rem 0' }}>{renderInline(it)}</li>)}</ol>)
      continue
    } else if (line.trim() === '') {
      elements.push(<div key={i} style={{ height: '0.4rem' }} />)
    } else {
      elements.push(<p key={i} style={{ color: '#e2e8f0', lineHeight: 1.75, margin: '0.2rem 0' }}>{renderInline(line)}</p>)
    }
    i++
  }
  return elements
}

const SUGGESTED_QUESTIONS = [
  "Why does a heavier object not fall faster than a lighter one?",
  "What is the difference between speed and velocity?",
  "Why does ice float on water?",
  "How does photosynthesis actually make food?",
  "What exactly happens during meiosis?",
  "Why is the sky blue?",
  "What is the intuition behind differentiation?",
  "Why is NaCl (salt) soluble in water?",
]

export default function DoubtPage() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState(null)
  const [messages, setMessages] = useState([]) // { role: 'user'|'assistant', content: string }
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const abortRef = useRef(null)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) setProfile(data)
    }
    load()
  }, [])

  // Load MathJax
  useEffect(() => {
    if (typeof window === 'undefined' || window.MathJax) return
    window.MathJax = {
      tex: { inlineMath: [['$', '$'], ['\\(', '\\)']], displayMath: [['$$', '$$'], ['\\[', '\\]']] },
      startup: { typeset: false }
    }
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js'
    script.async = true
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming])

  async function handleSend(questionOverride) {
    const question = (questionOverride || input).trim()
    if (!question || isStreaming) return

    const userMsg = { role: 'user', content: question }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setIsStreaming(true)

    // Add empty assistant message to stream into
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch('/api/doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          board: profile?.board,
          classYear: profile?.class_year,
          subject: profile?.subjects?.[0],
          conversationHistory: messages, // send history for context
        }),
        signal: controller.signal,
      })

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: updated[updated.length - 1].content + chunk
          }
          return updated
        })
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: '❌ Something went wrong. Please try again.' }
          return updated
        })
      }
    } finally {
      setIsStreaming(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: '#0f1729', borderBottom: '1px solid #1e293b', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}>←</button>
          <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: '1.1rem' }}>🙋 Ask a Doubt</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => router.push('/study')} style={{ padding: '6px 14px', background: '#1e293b', border: '1px solid #334155', borderRadius: 20, color: '#60a5fa', cursor: 'pointer', fontSize: '0.85rem' }}>📚 Study</button>
          <button onClick={() => router.push('/practice')} style={{ padding: '6px 14px', background: '#1e293b', border: '1px solid #334155', borderRadius: 20, color: '#34d399', cursor: 'pointer', fontSize: '0.85rem' }}>📝 Practice</button>
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px', maxWidth: 800, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>

        {/* Empty state with suggestions */}
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 40 }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🤔</div>
            <h2 style={{ color: '#f1f5f9', fontSize: '1.3rem', fontWeight: 600, marginBottom: 8 }}>What's confusing you?</h2>
            <p style={{ color: '#64748b', marginBottom: 32 }}>Ask anything — from "why does this formula work" to "explain this concept from scratch"</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, textAlign: 'left' }}>
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  style={{
                    padding: '12px 16px', background: '#0f1729', border: '1px solid #1e293b',
                    borderRadius: 12, color: '#94a3b8', cursor: 'pointer', textAlign: 'left',
                    fontSize: '0.85rem', lineHeight: 1.5, transition: 'border-color 0.15s',
                  }}
                  onMouseOver={e => e.currentTarget.style.borderColor = '#3b82f6'}
                  onMouseOut={e => e.currentTarget.style.borderColor = '#1e293b'}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 20,
            }}
          >
            {msg.role === 'assistant' && (
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0, marginRight: 12, marginTop: 4 }}>
                🤖
              </div>
            )}
            <div
              style={{
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.role === 'user' ? 'linear-gradient(135deg, #2563eb, #7c3aed)' : '#0f1729',
                border: msg.role === 'assistant' ? '1px solid #1e293b' : 'none',
                color: '#e2e8f0',
                fontSize: '0.95rem',
              }}
            >
              {msg.role === 'user'
                ? <p style={{ margin: 0, color: '#fff', lineHeight: 1.6 }}>{msg.content}</p>
                : renderMessage(msg.content)
              }
              {msg.role === 'assistant' && idx === messages.length - 1 && isStreaming && (
                <span style={{ display: 'inline-block', width: 8, height: 16, background: '#60a5fa', marginLeft: 2, animation: 'blink 1s infinite', borderRadius: 2, verticalAlign: 'middle' }} />
              )}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{ background: '#0f1729', borderTop: '1px solid #1e293b', padding: '16px', flexShrink: 0 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px' }}
            onKeyDown={handleKeyDown}
            placeholder="Type your doubt here... (Press Enter to send, Shift+Enter for new line)"
            rows={1}
            style={{
              flex: 1, padding: '12px 16px', background: '#1e293b', border: '1px solid #334155',
              borderRadius: 12, color: '#e2e8f0', fontSize: '0.95rem', resize: 'none',
              outline: 'none', lineHeight: 1.5, fontFamily: 'inherit', maxHeight: 120, overflowY: 'auto'
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isStreaming}
            style={{
              padding: '12px 20px', borderRadius: 12, border: 'none', fontWeight: 600, fontSize: '1rem',
              cursor: input.trim() && !isStreaming ? 'pointer' : 'not-allowed',
              background: input.trim() && !isStreaming ? 'linear-gradient(135deg, #2563eb, #7c3aed)' : '#1e293b',
              color: input.trim() && !isStreaming ? '#fff' : '#475569',
              flexShrink: 0, transition: 'all 0.2s', height: 48,
            }}
          >
            {isStreaming ? '⏳' : '→'}
          </button>
        </div>
        <p style={{ textAlign: 'center', color: '#334155', fontSize: '0.75rem', marginTop: 8 }}>
          {messages.length > 0 ? 'Continue your conversation — ClaritIQ remembers this session' : 'ClaritIQ answers like your smartest friend, not a textbook'}
        </p>
      </div>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }
      `}</style>
    </div>
  )
}