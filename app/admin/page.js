'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'claritiq-admin-2024'

export default function AdminPage() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [wrongPass, setWrongPass] = useState(false)

  // Cache data
  const [explanations, setExplanations] = useState([])
  const [questions, setQuestions] = useState([])
  const [simulations, setSimulations] = useState([])
  const [activeTab, setActiveTab] = useState('explanations')
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [message, setMessage] = useState('')

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
      loadAll()
    } else {
      setWrongPass(true)
      setTimeout(() => setWrongPass(false), 2000)
    }
  }

  async function loadAll() {
    setLoading(true)
    const [e, q, s] = await Promise.all([
      supabase.from('explanations_cache').select('*').order('created_at', { ascending: false }),
      supabase.from('questions_cache').select('*').order('created_at', { ascending: false }),
      supabase.from('simulations_cache').select('*').order('created_at', { ascending: false }),
    ])
    setExplanations(e.data || [])
    setQuestions(q.data || [])
    setSimulations(s.data || [])
    setLoading(false)
  }

  async function deleteEntry(table, id, cacheKey) {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (!error) {
      setMessage(`✅ Deleted "${cacheKey}" — will regenerate next time`)
      setDeleteConfirm(null)
      loadAll()
      setTimeout(() => setMessage(''), 4000)
    }
  }

  async function deleteAll(table) {
    await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
    setMessage(`✅ Cleared entire ${table} cache`)
    setDeleteConfirm(null)
    loadAll()
    setTimeout(() => setMessage(''), 4000)
  }

  const tabs = [
    { id: 'explanations', label: '📖 Explanations', data: explanations, table: 'explanations_cache' },
    { id: 'questions', label: '📝 Questions', data: questions, table: 'questions_cache' },
    { id: 'simulations', label: '🎮 Simulations', data: simulations, table: 'simulations_cache' },
  ]

  const activeTabData = tabs.find(t => t.id === activeTab)
  const filtered = (activeTabData?.data || []).filter(item =>
    !search || item.topic?.toLowerCase().includes(search.toLowerCase()) ||
    item.board?.toLowerCase().includes(search.toLowerCase()) ||
    item.subject?.toLowerCase().includes(search.toLowerCase())
  )

  const inputStyle = {
    width: '100%', padding: '12px 16px', background: '#1e293b',
    border: '1px solid #334155', borderRadius: 10, color: '#e2e8f0',
    fontSize: '1rem', outline: 'none', boxSizing: 'border-box'
  }

  // ─── Login Screen ──────────────────────────────────────────────────────────
  if (!authed) return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ background: '#0f1729', border: '1px solid #1e293b', borderRadius: 20, padding: 40, width: 360 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🔐</div>
          <h1 style={{ color: '#f1f5f9', fontSize: '1.3rem', fontWeight: 700 }}>ClaritIQ Admin</h1>
          <p style={{ color: '#475569', fontSize: '0.85rem', marginTop: 4 }}>Cache management panel</p>
        </div>
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={{ ...inputStyle, marginBottom: 16, borderColor: wrongPass ? '#ef4444' : '#334155' }}
        />
        {wrongPass && <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: 12 }}>Wrong password</p>}
        <button
          onClick={handleLogin}
          style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}
        >
          Login
        </button>
        <button
          onClick={() => router.push('/dashboard')}
          style={{ width: '100%', padding: '10px', marginTop: 12, borderRadius: 10, border: '1px solid #334155', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}
        >
          ← Back to App
        </button>
      </div>
    </div>
  )

  // ─── Admin Panel ───────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: '#0f1729', borderBottom: '1px solid #1e293b', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.1rem' }}>🔐 ClaritIQ Admin</span>
          <span style={{ color: '#475569', fontSize: '0.8rem', marginLeft: 12 }}>Cache Management</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={loadAll} style={{ padding: '6px 14px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#94a3b8', cursor: 'pointer' }}>🔄 Refresh</button>
          <button onClick={() => router.push('/dashboard')} style={{ padding: '6px 14px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#94a3b8', cursor: 'pointer' }}>← App</button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {tabs.map(t => (
            <div key={t.id} style={{ background: '#0f1729', border: '1px solid #1e293b', borderRadius: 12, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#60a5fa' }}>{t.data.length}</div>
              <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: 4 }}>{t.label} cached</div>
            </div>
          ))}
        </div>

        {/* Message */}
        {message && (
          <div style={{ background: '#064e3b', border: '1px solid #10b981', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: '#34d399' }}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: '8px 18px', borderRadius: 10, border: '1px solid',
              borderColor: activeTab === t.id ? '#3b82f6' : '#334155',
              background: activeTab === t.id ? '#1d4ed8' : '#1e293b',
              color: activeTab === t.id ? '#fff' : '#94a3b8', cursor: 'pointer', fontWeight: 600,
            }}>
              {t.label} ({t.data.length})
            </button>
          ))}
        </div>

        {/* Search + Clear All */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <input
            placeholder="Search by topic, board, subject..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
          />
          <button
            onClick={() => setDeleteConfirm({ type: 'all', table: activeTabData?.table })}
            style={{ padding: '10px 18px', borderRadius: 10, border: '1px solid #ef4444', background: 'transparent', color: '#f87171', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600 }}
          >
            🗑 Clear All
          </button>
        </div>

        {/* Delete confirmation modal */}
        {deleteConfirm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ background: '#0f1729', border: '1px solid #334155', borderRadius: 16, padding: 32, maxWidth: 400, width: '90%' }}>
              <h3 style={{ color: '#f1f5f9', marginBottom: 12 }}>⚠️ Confirm Delete</h3>
              <p style={{ color: '#94a3b8', marginBottom: 24, lineHeight: 1.6 }}>
                {deleteConfirm.type === 'all'
                  ? `This will clear ALL cached ${activeTab}. They will regenerate fresh next time students study.`
                  : `Delete cache for "${deleteConfirm.cacheKey}"? It will regenerate next time.`
                }
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => deleteConfirm.type === 'all'
                    ? deleteAll(deleteConfirm.table)
                    : deleteEntry(deleteConfirm.table, deleteConfirm.id, deleteConfirm.cacheKey)
                  }
                  style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', background: '#dc2626', color: '#fff', cursor: 'pointer', fontWeight: 700 }}
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1px solid #334155', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cache entries */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#475569' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#475569' }}>
            {search ? 'No results found' : 'No cached entries yet'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(item => (
              <div key={item.id} style={{
                background: '#0f1729', border: '1px solid #1e293b', borderRadius: 12,
                padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#f1f5f9', fontWeight: 600, marginBottom: 4 }}>{item.topic}</div>
                  <div style={{ color: '#475569', fontSize: '0.8rem' }}>
                    {[item.board, item.class_year, item.subject, item.chapter].filter(Boolean).join(' › ')}
                  </div>
                  <div style={{ color: '#334155', fontSize: '0.75rem', marginTop: 4 }}>
                    Cached: {new Date(item.created_at).toLocaleString('en-IN')}
                    {item.difficulty && ` · ${item.difficulty}`}
                    {item.questions && ` · ${item.questions.length} questions`}
                  </div>
                </div>
                <button
                  onClick={() => setDeleteConfirm({ type: 'single', table: activeTabData?.table, id: item.id, cacheKey: item.topic })}
                  style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #450a0a', background: 'transparent', color: '#f87171', cursor: 'pointer', fontSize: '0.85rem', flexShrink: 0 }}
                >
                  🗑 Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}