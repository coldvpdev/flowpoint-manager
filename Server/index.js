const express = require('express');
const cors = require('cors');
const { inicializarBanco, abrirBanco } = require('./database'); 

const app = express();
app.use(cors());
app.use(express.json());

inicializarBanco();

app.get('/clientes', async (req, res) => {
    const db = await abrirBanco();
    res.json(await db.all('SELECT * FROM clientes'));
});

app.post('/clientes', async (req, res) => {
    const { nome, telefone, email } = req.body;
    const db = await abrirBanco();
    await db.run('INSERT INTO clientes (nome, telefone, email) VALUES (?, ?, ?)', [nome, telefone, email]);
    res.status(201).json({ message: "Sucesso" });
});

app.delete('/clientes/:id', async (req, res) => {
    const db = await abrirBanco();
    await db.run('DELETE FROM clientes WHERE id = ?', [req.params.id]);
    res.json({ message: "Removido" });
});

app.get('/servicos', async (req, res) => {
    const db = await abrirBanco();
    res.json(await db.all('SELECT * FROM servicos'));
});

app.post('/servicos', async (req, res) => {
    const { nome, preco, duracao } = req.body;
    const db = await abrirBanco();
    await db.run('INSERT INTO servicos (nome, preco, duracao) VALUES (?, ?, ?)', [nome, preco, duracao]);
    res.status(201).json({ message: "Sucesso" });
});

app.delete('/servicos/:id', async (req, res) => {
    const db = await abrirBanco();
    await db.run('DELETE FROM servicos WHERE id = ?', [req.params.id]);
    res.json({ message: "Removido" });
});

app.get('/agendamentos', async (req, res) => {
    const db = await abrirBanco();
    const sql = `
        SELECT a.id, c.nome as cliente, s.nome as servico, a.data_hora 
        FROM agendamentos a
        JOIN clientes c ON a.cliente_id = c.id
        JOIN servicos s ON a.servico_id = s.id
        ORDER BY a.data_hora ASC
    `;
    res.json(await db.all(sql));
});

app.post('/agendamentos', async (req, res) => {
    const { cliente_id, servico_id, data_hora } = req.body;
    const db = await abrirBanco();

    const conflito = await db.get('SELECT id FROM agendamentos WHERE data_hora = ?', [data_hora]);
    if (conflito) return res.status(400).json({ message: "Horário já ocupado." });

    await db.run(
        'INSERT INTO agendamentos (cliente_id, servico_id, data_hora) VALUES (?, ?, ?)',
        [cliente_id, servico_id, data_hora]
    );
    res.status(201).json({ message: "Agendado" });
});

app.delete('/agendamentos/:id', async (req, res) => {
    const db = await abrirBanco();
    await db.run('DELETE FROM agendamentos WHERE id = ?', [req.params.id]);
    res.json({ message: "Cancelado" });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`FlowPoint rodando na porta ${PORT}`));