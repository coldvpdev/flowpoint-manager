function Header() {
  return (
    <header style={{ 
      padding: '16px 0', 
      borderBottom: '1px solid var(--border-muted)', 
      marginBottom: '24px' 
    }}>
      <h1 style={{ 
        fontSize: '1.25rem', 
        fontWeight: '700', 
        letterSpacing: '-0.03em' 
      }}>
        FlowPoint.
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>
        Sistema de Gestão de Agendamentos
      </p>
    </header>
  )
}

export default Header