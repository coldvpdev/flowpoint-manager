import { useState, useEffect } from 'react'
import axios from 'axios'
import Header from '../src/components/header' 

function App() {
  const [clientes, setClientes] = useState([])
  const [nome, setNome] = useState('')

  const buscarClientes = async () => {
    try {
      const res = await axios.get('http://localhost:3001/clientes')
      setClientes(res.data)
    } catch (err) {
      console.error("Erro na busca:", err)
    }
  }

  const cadastrarCliente = async (e) => {
    e.preventDefault()
    if (!nome) return
    try {
      await axios.post('http://localhost:3001/clientes', { nome })
      setNome('')
      buscarClientes()
    } catch (err) {
      console.error("Erro ao cadastrar:", err)
    }
  }

  useEffect(() => { buscarClientes() }, [])

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 16px' }}>
      <Header />
      
      {/* Container de Ação */}
      <section style={{ 
        backgroundColor: 'var(--bg-card)', 
        padding: '24px', 
        borderRadius: '12px', 
        border: '1px dashed var(--border-muted)',
        marginBottom: '32px' 
      }}>
        <form onSubmit={cadastrarCliente} style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            placeholder="Nome completo do cliente" 
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={{ 
              flex: 1,
              padding: '10px 14px', 
              borderRadius: '8px', 
              border: '1px solid var(--border-muted)', 
              backgroundColor: '#000000', /* Fundo do input mais escuro que o card */
              color: 'var(--text-primary)',
              fontSize: '0.875rem'
            }}
          />
          <button type="submit" style={{ 
            padding: '10px 18px', 
            backgroundColor: 'var(--accent)', 
            color: '#000000',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'opacity 0.1s'
          }}>
            Adicionar
          </button>
        </form>
      </section>

      {/* Título da Lista e Contador */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '600', letterSpacing: '-0.015em' }}>Lista de Clientes Ativos</h2>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
          {clientes.length} registro(s) encontrado(s)
        </span>
      </div>

      {/* Lista de Clientes */}
      <div style={{ paddingBottom: '32px' }}>
        {clientes.length > 0 ? (
          <div style={{ display: 'grid', gap: '8px' }}>
            {clientes.map(cliente => (
              <div key={cliente.id} style={{
                backgroundColor: 'var(--bg-card)',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid var(--border-muted)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: '500' }}>{cliente.nome}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: #{cliente.id}</span>
                </div>
                {/* Botão de excluir pode vir aqui futuramente */}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '0.875rem' }}>Base de dados vazia.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App