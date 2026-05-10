'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { getBoards, getClassYears, getSubjects, getChapters, getTopics } from '@/lib/syllabus'

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: '🟢 Easy', desc: 'Basic recall' },
  { value: 'medium', label: '🟡 Medium', desc: 'Understanding' },
  { value: 'hard', label: '🔴 Hard', desc: 'Application' },
]

const COUNT_OPTIONS = [5, 10, 15]

export default function PracticePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [profile, setProfile] = useState(null)

  // Selection
  const [selectedBoard, setSelectedBoard] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedChapter, setSelectedChapter] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('')
  const [customTopic, setCustomTopic] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [difficulty, setDifficulty] = useState('medium')
  const [count, setCount] = useState(5)

  // Quiz state
  const [phase, setPhase] = useState('setup') // setup | loading | quiz | results
  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({}) // { questionId: selectedOption }
  const [showExplanation, setShowExplanation] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const b = searchParams.get('board')
    const c = searchParams.get('classYear')
    const s = searchParams.get('subject')
    const ch = searchParams.get('chapter')
    const t = searchParams.get('topic')
    if (b) setSelectedBoard(b)
    if (c) setSelectedClass(c)
    if (s) setSelectedSubject(s)
    if (ch) setSelectedChapter(ch)
    if (t) setSelectedTopic(decodeURIComponent(t))
  }, [])
  
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setProfile(data)
        if (!searchParams.get('board')) setSelectedBoard(data.board || '')
        if (!searchParams.get('classYear')) setSelectedClass(data.class_year || '')
      }
    }
    load()
  }, [])

  const boards = getBoards()
  const classYears = selectedBoard ? getClassYears(selectedBoard) : []
  const subjects = (selectedBoard && selectedClass) ? getSubjects(selectedBoard, selectedClass) : []
  const chapters = (selectedBoard && selectedClass && selectedSubject) ? getChapters(selectedBoard, selectedClass, selectedSubject) : []
  const topics = (selectedBoard && selectedClass && selectedSubject && selectedChapter) ? getTopics(selectedBoard, selectedClass, selectedSubject, selectedChapter) : []
  const effectiveTopic = useCustom ? customTopic.trim() : selectedTopic

  async function startQuiz() {
    if (!effectiveTopic) return
    setPhase('loading')
    setError('')
    setAnswers({})
    setCurrentQ(0)
    setShowExplanation(false)

    try {
      const res = await fetch('/api/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          board: selectedBoard, classYear: selectedClass,
          subject: selectedSubject, chapter: selectedChapter,
          topic: effectiveTopic, difficulty, count,
        })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setQuestions(data.questions || [])
      setPhase('quiz')
    } catch (err) {
      setError('Failed to generate questions. Please try again.')
      setPhase('setup')
    }
  }

  function handleAnswer(option) {
    if (answers[currentQ] !== undefined) return // already answered
    setAnswers(prev => ({ ...prev, [currentQ]: option }))
    setShowExplanation(true)
  }

  function nextQuestion() {
    setShowExplanation(false)
    if (currentQ + 1 >= questions.length) {
      setPhase('results')
    } else {
      setCurrentQ(currentQ + 1)
    }
  }

  function calculateScore() {
    let correct = 0
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) correct++
    })
    return correct
  }

  const selectStyle = {
    width: '100%', padding: '10px 14px', background: '#1e293b',
    border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0',
    fontSize: '0.9rem', outline: 'none',
  }
  const labelStyle = {
    display: 'block', color: '#94a3b8', fontSize: '0.75rem',
    fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em'
  }

  // ─── Setup Screen ──────────────────────────────────────────────────────────
  if (phase === 'setup') return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ background: '#0f1729', borderBottom: '1px solid #1e293b', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}>←</button>
          <span style={{ color: '#34d399', fontWeight: 700, fontSize: '1.1rem' }}>📝 Practice Mode</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => router.push('/study')} style={{ padding: '6px 14px', background: '#1e293b', border: '1px solid #334155', borderRadius: 20, color: '#60a5fa', cursor: 'pointer', fontSize: '0.85rem' }}>📚 Study</button>
          <button onClick={() => router.push('/doubt')} style={{ padding: '6px 14px', background: '#1e293b', border: '1px solid #334155', borderRadius: 20, color: '#a78bfa', cursor: 'pointer', fontSize: '0.85rem' }}>🙋 Ask Doubt</button>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ background: '#0f1729', border: '1px solid #1e293b', borderRadius: 16, padding: 28 }}>
          <h2 style={{ color: '#f1f5f9', fontSize: '1.1rem', fontWeight: 600, marginBottom: 24 }}>🎯 Set Up Your Practice Session</h2>

          {/* Board + Class */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>Board / Exam</label>
              <select style={selectStyle} value={selectedBoard} onChange={e => { setSelectedBoard(e.target.value); setSelectedClass(''); setSelectedSubject(''); setSelectedChapter(''); setSelectedTopic('') }}>
                <option value="">Select Board</option>
                {boards.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            {classYears.length > 0 && (
              <div>
                <label style={labelStyle}>Class / Level</label>
                <select style={selectStyle} value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setSelectedSubject(''); setSelectedChapter(''); setSelectedTopic('') }}>
                  <option value="">Select Class</option>
                  {classYears.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}
            {subjects.length > 0 && (
              <div>
                <label style={labelStyle}>Subject</label>
                <select style={selectStyle} value={selectedSubject} onChange={e => { setSelectedSubject(e.target.value); setSelectedChapter(''); setSelectedTopic('') }}>
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
            {chapters.length > 0 && (
              <div>
                <label style={labelStyle}>Chapter</label>
                <select style={selectStyle} value={selectedChapter} onChange={e => { setSelectedChapter(e.target.value); setSelectedTopic('') }}>
                  <option value="">Select Chapter</option>
                  {chapters.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}
          </div>

          {/* Topic pills */}
          {topics.length > 0 && !useCustom && (
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Topic</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {topics.map(t => (
                  <button key={t} onClick={() => setSelectedTopic(t)} style={{
                    padding: '5px 12px', borderRadius: 20, fontSize: '0.85rem', cursor: 'pointer', border: '1px solid',
                    borderColor: selectedTopic === t ? '#10b981' : '#334155',
                    background: selectedTopic === t ? '#064e3b' : '#1e293b',
                    color: selectedTopic === t ? '#34d399' : '#94a3b8',
                  }}>{t}</button>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => { setUseCustom(!useCustom); setSelectedTopic('') }} style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline', marginBottom: 16 }}>
            {useCustom ? '← Back to topic menu' : '✏️ Type my own topic'}
          </button>

          {useCustom && (
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Custom Topic</label>
              <input
                type="text" value={customTopic} onChange={e => setCustomTopic(e.target.value)}
                placeholder="e.g. Newton's Third Law, Quadratic Formula..."
                style={{ ...selectStyle, boxSizing: 'border-box', cursor: 'text' }}
              />
            </div>
          )}

          {/* Difficulty */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Difficulty</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {DIFFICULTY_OPTIONS.map(d => (
                <button key={d.value} onClick={() => setDifficulty(d.value)} style={{
                  flex: 1, padding: '10px 8px', borderRadius: 10, border: '1px solid', cursor: 'pointer',
                  borderColor: difficulty === d.value ? '#3b82f6' : '#334155',
                  background: difficulty === d.value ? '#1d4ed8' : '#1e293b',
                  color: difficulty === d.value ? '#fff' : '#94a3b8', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1rem' }}>{d.label}</div>
                  <div style={{ fontSize: '0.7rem', marginTop: 2, opacity: 0.8 }}>{d.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Number of Questions</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {COUNT_OPTIONS.map(n => (
                <button key={n} onClick={() => setCount(n)} style={{
                  flex: 1, padding: '10px', borderRadius: 10, border: '1px solid', cursor: 'pointer',
                  borderColor: count === n ? '#3b82f6' : '#334155',
                  background: count === n ? '#1d4ed8' : '#1e293b',
                  color: count === n ? '#fff' : '#94a3b8', fontWeight: 600,
                }}>{n} Qs</button>
              ))}
            </div>
          </div>

          {error && <p style={{ color: '#f87171', fontSize: '0.9rem', marginBottom: 16 }}>{error}</p>}

          <button
            onClick={startQuiz}
            disabled={!effectiveTopic}
            style={{
              width: '100%', padding: '14px', borderRadius: 12, border: 'none', fontWeight: 700, fontSize: '1rem',
              cursor: effectiveTopic ? 'pointer' : 'not-allowed',
              background: effectiveTopic ? 'linear-gradient(135deg, #059669, #0284c7)' : '#1e293b',
              color: effectiveTopic ? '#fff' : '#475569',
            }}
          >
            🚀 Start Practice
          </button>
        </div>
      </div>
    </div>
  )

  // ─── Loading Screen ─────────────────────────────────────────────────────────
  if (phase === 'loading') return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 20, animation: 'spin 2s linear infinite', display: 'inline-block' }}>⚙️</div>
        <p style={{ color: '#60a5fa', fontSize: '1.1rem' }}>Crafting {count} questions on {effectiveTopic}...</p>
        <p style={{ color: '#475569', fontSize: '0.85rem', marginTop: 8 }}>Making sure they actually test your understanding</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  // ─── Quiz Screen ────────────────────────────────────────────────────────────
  if (phase === 'quiz') {
    const q = questions[currentQ]
    const selected = answers[currentQ]
    const isAnswered = selected !== undefined

    return (
      <div style={{ minHeight: '100vh', background: '#0a0f1e', fontFamily: "'Inter', system-ui, sans-serif" }}>
        {/* Header */}
        <div style={{ background: '#0f1729', borderBottom: '1px solid #1e293b', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#34d399', fontWeight: 700 }}>📝 Practice: {effectiveTopic}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Q{currentQ + 1} of {questions.length}</span>
            <button onClick={() => setPhase('setup')} style={{ background: 'none', border: '1px solid #334155', borderRadius: 8, color: '#94a3b8', padding: '4px 12px', cursor: 'pointer', fontSize: '0.85rem' }}>✕ Quit</button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: '#1e293b' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, #059669, #0284c7)', width: `${((currentQ + (isAnswered ? 1 : 0)) / questions.length) * 100}%`, transition: 'width 0.3s' }} />
        </div>

        <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 16px' }}>
          {/* Question */}
          <div style={{ background: '#0f1729', border: '1px solid #1e293b', borderRadius: 16, padding: 28, marginBottom: 16 }}>
            <div style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Question {currentQ + 1} · {difficulty} difficulty
            </div>
            <p style={{ color: '#f1f5f9', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
              {q.question}
            </p>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            {Object.entries(q.options).map(([key, value]) => {
              const isSelected = selected === key
              const isCorrect = key === q.correct
              let borderColor = '#334155'
              let bg = '#0f1729'
              let color = '#e2e8f0'

              if (isAnswered) {
                if (isCorrect) { borderColor = '#10b981'; bg = '#064e3b'; color = '#34d399' }
                else if (isSelected && !isCorrect) { borderColor = '#ef4444'; bg = '#450a0a'; color = '#fca5a5' }
              } else if (isSelected) {
                borderColor = '#3b82f6'; bg = '#1e3a5f'; color = '#93c5fd'
              }

              return (
                <button
                  key={key}
                  onClick={() => handleAnswer(key)}
                  disabled={isAnswered}
                  style={{
                    padding: '14px 18px', borderRadius: 12, border: `1px solid ${borderColor}`,
                    background: bg, color, textAlign: 'left', cursor: isAnswered ? 'default' : 'pointer',
                    fontSize: '0.95rem', lineHeight: 1.5, transition: 'all 0.2s', display: 'flex', gap: 12, alignItems: 'flex-start',
                  }}
                >
                  <span style={{
                    minWidth: 28, height: 28, borderRadius: '50%', border: `1px solid ${borderColor}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0
                  }}>{key}</span>
                  <span>{value}</span>
                  {isAnswered && isCorrect && <span style={{ marginLeft: 'auto', fontSize: '1.1rem' }}>✅</span>}
                  {isAnswered && isSelected && !isCorrect && <span style={{ marginLeft: 'auto', fontSize: '1.1rem' }}>❌</span>}
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div style={{ background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <div style={{ color: '#60a5fa', fontWeight: 600, marginBottom: 8 }}>
                {answers[currentQ] === q.correct ? '✅ Correct!' : `❌ Incorrect — The correct answer is ${q.correct}`}
              </div>
              <p style={{ color: '#cbd5e1', lineHeight: 1.7, margin: 0, fontSize: '0.95rem' }}>{q.explanation}</p>
            </div>
          )}

          {/* Next button */}
          {isAnswered && (
            <button
              onClick={nextQuestion}
              style={{
                width: '100%', padding: '14px', borderRadius: 12, border: 'none', fontWeight: 700, fontSize: '1rem',
                cursor: 'pointer', background: 'linear-gradient(135deg, #059669, #0284c7)', color: '#fff',
              }}
            >
              {currentQ + 1 >= questions.length ? '📊 See Results' : 'Next Question →'}
            </button>
          )}
        </div>
      </div>
    )
  }

  // ─── Results Screen ─────────────────────────────────────────────────────────
  if (phase === 'results') {
    const score = calculateScore()
    const pct = Math.round((score / questions.length) * 100)
    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : pct >= 40 ? '📚' : '💪'
    const message = pct >= 80 ? 'Outstanding! You really know this topic.' : pct >= 60 ? 'Good job! A bit more practice and you\'ll ace it.' : pct >= 40 ? 'Not bad, but revisit the key concepts.' : 'Keep going! Study mode will help you understand better.'

    return (
      <div style={{ minHeight: '100vh', background: '#0a0f1e', fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div style={{ background: '#0f1729', borderBottom: '1px solid #1e293b', padding: '12px 24px' }}>
          <span style={{ color: '#34d399', fontWeight: 700 }}>📝 Practice Results</span>
        </div>

        <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 16px' }}>
          {/* Score card */}
          <div style={{ background: '#0f1729', border: '1px solid #1e293b', borderRadius: 16, padding: 32, textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: '4rem', marginBottom: 12 }}>{emoji}</div>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, color: pct >= 60 ? '#34d399' : pct >= 40 ? '#fbbf24' : '#f87171', marginBottom: 4 }}>{pct}%</div>
            <div style={{ color: '#94a3b8', marginBottom: 8 }}>{score} out of {questions.length} correct</div>
            <p style={{ color: '#cbd5e1', fontSize: '1rem' }}>{message}</p>
            <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: 8 }}>{effectiveTopic} · {difficulty} difficulty</div>
          </div>

          {/* Review */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ color: '#f1f5f9', marginBottom: 16 }}>📋 Question Review</h3>
            {questions.map((q, i) => {
              const userAnswer = answers[i]
              const isCorrect = userAnswer === q.correct
              return (
                <div key={i} style={{
                  background: '#0f1729', border: `1px solid ${isCorrect ? '#064e3b' : '#450a0a'}`, borderRadius: 12,
                  padding: 16, marginBottom: 12,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Q{i + 1}</span>
                    <span style={{ fontSize: '1rem' }}>{isCorrect ? '✅' : '❌'}</span>
                  </div>
                  <p style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: '0 0 8px', lineHeight: 1.5 }}>{q.question}</p>
                  {!isCorrect && (
                    <div style={{ fontSize: '0.85rem' }}>
                      <span style={{ color: '#f87171' }}>Your answer: {userAnswer} — {q.options[userAnswer]}</span>
                      <br />
                      <span style={{ color: '#34d399' }}>Correct: {q.correct} — {q.options[q.correct]}</span>
                    </div>
                  )}
                  <div style={{ marginTop: 8, padding: '8px 12px', background: '#0a1628', borderRadius: 8, color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6 }}>
                    💡 {q.explanation}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={startQuiz} style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', fontWeight: 600, cursor: 'pointer', background: 'linear-gradient(135deg, #059669, #0284c7)', color: '#fff' }}>
              🔄 Try Again
            </button>
            <button onClick={() => { setPhase('setup'); setSelectedTopic(''); setCustomTopic('') }} style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid #334155', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontWeight: 600 }}>
              📍 New Topic
            </button>
            <button onClick={() => {
            const b = searchParams.get('board') || selectedBoard
            const c = searchParams.get('classYear') || selectedClass
            router.push(`/study?board=${b}&classYear=${c}&subject=${selectedSubject}&chapter=${selectedChapter}&topic=${encodeURIComponent(effectiveTopic)}`)
            }} style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid #3b82f6', background: 'transparent', color: '#60a5fa', cursor: 'pointer', fontWeight: 600 }}>
              📚 Study This Topic
            </button>
          </div>
        </div>
      </div>
    )
  }
}