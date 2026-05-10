'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { SYLLABUS, getSubjects, getChapters, getTopics, getClassYears, getBoards } from '@/lib/syllabus'

// ─── Markdown + LaTeX renderer ───────────────────────────────────────────────

function renderContent(text) {
  if (!text) return []
  const lines = text.split('\n')
  const elements = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Mermaid block
    if (line.trim().startsWith('```mermaid')) {
      const mermaidLines = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        mermaidLines.push(lines[i])
        i++
      }
      elements.push(
        <MermaidDiagram key={`mermaid-${i}`} code={mermaidLines.join('\n')} />
      )
      i++
      continue
    }

    // Code block (non-mermaid)
    if (line.trim().startsWith('```')) {
      const codeLines = []
      const lang = line.trim().replace('```', '').trim()
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      elements.push(
        <pre key={`code-${i}`} style={{
          background: '#0f172a', border: '1px solid #334155',
          borderRadius: 8, padding: '1rem', overflowX: 'auto',
          fontSize: '0.875rem', color: '#e2e8f0', margin: '1rem 0'
        }}>
          <code>{codeLines.join('\n')}</code>
        </pre>
      )
      i++
      continue
    }

    // Markdown table
    if (line.trim().startsWith('|') && i + 1 < lines.length && lines[i + 1].trim().startsWith('|--')) {
      const headers = line.split('|').map(h => h.trim()).filter(Boolean)
      i += 2
      const rows = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(lines[i].split('|').map(c => c.trim()).filter(Boolean))
        i++
      }
      elements.push(
        <div key={`table-${i}`} style={{ overflowX: 'auto', margin: '1rem 0' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.9rem' }}>
            <thead>
              <tr>
                {headers.map((h, hi) => (
                  <th key={hi} style={{
                    border: '1px solid #334155', padding: '8px 12px',
                    background: '#1e293b', color: '#60a5fa', textAlign: 'left'
                  }}>
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 === 0 ? '#0f172a' : '#1a2540' }}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{
                      border: '1px solid #334155', padding: '8px 12px', color: '#e2e8f0'
                    }}>
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    }

    // Horizontal rule
    if (line.trim() === '---' || line.trim() === '***') {
      elements.push(<hr key={`hr-${i}`} style={{ border: 'none', borderTop: '1px solid #334155', margin: '1.5rem 0' }} />)
      i++
      continue
    }

    // H2
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} style={{ color: '#60a5fa', fontSize: '1.2rem', fontWeight: 700, margin: '1.5rem 0 0.5rem' }}>
          {renderInline(line.replace(/^## /, ''))}
        </h2>
      )
      i++
      continue
    }

    // H3
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} style={{ color: '#a78bfa', fontSize: '1rem', fontWeight: 600, margin: '1.2rem 0 0.4rem' }}>
          {renderInline(line.replace(/^### /, ''))}
        </h3>
      )
      i++
      continue
    }

    // H1
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${i}`} style={{ color: '#f1f5f9', fontSize: '1.4rem', fontWeight: 700, margin: '1.5rem 0 0.5rem' }}>
          {renderInline(line.replace(/^# /, ''))}
        </h1>
      )
      i++
      continue
    }

    // Blockquote
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={`bq-${i}`} style={{
          borderLeft: '3px solid #3b82f6', paddingLeft: '1rem',
          margin: '1rem 0', color: '#94a3b8', fontStyle: 'italic'
        }}>
          {renderInline(line.replace(/^> /, ''))}
        </blockquote>
      )
      i++
      continue
    }

    // Bullet points
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const listItems = []
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        listItems.push(lines[i].replace(/^[-*] /, ''))
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', color: '#e2e8f0' }}>
          {listItems.map((item, li) => (
            <li key={li} style={{ margin: '0.3rem 0' }}>{renderInline(item)}</li>
          ))}
        </ul>
      )
      continue
    }

    // Numbered list
    if (/^\d+\. /.test(line)) {
      const listItems = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\. /, ''))
        i++
      }
      elements.push(
        <ol key={`ol-${i}`} style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', color: '#e2e8f0' }}>
          {listItems.map((item, li) => (
            <li key={li} style={{ margin: '0.3rem 0' }}>{renderInline(item)}</li>
          ))}
        </ol>
      )
      continue
    }

    // Display math $$...$$
    if (line.trim().startsWith('$$') && line.trim().endsWith('$$') && line.trim().length > 4) {
      const math = line.trim().slice(2, -2)
      elements.push(
        <div key={`math-${i}`} style={{ textAlign: 'center', margin: '1rem 0', overflowX: 'auto' }}>
          <LatexBlock math={math} display={true} />
        </div>
      )
      i++
      continue
    }

    // Multi-line display math
    if (line.trim() === '$$') {
      const mathLines = []
      i++
      while (i < lines.length && lines[i].trim() !== '$$') {
        mathLines.push(lines[i])
        i++
      }
      elements.push(
        <div key={`math-${i}`} style={{ textAlign: 'center', margin: '1rem 0', overflowX: 'auto' }}>
          <LatexBlock math={mathLines.join('\n')} display={true} />
        </div>
      )
      i++
      continue
    }

    // Empty line
    if (line.trim() === '') {
      elements.push(<div key={`space-${i}`} style={{ height: '0.5rem' }} />)
      i++
      continue
    }

    // Paragraph
    elements.push(
      <p key={`p-${i}`} style={{ color: '#e2e8f0', lineHeight: 1.8, margin: '0.4rem 0' }}>
        {renderInline(line)}
      </p>
    )
    i++
  }

  return elements
}

function renderInline(text) {
  if (!text) return ''
  // Split by LaTeX $...$ patterns and bold **...**
  const parts = []
  const regex = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\*\*[^*]+?\*\*|`[^`]+`)/g
  let last = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index))
    }

    const token = match[0]
    if (token.startsWith('$$')) {
      parts.push(<LatexBlock key={match.index} math={token.slice(2, -2)} display={true} />)
    } else if (token.startsWith('$')) {
      parts.push(<LatexBlock key={match.index} math={token.slice(1, -1)} display={false} />)
    } else if (token.startsWith('**')) {
      parts.push(<strong key={match.index} style={{ color: '#f1f5f9' }}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('`')) {
      parts.push(
        <code key={match.index} style={{
          background: '#1e293b', color: '#34d399', padding: '1px 6px',
          borderRadius: 4, fontSize: '0.875em'
        }}>
          {token.slice(1, -1)}
        </code>
      )
    }
    last = match.index + token.length
  }

  if (last < text.length) parts.push(text.slice(last))
  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts
}

// ─── LaTeX Component ──────────────────────────────────────────────────────────

function LatexBlock({ math, display }) {
  const ref = useRef(null)
  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.MathJax && ref.current) {
      ref.current.innerHTML = display ? `\\[${math}\\]` : `\\(${math}\\)`
      window.MathJax.typesetPromise([ref.current]).then(() => setRendered(true))
    }
  }, [math, display])

  return (
    <span
      ref={ref}
      style={{ color: '#fbbf24', fontFamily: display ? undefined : 'inherit' }}
    >
      {display ? `$$${math}$$` : `$${math}$`}
    </span>
  )
}

// ─── Mermaid Component ────────────────────────────────────────────────────────

function MermaidDiagram({ code }) {
  const ref = useRef(null)
  const [svg, setSvg] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function render() {
      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' })
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
        const { svg: result } = await mermaid.render(id, code)
        if (!cancelled) setSvg(result)
      } catch (e) {
        if (!cancelled) setError('Diagram could not be rendered')
      }
    }
    render()
    return () => { cancelled = true }
  }, [code])

  if (error) return (
    <div style={{ padding: '0.5rem 1rem', background: '#1e293b', borderRadius: 8, color: '#94a3b8', fontSize: '0.85rem', margin: '0.5rem 0' }}>
      {error}
    </div>
  )

  if (!svg) return (
    <div style={{ padding: '1rem', textAlign: 'center', color: '#475569', fontSize: '0.85rem' }}>
      Loading diagram...
    </div>
  )

  return (
    <div
      ref={ref}
      style={{ background: '#0f172a', borderRadius: 12, padding: '1rem', margin: '1rem 0', overflowX: 'auto', textAlign: 'center' }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

// ─── Main Study Page ──────────────────────────────────────────────────────────

export default function StudyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Selection state
  const [selectedBoard, setSelectedBoard] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedChapter, setSelectedChapter] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('')
  const [customTopic, setCustomTopic] = useState('')
  const [useCustomTopic, setUseCustomTopic] = useState(false)

  // Output state
  const [explanation, setExplanation] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [simulation, setSimulation] = useState(null)
  const [simLoading, setSimLoading] = useState(false)
  const [showSim, setShowSim] = useState(false)
  const abortRef = useRef(null)
  const explanationEndRef = useRef(null)

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
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
        // Pre-fill from profile
        if (!searchParams.get('board')) setSelectedBoard(profileData.board || '')
        if (!searchParams.get('classYear')) setSelectedClass(profileData.class_year || '')
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  // Load MathJax
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.MathJax) return
    window.MathJax = {
      tex: { inlineMath: [['$', '$'], ['\\(', '\\)']], displayMath: [['$$', '$$'], ['\\[', '\\]']] },
      startup: { typeset: false }
    }
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js'
    script.async = true
    document.head.appendChild(script)
  }, [])

 
  // Auto-explain when arriving from URL params (e.g. from Practice page)
  useEffect(() => {
    if (selectedTopic && searchParams.get('topic')) {
      const timer = setTimeout(() => {
        handleExplain()
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [selectedTopic])
  
  // Auto-scroll during streaming
  useEffect(() => {
  if (!isStreaming) return
  const el = explanationEndRef.current
  if (!el) return
  const rect = el.getBoundingClientRect()
  const isNearBottom = rect.top < window.innerHeight + 200
  if (isNearBottom) el.scrollIntoView({ behavior: 'smooth' })
}, [explanation, isStreaming])

  const boards = getBoards()
  const classYears = selectedBoard ? getClassYears(selectedBoard) : []
  const subjects = (selectedBoard && selectedClass) ? getSubjects(selectedBoard, selectedClass) : []
  const chapters = (selectedBoard && selectedClass && selectedSubject)
    ? getChapters(selectedBoard, selectedClass, selectedSubject) : []
  const topics = (selectedBoard && selectedClass && selectedSubject && selectedChapter)
    ? getTopics(selectedBoard, selectedClass, selectedSubject, selectedChapter) : []

  const effectiveTopic = useCustomTopic ? customTopic.trim() : selectedTopic

  function getNextTopic() {
  if (!selectedBoard || !selectedClass || !selectedSubject || !selectedChapter || !selectedTopic) return null
  const topicList = getTopics(selectedBoard, selectedClass, selectedSubject, selectedChapter)
  const currentIndex = topicList.indexOf(selectedTopic)
  if (currentIndex === -1 || currentIndex === topicList.length - 1) return null
  return topicList[currentIndex + 1]
}
  async function handleSimulation() {
  setSimLoading(true)
  setShowSim(true)
  try {
    const res = await fetch('/api/simulation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        board: selectedBoard, classYear: selectedClass,
        subject: selectedSubject, chapter: selectedChapter,
        topic: effectiveTopic
      })
    })
    const data = await res.json()
    setSimulation(data)
  } catch (err) {
    console.error('Simulation error:', err)
  } finally {
    setSimLoading(false)
  }
}
  async function handleExplain() {
    if (!effectiveTopic) return
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setExplanation('')
    setIsStreaming(true)

    try {
      const res = await fetch('/api/stream-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          board: selectedBoard, classYear: selectedClass,
          subject: selectedSubject, chapter: selectedChapter,
          topic: effectiveTopic
        }),
        signal: controller.signal,
      })

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setExplanation(prev => prev + decoder.decode(value, { stream: true }))
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setExplanation('❌ Something went wrong. Please try again.')
      }
    } finally {
      setIsStreaming(false)
    }
  }

  function handleStop() {
    abortRef.current?.abort()
    setIsStreaming(false)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#60a5fa' }}>Loading...</p>
    </div>
  )

  const selectStyle = {
    width: '100%', padding: '10px 14px', background: '#1e293b',
    border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0',
    fontSize: '0.95rem', outline: 'none', cursor: 'pointer'
  }

  const labelStyle = {
    display: 'block', color: '#94a3b8', fontSize: '0.8rem',
    fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: '#0f1729', borderBottom: '1px solid #1e293b', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}>←</button>
          <span style={{ color: '#60a5fa', fontWeight: 700, fontSize: '1.1rem' }}>📚 Study Mode</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => router.push('/doubt')} style={{ padding: '6px 14px', background: '#1e293b', border: '1px solid #334155', borderRadius: 20, color: '#a78bfa', cursor: 'pointer', fontSize: '0.85rem' }}>🙋 Ask a Doubt</button>
          <button onClick={() => router.push('/practice')} style={{ padding: '6px 14px', background: '#1e293b', border: '1px solid #334155', borderRadius: 20, color: '#34d399', cursor: 'pointer', fontSize: '0.85rem' }}>📝 Practice</button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
        {/* Topic Selector Card */}
        <div style={{ background: '#0f1729', border: '1px solid #1e293b', borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <h2 style={{ color: '#f1f5f9', fontSize: '1rem', fontWeight: 600, marginBottom: 20 }}>
            📍 Choose Your Topic
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 16 }}>
            {/* Board */}
            <div>
              <label style={labelStyle}>Board / Exam</label>
              <select style={selectStyle} value={selectedBoard} onChange={e => { setSelectedBoard(e.target.value); setSelectedClass(''); setSelectedSubject(''); setSelectedChapter(''); setSelectedTopic('') }}>
                <option value="">Select Board</option>
                {boards.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            {/* Class */}
            {classYears.length > 0 && (
              <div>
                <label style={labelStyle}>Class / Level</label>
                <select style={selectStyle} value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setSelectedSubject(''); setSelectedChapter(''); setSelectedTopic('') }}>
                  <option value="">Select Class</option>
                  {classYears.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}

            {/* Subject */}
            {subjects.length > 0 && (
              <div>
                <label style={labelStyle}>Subject</label>
                <select style={selectStyle} value={selectedSubject} onChange={e => { setSelectedSubject(e.target.value); setSelectedChapter(''); setSelectedTopic('') }}>
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}

            {/* Chapter */}
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

          {/* Topic picker */}
          {topics.length > 0 && !useCustomTopic && (
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Topic</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {topics.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedTopic(t)}
                    style={{
                      padding: '6px 14px', borderRadius: 20, fontSize: '0.875rem', cursor: 'pointer',
                      border: '1px solid',
                      borderColor: selectedTopic === t ? '#3b82f6' : '#334155',
                      background: selectedTopic === t ? '#1d4ed8' : '#1e293b',
                      color: selectedTopic === t ? '#fff' : '#94a3b8',
                      transition: 'all 0.15s',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom topic toggle */}
          <div style={{ marginBottom: 16 }}>
            <button
              onClick={() => { setUseCustomTopic(!useCustomTopic); setSelectedTopic('') }}
              style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {useCustomTopic ? '← Back to topic menu' : '✏️ Type my own topic'}
            </button>
          </div>

          {useCustomTopic && (
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Your Topic</label>
              <input
                type="text"
                value={customTopic}
                onChange={e => setCustomTopic(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleExplain()}
                placeholder="e.g. Why does a ball thrown upward slow down?"
                style={{
                  ...selectStyle, width: '100%', boxSizing: 'border-box',
                  padding: '10px 14px', cursor: 'text'
                }}
              />
            </div>
          )}

          {/* Explain button */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={handleExplain}
              disabled={!effectiveTopic || isStreaming}
              style={{
                padding: '12px 28px', borderRadius: 10, fontWeight: 600, fontSize: '0.95rem',
                cursor: effectiveTopic && !isStreaming ? 'pointer' : 'not-allowed',
                border: 'none',
                background: effectiveTopic && !isStreaming ? 'linear-gradient(135deg, #2563eb, #7c3aed)' : '#1e293b',
                color: effectiveTopic && !isStreaming ? '#fff' : '#475569',
                transition: 'all 0.2s',
              }}
            >
              {isStreaming ? '⏳ Explaining...' : '✨ Explain This Topic'}
            </button>

            {isStreaming && (
              <button
                onClick={handleStop}
                style={{ padding: '12px 20px', borderRadius: 10, border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontWeight: 600 }}
              >
                ⏹ Stop
              </button>
            )}
          </div>

          {/* Selected breadcrumb */}
          {effectiveTopic && (
            <div style={{ marginTop: 12, padding: '8px 12px', background: '#0a0f1e', borderRadius: 8, fontSize: '0.8rem', color: '#475569' }}>
              📍 {[selectedBoard, selectedClass, selectedSubject, selectedChapter, effectiveTopic].filter(Boolean).join(' › ')}
            </div>
          )}
        </div>

        {/* Explanation Output */}
        {explanation && (
          <div style={{ background: '#0f1729', border: '1px solid #1e293b', borderRadius: 16, padding: 24 }}>
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ color: '#60a5fa', fontWeight: 700 }}>📖 {effectiveTopic}</h3>
              {isStreaming && (
                <span style={{ fontSize: '0.8rem', color: '#60a5fa', animation: 'pulse 1.5s infinite' }}>● Streaming...</span>
              )}
            </div>

            <div style={{ fontSize: '1rem' }}>
              {renderContent(explanation)}
            </div>

            <div ref={explanationEndRef} />

            {!isStreaming && (
              <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #1e293b', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={() => { setSelectedTopic(''); setCustomTopic(''); setExplanation('') }}
                  style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #334155', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}
                >
                  📍 New Topic
                </button>
                
                <button
                  onClick={handleSimulation}
                  style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #fbbf24', background: 'transparent', color: '#fbbf24', cursor: 'pointer' }}
                >
                  🎮 Visualise
                </button>

                <button
                  onClick={() => router.push('/doubt')}
                  style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #a78bfa', background: 'transparent', color: '#a78bfa', cursor: 'pointer' }}
                >
                  🙋 Ask a Doubt
                </button>
                <button
                  onClick={() => router.push(`/practice?board=${selectedBoard}&classYear=${selectedClass}&subject=${selectedSubject}&chapter=${selectedChapter}&topic=${encodeURIComponent(effectiveTopic)}`)}
                  style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #34d399', background: 'transparent', color: '#34d399', cursor: 'pointer' }}
                >
                  📝 Practice This Topic
                </button>
                {getNextTopic() && (
                <button
                  onClick={() => {
                    const next = getNextTopic()
                    setSelectedTopic(next)
                    setExplanation('')
                    setTimeout(() => handleExplain(), 100)
                  }}
                  style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #fbbf24', background: 'transparent', color: '#fbbf24', cursor: 'pointer' }}
                  >
                  ➡️ Next: {getNextTopic()}
                </button>
)}
              </div>
            )}
          </div>
        )}


{/* Simulation Panel */}
        {showSim && (
          <div style={{ background: '#0f1729', border: '1px solid #1e293b', borderRadius: 16, padding: 24, marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ color: '#fbbf24', fontWeight: 700 }}>🎮 Visual & Simulation: {effectiveTopic}</h3>
              <button onClick={() => { setShowSim(false); setSimulation(null) }} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            {simLoading && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#fbbf24' }}>
                <div style={{ fontSize: '2rem', marginBottom: 12, animation: 'spin 2s linear infinite', display: 'inline-block' }}>⚙️</div>
                <p>Generating simulation and diagram...</p>
                <p style={{ color: '#475569', fontSize: '0.85rem', marginTop: 4 }}>This takes ~10 seconds the first time, then it's cached</p>
              </div>
            )}
            {simulation?.svg_diagram && !simLoading && (
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>📊 Diagram</h4>
                <div style={{ background: '#0a0f1e', borderRadius: 12, padding: 16, overflowX: 'auto' }}
                  dangerouslySetInnerHTML={{ __html: simulation.svg_diagram }}
                />
              </div>
            )}
            {simulation?.simulation_html && !simLoading && (
              <div>
                <h4 style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>🎮 Interactive Simulation</h4>
                <iframe
                  srcDoc={simulation.simulation_html}
                  style={{ width: '100%', height: 450, border: 'none', borderRadius: 12, background: '#0a0f1e' }}
                  sandbox="allow-scripts"
                  title={`Simulation: ${effectiveTopic}`}
                />
              </div>
            )}
          </div>
        )}


        {/* Empty state */}
        {!explanation && !isStreaming && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#334155' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📚</div>
            <p style={{ fontSize: '1.1rem', color: '#475569' }}>Select a topic from the menu above to get started</p>
            <p style={{ fontSize: '0.85rem', color: '#334155', marginTop: 8 }}>ClaritIQ will explain it in a way that actually makes sense</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }
        @keyframes spin { to { transform: rotate(360deg) } }
        select option { background: #1e293b; color: #e2e8f0; }
      `}</style>
    </div>
  )
}