import { useState, useEffect } from 'react'
import axios from 'axios'
import Header from './components/Header'
import { Calendar, User, Scissors, Clock, Trash2, Plus, Check, Loader2, Search, AlertTriangle, X } from 'lucide-react'
import { Toaster, toast } from 'sonner' 
import './App.css'

function App() {
  const [clientes, setClientes] = useState([])
  const [servicos, setServicos] = useState([])
  const [agendamentos, setAgendamentos] = useState([])
  const [loading, setLoading] = useState(false) 
  const [searchTerm, setSearchTerm] = useState('')
  
  const [nome, setNome] = useState('')
  const [novoServico, setNovoServico] = useState({ nome: '', preco: '' })
  const [novoAgendamento, setNovoAgendamento] = useState({ cliente_id: '', servico_id: '', data_hora: '' })
  
  const [modalExclusao, setModalExclusao] = useState({ aberto: false, rota: '', id: null })

  const buscarDados = async () => {
    try {
      const [resClientes, resServicos, resAgendamentos] = await Promise.all([
        axios.get('http://localhost:3001/clientes'),
        axios.get('http://localhost:3001/servicos'),
        axios.get('http://localhost:3001/agendamentos')
      ])
      setClientes(resClientes.data)
      setServicos(resServicos.data)
      setAgendamentos(resAgendamentos.data)
    } catch (err) { 
      toast.error("Erro ao carregar dados")
    }
  }

  const formatarMoeda = (valor) => {
    let v = valor.replace(/\D/g, "")
    v = (v / 100).toFixed(2).replace(".", ",")
    v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
    return v
  }

  const handlePrecoChange = (e) => {
    const valorFormatado = formatarMoeda(e.target.value)
    setNovoServico({ ...novoServico, preco: valorFormatado })
  }

  const cadastrarCliente = async (e) => {
    e.preventDefault()
    if (!nome) return toast.warning("Digite o nome")
    setLoading(true)
    try {
      await axios.post('http://localhost:3001/clientes', { nome })
      setNome('')
      await buscarDados()
      toast.success("Cliente salvo")
    } catch { toast.error("Erro ao cadastrar") } finally { setLoading(false) }
  }

  const cadastrarServico = async (e) => {
    e.preventDefault()
    if (!novoServico.nome || !novoServico.preco) return toast.warning("Preencha os campos")
    setLoading(true)
    try {
      const precoNumerico = parseFloat(novoServico.preco.replace(".", "").replace(",", "."))
      await axios.post('http://localhost:3001/servicos', { ...novoServico, preco: precoNumerico })
      setNovoServico({ nome: '', preco: '' })
      await buscarDados()
      toast.success("Serviço salvo")
    } catch { toast.error("Erro ao cadastrar") } finally { setLoading(false) }
  }

  const criarAgendamento = async (e) => {
    e.preventDefault()
    if (!novoAgendamento.cliente_id || !novoAgendamento.servico_id || !novoAgendamento.data_hora) {
      return toast.warning("Selecione todos os campos")
    }
    setLoading(true)
    try {
      await axios.post('http://localhost:3001/agendamentos', novoAgendamento)
      setNovoAgendamento({ cliente_id: '', servico_id: '', data_hora: '' })
      await buscarDados()
      toast.success("Agendado")
    } catch { toast.error("Erro no agendamento") } finally { setLoading(false) }
  }

  const confirmarExclusao = async () => {
    try {
      await axios.delete(`http://localhost:3001/${modalExclusao.rota}/${modalExclusao.id}`)
      buscarDados()
      toast.success("Removido com sucesso")
    } catch { toast.error("Erro ao excluir") } finally { setModalExclusao({ aberto: false, rota: '', id: null }) }
  }

  useEffect(() => { buscarDados() }, [])

  const agendamentosFiltrados = agendamentos.filter(a => 
    a.cliente.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.servico.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="layout-wrapper">
      <Toaster position="top-right" richColors theme="dark" />
      
      {modalExclusao.aberto && (
        <div className="modal-overlay">
          <div className="modal-content animate-in">
            <AlertTriangle size={40} color="#ef4444" />
            <h3>Confirmar Exclusão</h3>
            <p>Você tem certeza que deseja remover este item? Esta ação não pode ser desfeita.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setModalExclusao({ aberto: false })}>Cancelar</button>
              <button className="btn-confirm-del" onClick={confirmarExclusao}>Excluir Agora</button>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-container">
        <main className="main-content">
          <Header />

          <section className="scheduling-hero">
            <div className="section-header">
              <Calendar size={16} />
              <h3>NOVO AGENDAMENTO</h3>
            </div>
            <form onSubmit={criarAgendamento} className="grid-form">
              <select value={novoAgendamento.cliente_id} onChange={(e) => setNovoAgendamento({...novoAgendamento, cliente_id: e.target.value})}>
                <option value="">Selecionar Cliente</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
              <select value={novoAgendamento.servico_id} onChange={(e) => setNovoAgendamento({...novoAgendamento, servico_id: e.target.value})}>
                <option value="">Selecionar Serviço</option>
                {servicos.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
              </select>
              <input type="datetime-local" className="full-width" value={novoAgendamento.data_hora} onChange={(e) => setNovoAgendamento({...novoAgendamento, data_hora: e.target.value})} />
              <button type="submit" className="btn-primary full-width" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                {loading ? "PROCESSANDO" : "CONFIRMAR AGENDAMENTO"}
              </button>
            </form>
          </section>

          <div className="title-row">
            <h2 className="title-section">Agenda do Dia</h2>
            <div className="search-bar">
              <Search size={18} />
              <input type="text" placeholder="Buscar agendamento..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <div className="appointments-list">
            {agendamentosFiltrados.length > 0 ? (
              agendamentosFiltrados.map(a => (
                <div key={a.id} className="appointment-card">
                  <div className="appointment-info">
                    <div className="user-tag">
                      <div className="avatar-mini"><User size={12} /></div>
                      <h4>{a.cliente}</h4>
                    </div>
                    <div className="appointment-details">
                      <span><Scissors size={14} /> {a.servico}</span>
                      <span><Clock size={14} /> {new Date(a.data_hora).toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                  <button onClick={() => setModalExclusao({ aberto: true, rota: 'agendamentos', id: a.id })} className="btn-delete-icon">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <Search size={32} />
                <p>Nenhum resultado para "{searchTerm}"</p>
              </div>
            )}
          </div>
        </main>

        <aside className="sidebar">
          <div className="sidebar-section">
            <div className="section-header">
              <User size={16} />
              <h3>CLIENTES</h3>
            </div>
            <form onSubmit={cadastrarCliente} className="side-form">
              <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
              <button type="submit" className="btn-side-add"><Plus size={16} /></button>
            </form>
            <div className="items-container">
              {clientes.map(c => (
                <div key={c.id} className="item-row">
                  <span>{c.nome}</span>
                  <button onClick={() => setModalExclusao({ aberto: true, rota: 'clientes', id: c.id })} className="btn-del-small"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <div className="section-header">
              <Scissors size={16} />
              <h3>SERVIÇOS</h3>
            </div>
            <form onSubmit={cadastrarServico} className="side-form-stack">
              <input type="text" placeholder="Serviço" value={novoServico.nome} onChange={(e) => setNovoServico({...novoServico, nome: e.target.value})} />
              <div className="side-form">
                <input type="text" placeholder="R$ 0,00" value={novoServico.preco} onChange={handlePrecoChange} />
                <button type="submit" className="btn-side-add"><Plus size={16} /></button>
              </div>
            </form>
            <div className="items-container">
              {servicos.map(s => (
                <div key={s.id} className="item-row">
                  <span>{s.nome}</span>
                  <div className="price-group">
                    <span className="price-tag">R$ {parseFloat(s.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    <button onClick={() => setModalExclusao({ aberto: true, rota: 'servicos', id: s.id })} className="btn-del-small"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default App