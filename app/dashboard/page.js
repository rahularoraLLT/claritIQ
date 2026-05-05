'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return null

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1e293b', padding: '2.5rem', borderRadius: '16px', width: '100%', maxWidth: '500px', textAlign: 'center' }}>
        <h1 style={{ color: '#38bdf8', fontSize: '2rem', marginBottom: '0.5rem' }}>🎉 You're in!</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Welcome to ClaritIQ</p>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>{user.email}</p>

        <div style={{ background: '#0f172a', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>🚀 The learning engine is coming soon.</p>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.5rem' }}>Board selector, subjects, AI explanations — all being built!</p>
        </div>

        <button onClick={handleLogout}
          style={{ padding: '0.8rem 2rem', background: 'transparent', color: '#f87171', border: '1px solid #f87171', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}>
          Log Out
        </button>
      </div>
    </div>
  )
}