'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('✅ Check your email to confirm your account!')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1e293b', padding: '2.5rem', borderRadius: '16px', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ color: '#38bdf8', marginBottom: '0.5rem', fontSize: '1.8rem' }}>Join ClaritIQ</h1>
        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Create your free student account</p>

        <form onSubmit={handleSignup}>
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required
            style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }} />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
            style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
            style={{ width: '100%', padding: '0.8rem', marginBottom: '1.5rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }} />

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '0.9rem', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {message && <p style={{ marginTop: '1rem', color: message.includes('✅') ? '#4ade80' : '#f87171', textAlign: 'center' }}>{message}</p>}

        <p style={{ color: '#64748b', textAlign: 'center', marginTop: '1.5rem' }}>
          Already have an account? <Link href="/login" style={{ color: '#38bdf8' }}>Log in</Link>
        </p>
      </div>
    </div>
  )
}