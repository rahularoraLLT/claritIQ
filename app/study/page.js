const renderExplanation = (text) => {
  if (!text) return null
  const lines = text.split('\n')
  return lines.map((line, li) => {
    if (line.startsWith('### ')) return <h3 key={li} style={{ color: '#38bdf8', fontSize: '1rem', fontWeight: 700, margin: '1rem 0 0.3rem' }}>{line.slice(4)}</h3>
    if (line.startsWith('## ')) return <h2 key={li} style={{ color: '#f1f5f9', fontSize: '1.15rem', fontWeight: 800, margin: '1.2rem 0 0.3rem' }}>{line.slice(3)}</h2>
    if (line.startsWith('# ')) return <h1 key={li} style={{ color: '#38bdf8', fontSize: '1.3rem', fontWeight: 800, margin: '1rem 0 0.5rem' }}>{line.slice(2)}</h1>
    if (line.startsWith('---')) return <hr key={li} style={{ border: 'none', borderTop: '1px solid #334155', margin: '1rem 0' }} />
    if (line.startsWith('> ')) return <blockquote key={li} style={{ borderLeft: '3px solid #38bdf8', paddingLeft: '1rem', color: '#94a3b8', margin: '0.5rem 0', fontStyle: 'italic' }}>{line.slice(2)}</blockquote>

    const parts = line.split(/(\*\*.*?\*\*|\*.*?\*|\$\$[\s\S]*?\$\$|\$[^$]*?\$)/g)
    const rendered = parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} style={{ color: '#f1f5f9' }}>{part.slice(2,-2)}</strong>
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={i}>{part.slice(1,-1)}</em>
      if (part.startsWith('$$') && part.endsWith('$$')) {
        try { const katex = require('katex'); return <span key={i} dangerouslySetInnerHTML={{ __html: katex.renderToString(part.slice(2,-2), { displayMode: true, throwOnError: false }) }} /> }
        catch { return <span key={i}>{part}</span> }
      }
      if (part.startsWith('$') && part.endsWith('$')) {
        try { const katex = require('katex'); return <span key={i} dangerouslySetInnerHTML={{ __html: katex.renderToString(part.slice(1,-1), { displayMode: false, throwOnError: false }) }} /> }
        catch { return <span key={i}>{part}</span> }
      }
      return <span key={i}>{part}</span>
    })
    return <p key={li} style={{ margin: '0.3rem 0', lineHeight: '1.8' }}>{rendered}</p>
  })
}