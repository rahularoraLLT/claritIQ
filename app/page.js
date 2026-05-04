export default function Home() {
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
      <div style={{ marginTop: '2.5rem' }}>
        <button style={{
          background: '#38bdf8',
          color: '#0f172a',
          border: 'none',
          padding: '0.9rem 2.2rem',
          borderRadius: '50px',
          fontSize: '1rem',
          fontWeight: '700',
          cursor: 'pointer',
          marginRight: '1rem'
        }}>
          Get Early Access
        </button>
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
        🚀 Launching soon · Built for India's 250M+ students
      </p>
    </main>
  )
}