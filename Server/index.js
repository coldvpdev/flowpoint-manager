const express = require('express');
const cors = require('cors');
const { inicializarBanco, abrirBanco } = require('./database'); 

const app = express();
app.use(cors());
app.use(express.json());

inicializarBanco();


app.get('/clientes', async (req, res) => {
    const db = await abrirBanco();
    const clientes = await db.all('SELECT * FROM clientes');
    res.json(clientes);
});

app.post('/clientes', async (req, res) => {
    const { nome, telefone, email } = req.body;
    const db = await abrirBanco();
    await db.run(
        'INSERT INTO clientes (nome, telefone, email) VALUES (?, ?, ?)',
        [nome, telefone, email]
    );
    res.status(201).json({ message: "Cliente cadastrado com sucesso!" });
});

app.delete('/clientes/:id', async (req, res) => {
    const { id } = req.params;
    const db = await abrirBanco();
    await db.run('DELETE FROM clientes WHERE id = ?', [id]);
    res.json({ message: "Cliente removido com sucesso!" });
});



app.get('/servicos', async (req, res) => {
    const db = await abrirBanco();
    const servicos = await db.all('SELECT * FROM servicos');
    res.json(servicos);
});

app.post('/servicos', async (req, res) => {
    const { nome, preco, duracao } = req.body;
    const db = await abrirBanco();
    await db.run(
        'INSERT INTO servicos (nome, preco, duracao) VALUES (?, ?, ?)',
        [nome, preco, duracao]
    );
    res.status(201).json({ message: "Serviço cadastrado com sucesso!" });
});

app.delete('/servicos/:id', async (req, res) => {
    const { id } = req.params;
    const db = await abrirBanco();
    await db.run('DELETE FROM servicos WHERE id = ?', [id]);
    res.json({ message: "Serviço removido com sucesso!" });
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor do FlowPoint rodando em http://localhost:${PORT}`);
});