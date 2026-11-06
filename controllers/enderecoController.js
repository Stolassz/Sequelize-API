const { Endereco } = require('../models');
const enderecoReqDto = require('../dtos/enderecoReqDto');
const enderecoResDto = require('../dtos/enderecoResDto');

exports.criarEndereco = async (req, res) => {
    try {
        const dados = enderecoReqDto.toEntity(req.body);
        const endereco = await Endereco.create(dados);
        res.status(201).json(enderecoResDto.fromEntity(endereco));
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};

exports.listarEnderecos = async (_req, res) => {
    try {
        const enderecos = await Endereco.findAll();
        const resultado = enderecos.map(enderecoResDto.fromEntity);
        res.json(resultado);
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};

exports.buscarEnderecoPorId = async (req, res) => {
    try {
        const endereco = await Endereco.findByPk(req.params.id);

        if (!endereco) {
            return res.status(404).json({ erro: 'Endereço não encontrado!' });
        }

        res.json(enderecoResDto.fromEntity(endereco));
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};

exports.atualizarEndereco = async (req, res) => {
    try {
        const dados = enderecoReqDto.toUpdateEntity(req.body);
        const endereco = await Endereco.findByPk(req.params.id);

        if (!endereco) {
            return res.status(404).json({ erro: 'Endereço não encontrado!' });
        }

        await endereco.update(dados);
        res.json(enderecoResDto.fromEntity(endereco));
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
};

exports.deletarEndereco = async (req, res) => {
    try {
        const endereco = await Endereco.findByPk(req.params.id);

        if (!endereco) {
            return res.status(404).json({ erro: 'Endereço não encontrado!' });
        }

        // Verificar se o endereço está sendo usado por algum aluno
        const alunosComEndereco = await endereco.getAlunos();
        if (alunosComEndereco.length > 0) {
            return res.status(400).json({ 
                erro: 'Não é possível deletar este endereço pois está sendo usado por alunos!' 
            });
        }

        await endereco.destroy();
        res.json({ mensagem: 'Endereço deletado com sucesso!' });
    } catch (err) {
        res.status(400).json({ erro: err.message });
    }
}; 