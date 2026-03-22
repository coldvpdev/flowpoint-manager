function ClienteItem({ cliente, onDelete }) {
  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px', 
      backgroundColor: 'var(--card-bg)', 
      borderRadius: '12px',
      marginBottom: '12px',
      border: '1px solid #334155',
      transition: 'transform 0.2s, border-color 0.2s'
    }}>
      <div>
        <h4 style={{ fontSize: '1rem', fontWeight: '500' }}>{cliente.nome}</h4>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: #{cliente.id}</span>
      </div>
      
      <button 
        onClick={() => onDelete(cliente.id)}
        style={{ 
          backgroundColor: 'transparent', 
          color: 'var(--danger)', 
          border: '1px solid var(--danger)', 
          borderRadius: '6px', 
          cursor: 'pointer', 
          padding: '6px 12px',
          fontSize: '0.75rem',
          fontWeight: '600',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'var(--danger)';
          e.target.style.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.color = 'var(--danger)';
        }}
      >
        REMOVER
      </button>
    </div>
  )
}

export default ClienteItem;