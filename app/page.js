'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null) // 'success' | 'error' | null
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    const { error } = await supabase.from('waitlist').insert([{ email }])

    if (error) {
      setStatus('error')
    } else {
      setStatus('success')
      setEmail('')
    }
    setLoading(false)
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      color: 'white',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{ marginBottom: '1rem', fontSize: '3rem' }}>⚡</div>
      <h1 style={{
        fontSize: '3.5rem',
        fontWeight: '800',
        margin: '0 0 0.5rem',
        letterSpacing: '-1px'
      }}>
        Clarit<span style={{ color: '#38bdf8' }}>IQ</span>
      </h1>
      <p style={{
        fontSize: '1.3rem',
        color: '#94a3b8',
        marginBottom: '2rem',
        maxWidth: '500px'
      }}>
        Finally, clarity. For every student.
      </p>
      <p style={{
        fontSize: '1rem',
        color: '#64748b',
        maxWidth: '420px',
        lineHeight: '1.7'
      }}>
        AI-powered adaptive learning for CBSE, ICSE, JEE, NEET, CUET and more.
        Personalised to your level. Available 24/7.
      </p>

      <div style={{ marginTop: '2.5rem', width: '100%', maxWidth: '420px' }}>
        {status === 'success' ? (
          <p style={{
            fontSize: '1.1rem',
            color: '#38bdf8',
            fontWeight: '600',
            padding: '1rem',
            border: '1px solid #1e40af',
            borderRadius: '12px',
            background: 'rgba(56, 189, 248, 0.08)'
          }}>
            You&apos;re on the list! 🎉
          </p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                flex: 1,
                padding: '0.9rem 1.2rem',
                borderRadius: '50px',
                border: '1px solid #334155',
                background: 'rgba(255,255,255,0.05)',
                color: 'white',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? '#1e40af' : '#38bdf8',
                color: '#0f172a',
                border: 'none',
                padding: '0.9rem 1.6rem',
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
                transition: 'background 0.2s'
              }}
            >
              {loading ? '...' : 'Get Early Access'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p style={{
            marginTop: '0.75rem',
            fontSize: '0.9rem',
            color: '#f87171'
          }}>
            Something went wrong. Please try again.
          </p>
        )}
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <button style={{
          background: 'transparent',
          color: '#94a3b8',
          border: '1px solid #334155',
          padding: '0.9rem 2.2rem',
          borderRadius: '50px',
          fontSize: '1rem',
          cursor: 'pointer'
        }}>
          Learn More
        </button>
      </div>

      <p style={{ marginTop: '3rem', fontSize: '0.8rem', color: '#475569' }}>
        🚀 Launching soon · Built for India&apos;s 250M+ students
      </p>
    </main>
  )
}
