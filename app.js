const usuarioRoutes = require('./routes/usuarioRoutes.js');
const enderecoRoutes = require('./routes/enderecoRoutes.js');
const alunoRoutes = require('./routes/alunoRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const swaggerDocument = require('./docs/swagger.js');
const swaggerUi = require('swagger-ui-express');
const express = require('express');
require('dotenv').config();

const port = process.env.PORT;

const app = express();
app.use(express.json());

app.get('/api-docs/swagger.json', (req, res) => {
  res.json(swaggerDocument)
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send({ status: 'ok' })
});

app.use('/usuarios', usuarioRoutes);
app.use('/enderecos', enderecoRoutes);
app.use('/alunos', alunoRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Servidor executando em: http://localhost:${port}`)
});