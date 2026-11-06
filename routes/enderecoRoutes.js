const express = require('express');
const router = express.Router();
const enderecoController = require('../controllers/enderecoController');
const { roleMiddleware, authMiddleware } = require('../middlewares/authMiddleware');

// Todas as rotas requerem autenticação e role 'admin'
router.post('/', authMiddleware, roleMiddleware(['admin']), enderecoController.criarEndereco);
router.get('/', authMiddleware, roleMiddleware(['admin']), enderecoController.listarEnderecos);
router.get('/:id', authMiddleware, roleMiddleware(['admin']), enderecoController.buscarEnderecoPorId);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), enderecoController.atualizarEndereco);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), enderecoController.deletarEndereco);

module.exports = router; 