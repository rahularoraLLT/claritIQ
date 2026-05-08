'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { BOARDS } from '../../lib/boards'

export default function Onboarding() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState(null)
  const [selectedBoard, setSelectedBoard] = useState(null)
  const [selectedClass, setSelectedClass] = useState(null)
  const [selectedSubjects, setSelectedSubjects] = useState([])
  const [saving, setSaving] = useState(false)
  useEffect(() => {
  const check = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) router.push('/login')
  }
  check()
}, [])

  const categoryData = category ? BOARDS[category] : null
  const boardData = selectedBoard ? categoryData?.options.find(b => b.id === selectedBoard) : null
  const availableSubjects = boardData
    ? (Array.isArray(boardData.subjects) ? boardData.subjects : boardData.subjects[selectedClass]) || []
    : []

  const toggleSubject = (sub) => {
    setSelectedSubjects(prev =>
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    )
  }

  const handleSave = async () => {
    if (selectedSubjects.length === 0) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    await supabase.from('profiles').upsert({
      id: user.id,
      category,
      board_id: selectedBoard,
      board_name: boardData?.name,
      class_year: selectedClass || null,
      subjects: selectedSubjects,
    })

    router.push('/dashboard')
  }

  const s = {
    page: { minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
    card: { background: '#1e293b', borderRadius: '20px', padding: '2.5rem', width: '100%', maxWidth: '600px' },
    title: { color: '#f1f5f9', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.4rem' },
    sub: { color: '#64748b', fontSize: '0.95rem', marginBottom: '2rem' },
    grid: { display: 'grid', gap: '0.8rem' },
    grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.8rem' },
    btn: (active, color = '#38bdf8') => ({
      background: active ? `${color}22` : '#0f172a',
      border: `1.5px solid ${active ? color : '#334155'}`,
      borderRadius: '12px', padding: '1rem', cursor: 'pointer', textAlign: 'left',
      transition: 'all 0.15s'
    }),
    back: { background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.9rem', marginBottom: '1.5rem', padding: 0 },
    next: (on) => ({
      marginTop: '2rem', width: '100%', padding: '0.9rem', borderRadius: '10px',
      background: on ? '#38bdf8' : '#1e3a4a', color: on ? '#0f172a' : '#475569',
      border: 'none', fontSize: '1rem', fontWeight: 700, cursor: on ? 'pointer' : 'not-allowed'
    }),
  }

  return (
    <div style={s.page}>
      <div style={s.card}>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '2rem' }}>
          {[1,2,3].map(n => (
            <div key={n} style={{ height: '4px', flex: 1, borderRadius: '4px', background: n <= step ? '#38bdf8' : '#334155' }} />
          ))}
        </div>

        {/* STEP 1 — Category */}
        {step === 1 && (
          <>
            <h2 style={s.title}>What are you studying for?</h2>
            <p style={s.sub}>Choose your goal — you can change this later</p>
            <div style={s.grid}>
              {Object.entries(BOARDS).map(([key, val]) => (
                <button key={key} style={s.btn(category === key)} onClick={() => setCategory(key)}>
                  <span style={{ fontSize: '1.4rem' }}>{val.emoji}</span>
                  <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '1rem', marginLeft: '0.8rem' }}>{val.label}</span>
                </button>
              ))}
            </div>
            <button style={s.next(!!category)} disabled={!category} onClick={() => setStep(2)}>
              Continue →
            </button>
          </>
        )}

        {/* STEP 2 — Board + Class */}
        {step === 2 && (
          <>
            <button style={s.back} onClick={() => setStep(1)}>← Back</button>
            <h2 style={s.title}>Pick your {category === 'entrance' ? 'exam' : category === 'board' ? 'board' : 'degree'}</h2>
            <p style={s.sub}>{categoryData?.label}</p>
            <div style={s.grid3}>
              {categoryData?.options.map(opt => (
                <button key={opt.id} style={s.btn(selectedBoard === opt.id)} onClick={() => { setSelectedBoard(opt.id); setSelectedClass(null); setSelectedSubjects([]) }}>
                  <span style={{ color: selectedBoard === opt.id ? '#38bdf8' : '#94a3b8', fontWeight: 600, fontSize: '0.9rem' }}>{opt.name}</span>
                </button>
              ))}
            </div>

            {/* Class selector — only for board/university */}
            {boardData?.classes && (
              <div style={{ marginTop: '1.5rem' }}>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.8rem' }}>
                  {category === 'university' ? 'Select your year' : 'Select your class'}
                </p>
                <div style={s.grid3}>
                  {boardData.classes.map(cls => (
                    <button key={cls} style={s.btn(selectedClass === cls, '#a78bfa')} onClick={() => { setSelectedClass(cls); setSelectedSubjects([]) }}>
                      <span style={{ color: selectedClass === cls ? '#a78bfa' : '#94a3b8', fontWeight: 600, fontSize: '0.85rem' }}>{cls}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              style={s.next(selectedBoard && (boardData?.classes ? !!selectedClass : true))}
              disabled={!selectedBoard || (boardData?.classes && !selectedClass)}
              onClick={() => setStep(3)}>
              Continue →
            </button>
          </>
        )}

        {/* STEP 3 — Subjects */}
        {step === 3 && (
          <>
            <button style={s.back} onClick={() => setStep(2)}>← Back</button>
            <h2 style={s.title}>Pick your subjects</h2>
            <p style={s.sub}>Select all subjects you want to study</p>
            <div style={s.grid3}>
              {availableSubjects.map(sub => (
                <button key={sub} style={s.btn(selectedSubjects.includes(sub), '#34d399')} onClick={() => toggleSubject(sub)}>
                  <span style={{ color: selectedSubjects.includes(sub) ? '#34d399' : '#94a3b8', fontWeight: 600, fontSize: '0.85rem' }}>{sub}</span>
                </button>
              ))}
            </div>
            <button
              style={s.next(selectedSubjects.length > 0)}
              disabled={selectedSubjects.length === 0 || saving}
              onClick={handleSave}>
              {saving ? 'Saving...' : "Let's Start Learning 🚀"}
            </button>
          </>
        )}

      </div>
    </div>
  )
}