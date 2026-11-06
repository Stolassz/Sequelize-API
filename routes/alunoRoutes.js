const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');
const { roleMiddleware, authMiddleware } = require('../middlewares/authMiddleware');

// Rotas que requerem role 'admin'
router.post('/', authMiddleware, roleMiddleware(['admin']), alunoController.criarAluno);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), alunoController.atualizarAluno);

// Rotas que podem ser acessadas por admin e professor
router.get('/', authMiddleware, roleMiddleware(['admin', 'professor']), alunoController.listarAlunos);
router.get('/:id', authMiddleware, roleMiddleware(['admin', 'professor']), alunoController.buscarAlunoPorId);

module.exports = router; 