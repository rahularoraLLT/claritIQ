'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import 'katex/dist/katex.min.css'

export default function Study() {
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [topic, setTopic] = useState('')
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(false)
  const [asked, setAsked] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (!data) { router.push('/onboarding'); return }
      setProfile(data)
    }
    init()
  }, [])

  const askClaude = async () => {
    if (!topic.trim()) return
    setLoading(true)
    setExplanation('')
    setAsked(true)

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          board: profile.board_name,
          classYear: profile.class_year,
          subject: selectedSubject,
          topic: topic.trim()
        })
      })
      const data = await res.json()
      setExplanation(data.explanation)
    } catch (e) {
      setExplanation('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  if (!profile) return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#38bdf8' }}>Loading...</p>
    </div>
  )

  const renderExplanation = (text) => {
  if (!text) return null
  const lines = text.split('\n')
  return lines.map((line, li) => {
    const parts = line.split(/(\*\*.*?\*\*|\$\$[\s\S]*?\$\$|\$[^$]*?\$)/g)
    const rendered = parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: '#f1f5f9' }}>{part.slice(2, -2)}</strong>
      } else if (part.startsWith('$$') && part.endsWith('$$')) {
        try {
          const katex = require('katex')
          return <span key={i} dangerouslySetInnerHTML={{ __html: katex.renderToString(part.slice(2,-2), { displayMode: true, throwOnError: false }) }} />
        } catch { return <span key={i}>{part}</span> }
      } else if (part.startsWith('$') && part.endsWith('$')) {
        try {
          const katex = require('katex')
          return <span key={i} dangerouslySetInnerHTML={{ __html: katex.renderToString(part.slice(1,-1), { displayMode: false, throwOnError: false }) }} />
        } catch { return <span key={i}>{part}</span> }
      }
      return <span key={i}>{part}</span>
    })
    return <p key={li} style={{ margin: '0.3rem 0' }}>{rendered}</p>
  })
}
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', padding: '2rem' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={() => router.push('/dashboard')}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem' }}>←</button>
          <div>
            <h1 style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.3rem', margin: 0 }}>📚 Study</h1>
            <p style={{ color: '#475569', fontSize: '0.8rem', margin: 0 }}>{profile.board_name}{profile.class_year ? ` · ${profile.class_year}` : ''}</p>
          </div>
        </div>

        {/* Subject selector */}
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.8rem' }}>Select a subject</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '2rem' }}>
          {profile.subjects?.map(sub => (
            <button key={sub} onClick={() => { setSelectedSubject(sub); setExplanation(''); setAsked(false); setTopic('') }}
              style={{
                padding: '0.5rem 1.1rem', borderRadius: '50px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600,
                background: selectedSubject === sub ? '#38bdf822' : '#1e293b',
                border: `1.5px solid ${selectedSubject === sub ? '#38bdf8' : '#334155'}`,
                color: selectedSubject === sub ? '#38bdf8' : '#94a3b8'
              }}>
              {sub}
            </button>
          ))}
        </div>

        {/* Topic input */}
        {selectedSubject && (
          <div style={{ background: '#1e293b', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.8rem' }}>
              What topic do you want to study in <span style={{ color: '#38bdf8' }}>{selectedSubject}</span>?
            </p>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <input
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && askClaude()}
                placeholder={`e.g. Newton's Laws, Photosynthesis, Integration...`}
                style={{
                  flex: 1, background: '#0f172a', border: '1.5px solid #334155', borderRadius: '10px',
                  padding: '0.8rem 1rem', color: '#f1f5f9', fontSize: '0.95rem', outline: 'none'
                }}
              />
              <button onClick={askClaude} disabled={loading || !topic.trim()}
                style={{
                  background: loading ? '#1e3a4a' : '#38bdf8', color: loading ? '#475569' : '#0f172a',
                  border: 'none', borderRadius: '10px', padding: '0.8rem 1.4rem',
                  fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.9rem'
                }}>
                {loading ? '...' : 'Explain'}
              </button>
            </div>
          </div>
        )}

        {/* AI Explanation */}
        {loading && (
          <div style={{ background: '#1e293b', borderRadius: '16px', padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: '#38bdf8', fontSize: '0.95rem' }}>✨ Generating explanation...</p>
          </div>
        )}

        {explanation && !loading && (
          <div style={{ background: '#1e293b', borderRadius: '16px', padding: '1.8rem' }}>
            <p style={{ color: '#475569', fontSize: '0.8rem', marginBottom: '1rem' }}>
              📖 {selectedSubject} · {topic}
            </p>
            <div style={{ color: '#e2e8f0', fontSize: '1rem', lineHeight: '1.8' }}>
              {renderExplanation(explanation)}

            </div>
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #334155', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                <button onClick={() => { setTopic(''); setExplanation(''); setAsked(false) }}
                style={{ background: '#0f172a', border: '1px solid #334155', color: '#94a3b8', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                Study another topic
                </button>
                <button onClick={() => {
                    const followUp = window.prompt('What is your doubt?')
                    if (followUp) { setTopic(followUp); setTimeout(askClaude, 100) }
                }}
                style={{ background: '#a78bfa22', border: '1px solid #a78bfa44', color: '#a78bfa', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                    Ask a follow-up doubt 🙋
                </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}