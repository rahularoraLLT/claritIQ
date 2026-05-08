'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (!data) { router.push('/onboarding'); return }
      setProfile(data)
    }
    init()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!profile) return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#38bdf8' }}>Loading...</p>
    </div>
  )

  const modes = [
    { icon: '📚', title: 'Study', desc: 'AI-guided lessons, adaptive to your level', path: '/study', color: '#38bdf8' },
    { icon: '🙋', title: 'Ask a Doubt', desc: 'Ask anything, get instant clarity', path: '/doubt', color: '#a78bfa' },
    { icon: '📝', title: 'Practice', desc: 'Topic or chapter-wise questions', path: '/practice', color: '#34d399' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', padding: '2rem' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <span style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.3rem' }}>ClaritIQ</span>
          <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #f8717144', color: '#f87171', padding: '0.4rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
            Log Out
          </button>
        </div>

        {/* Greeting */}
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Welcome back 👋</p>
        <h1 style={{ color: '#f1f5f9', fontSize: '1.6rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          {user?.email?.split('@')[0]}
        </h1>

        {/* Profile card */}
        <div style={{ background: '#1e293b', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#475569', fontSize: '0.8rem', marginBottom: '0.3rem' }}>Currently studying</p>
            <p style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.1rem' }}>
              {profile.board_name}{profile.class_year ? ` · ${profile.class_year}` : ''}
            </p>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.3rem' }}>
              {profile.subjects?.join(' · ')}
            </p>
          </div>
          <button onClick={() => router.push('/onboarding')}
            style={{ background: 'none', border: '1px solid #334155', color: '#94a3b8', padding: '0.4rem 0.9rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>
            Change
          </button>
        </div>

        {/* Mode cards */}
        <p style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '1rem' }}>What do you want to do today?</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {modes.map(m => (
            <button key={m.title} onClick={() => router.push(m.path)}
              style={{ background: '#1e293b', border: `1px solid ${m.color}33`, borderRadius: '16px', padding: '1.5rem', textAlign: 'left', cursor: 'pointer' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>{m.icon}</div>
              <p style={{ color: m.color, fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem' }}>{m.title}</p>
              <p style={{ color: '#475569', fontSize: '0.8rem' }}>{m.desc}</p>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}