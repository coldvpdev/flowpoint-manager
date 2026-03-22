const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function abrirBanco() {
  return open({
    filename: './database.db',
    driver: sqlite3.Database
  });
}

async function inicializarBanco() {
  const db = await abrirBanco();
  
  await db.get('PRAGMA foreign_keys = ON');

  await db.exec(`
    -- Tabela de Clientes
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      telefone TEXT,
      email TEXT
    );

    -- Tabela de Serviços (ex: Corte, Barba, Consultoria)
    CREATE TABLE IF NOT EXISTS servicos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      preco DECIMAL(10, 2) NOT NULL,
      duracao INTEGER -- duração estimada em minutos
    );

    -- Tabela de Agendamentos (Onde a mágica acontece)
    CREATE TABLE IF NOT EXISTS agendamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER NOT NULL,
      servico_id INTEGER NOT NULL,
      data_hora DATETIME NOT NULL,
      status TEXT DEFAULT 'pendente',
      FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
      FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE CASCADE
    );
  `);
  
  console.log("Banco de dados do FlowPoint (Relacional) inicializado! 🗄️");
}

module.exports = { abrirBanco, inicializarBanco };