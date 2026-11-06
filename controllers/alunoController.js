const { Aluno, Usuario, Endereco } = require('../models');
const alunoReqDto = require('../dtos/alunoReqDto');
const alunoResDto = require('../dtos/alunoResDto');

exports.criarAluno = async (req, res) => {
    try {
        const dados = alunoReqDto.toEntity(req.body);

        // Verificar se o usuário existe e é um aluno
        const usuario = await Usuario.findByPk(dados.usuarioId);
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado!' });
        }
        if (usuario.role !== 'aluno') {
            return res.status(400).json({ erro: 'O usuário deve ser um aluno!' });
        }

        // Verificar se o endereço existe
        const endereco = await Endereco.findByPk(dados.enderecoId);
        if (!endereco) {
            return res.status(404).json({ erro: 'Endereço não encontrado!' });
        }

        // Verificar se já existe um aluno com este usuário
        const alunoExistente = await Aluno.findOne({ 
            where: { usuarioId: dados.usuarioId }
        });
        if (alunoExistente) {
            return res.status(400).json({ erro: 'Já existe um aluno cadastrado para este usuário!' });
        }

        const aluno = await Aluno.create(dados);
        
        // Buscar o aluno com as relações
        const alunoCompleto = await Aluno.findByPk(aluno.id, {
            include: [
                { model: Usuario, as: 'usuario' },
                { model: Endereco, as: 'endereco' }
            ]
        });

        res.status(201).json(alunoResDto.fromEntity(alunoCompleto));
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};

exports.listarAlunos = async (_req, res) => {
    try {
        const alunos = await Aluno.findAll({
            include: [
                { model: Usuario, as: 'usuario' },
                { model: Endereco, as: 'endereco' }
            ]
        });
        const resultado = alunos.map(alunoResDto.fromEntity);
        res.json(resultado);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};

exports.buscarAlunoPorId = async (req, res) => {
    try {
        const aluno = await Aluno.findByPk(req.params.id, {
            include: [
                { model: Usuario, as: 'usuario' },
                { model: Endereco, as: 'endereco' }
            ]
        });

        if (!aluno) {
            return res.status(404).json({ erro: 'Aluno não encontrado!' });
        }

        res.json(alunoResDto.fromEntity(aluno));
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};

exports.atualizarAluno = async (req, res) => {
    try {
        const dados = alunoReqDto.toUpdateEntity(req.body);
        const aluno = await Aluno.findByPk(req.params.id);

        if (!aluno) {
            return res.status(404).json({ erro: 'Aluno não encontrado!' });
        }

        // Se estiver atualizando o endereço, verificar se existe
        if (dados.enderecoId) {
            const endereco = await Endereco.findByPk(dados.enderecoId);
            if (!endereco) {
                return res.status(404).json({ erro: 'Endereço não encontrado!' });
            }
        }

        await aluno.update(dados);

        // Buscar o aluno atualizado com as relações
        const alunoAtualizado = await Aluno.findByPk(aluno.id, {
            include: [
                { model: Usuario, as: 'usuario' },
                { model: Endereco, as: 'endereco' }
            ]
        });

        res.json(alunoResDto.fromEntity(alunoAtualizado));
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};

exports.deletarAluno = async (req, res) => {
    try {
        const aluno = await Aluno.findByPk(req.params.id);

        if (!aluno) {
            return res.status(404).json({ erro: 'Aluno não encontrado!' });
        }

        await aluno.destroy();
        res.json({ mensagem: 'Aluno deletado com sucesso!' });
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
}; 