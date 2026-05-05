'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setMessage(error.message)
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1e293b', padding: '2.5rem', borderRadius: '16px', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ color: '#38bdf8', marginBottom: '0.5rem', fontSize: '1.8rem' }}>Welcome back</h1>
        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Log in to your ClaritIQ account</p>

        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
            style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
            style={{ width: '100%', padding: '0.8rem', marginBottom: '1.5rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }} />

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '0.9rem', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        {message && <p style={{ marginTop: '1rem', color: '#f87171', textAlign: 'center' }}>{message}</p>}

        <p style={{ color: '#64748b', textAlign: 'center', marginTop: '1.5rem' }}>
          Don't have an account? <Link href="/signup" style={{ color: '#38bdf8' }}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}