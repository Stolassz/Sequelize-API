const usuarioRoutes = require('./routes/usuarioRoutes.js');
const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send({ status: 'ok' })
});

app.use('/usuarios', usuarioRoutes);

app.listen(port, () => {
  console.log(`Servidor executando em: http://localhost:${port}`)
});