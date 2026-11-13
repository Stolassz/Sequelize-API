jest.mock('../../models', () => ({
  Usuario: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn()
  },
  Endereco: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn()
  },
  Aluno: {
    create: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn()
  }
}));

jest.mock('../../utils/emailService', () => ({
  sendVerificationEmail: jest.fn()
}));

jest.mock('../../utils/tokenService', () => ({
  generateToken: jest.fn(() => 'token-gerado'),
  verifyToken: jest.fn()
}));

jest.mock('../../dtos/authReqDto', () => ({
  loginToEntity: jest.fn((body) => ({ email: body.email, senha: body.senha }))
}));

jest.mock('../../dtos/usuarioReqDto', () => ({
  toEntity: jest.fn((body) => ({
    email: body.email,
    senha: body.senha,
    role: body.role || 'aluno',
    emailVerificado: body.emailVerificado || false
  }))
}));

jest.mock('../../dtos/usuarioResDto', () => ({
  fromEntity: jest.fn((usuario) => ({
    id: usuario.id,
    email: usuario.email,
    role: usuario.role,
    emailVerificado: usuario.emailVerificado
  }))
}));

jest.mock('../../dtos/alunoReqDto', () => ({
  toEntity: jest.fn((body) => ({
    nome: body.nome,
    dataNascimento: body.dataNascimento,
    usuarioId: body.usuarioId,
    enderecoId: body.enderecoId
  })),
  toUpdateEntity: jest.fn((body) => ({
    nome: body.nome,
    dataNascimento: body.dataNascimento,
    enderecoId: body.enderecoId
  }))
}));

jest.mock('../../dtos/alunoResDto', () => ({
  fromEntity: jest.fn((aluno) => ({
    id: aluno.id,
    nome: aluno.nome,
    usuario: aluno.usuario || null,
    endereco: aluno.endereco || null
  }))
}));

jest.mock('../../dtos/enderecoReqDto', () => ({
  toEntity: jest.fn((body) => ({
    rua: body.rua,
    numero: body.numero,
    cidade: body.cidade,
    estado: body.estado,
    cep: body.cep,
    complemento: body.complemento
  })),
  toUpdateEntity: jest.fn((body) => ({
    rua: body.rua,
    numero: body.numero
  }))
}));

jest.mock('../../dtos/enderecoResDto', () => ({
  fromEntity: jest.fn((endereco) => ({
    id: endereco.id,
    rua: endereco.rua,
    numero: endereco.numero,
    cidade: endereco.cidade,
    estado: endereco.estado,
    cep: endereco.cep,
    complemento: endereco.complemento
  }))
}));

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const authController = require('../../controllers/authController');
const usuarioController = require('../../controllers/usuarioController');
const alunoController = require('../../controllers/alunoController');
const enderecoController = require('../../controllers/enderecoController');
const { Usuario, Aluno, Endereco } = require('../../models');
const { sendVerificationEmail } = require('../../utils/emailService');
const { generateToken } = require('../../utils/tokenService');

describe('Controllers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authController.login', () => {
    it('deve autenticar usuário com sucesso', async () => {
      Usuario.findOne.mockResolvedValue({
        id: 1,
        email: 'aluno@email.com',
        senha: 'hash_valido',
        role: 'admin',
        emailVerificado: true
      });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const req = { body: { email: 'aluno@email.com', senha: '123456' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await authController.login(req, res);

      expect(Usuario.findOne).toHaveBeenCalledWith({ where: { email: 'aluno@email.com' } });
      expect(generateToken).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ token: 'token-gerado' });
    });

    it('deve rejeitar login quando usuário não existe', async () => {
      Usuario.findOne.mockResolvedValue(null);

      const req = { body: { email: 'inexistente@email.com', senha: '123456' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Email ou senha inválidos!' });
    });

    it('deve rejeitar login quando o email não está verificado', async () => {
      Usuario.findOne.mockResolvedValue({
        id: 2,
        email: 'pendente@email.com',
        senha: 'hash',
        role: 'aluno',
        emailVerificado: false
      });

      const req = { body: { email: 'pendente@email.com', senha: '123456' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        erro: 'Email não verificado. Por favor, verifique antes de realizar o login',
        email: 'pendente@email.com'
      });
    });

    it('deve rejeitar login com senha inválida', async () => {
      Usuario.findOne.mockResolvedValue({
        id: 3,
        email: 'senha@email.com',
        senha: 'hash',
        role: 'aluno',
        emailVerificado: true
      });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const req = { body: { email: 'senha@email.com', senha: 'errada' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Email ou senha inválidos!' });
    });

    it('deve retornar erro em exceção do login', async () => {
      Usuario.findOne.mockRejectedValue(new Error('Erro de banco'));

      const req = { body: { email: 'falha@email.com', senha: '123456' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Erro de banco' });
    });
  });

  describe('usuarioController', () => {
    it('deve criar usuário com sucesso', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hash_senha');
      Usuario.create.mockResolvedValue({
        id: 11,
        email: 'novo@email.com',
        role: 'aluno',
        emailVerificado: false
      });

      const req = { body: { email: 'novo@email.com', senha: '123456' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await usuarioController.criarUsuario(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 12);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 11,
        email: 'novo@email.com',
        role: 'aluno',
        emailVerificado: false
      });
    });

    it('deve listar usuários com sucesso', async () => {
      Usuario.findAll.mockResolvedValue([
        { id: 1, email: 'a@email.com', role: 'aluno', emailVerificado: true },
        { id: 2, email: 'b@email.com', role: 'admin', emailVerificado: false }
      ]);

      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await usuarioController.listarUsuarios(req, res);

      expect(Usuario.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { id: 1, email: 'a@email.com', role: 'aluno', emailVerificado: true },
        { id: 2, email: 'b@email.com', role: 'admin', emailVerificado: false }
      ]);
    });

    it('deve rejeitar verificação quando usuário não existe', async () => {
      Usuario.findOne.mockResolvedValue(null);

      const req = { body: { email: 'naoexiste@email.com' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await usuarioController.solicitarVerificacao(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Usuário não encontrado!' });
    });

    it('deve rejeitar verificação quando email já foi validado', async () => {
      Usuario.findOne.mockResolvedValue({ email: 'ok@email.com', emailVerificado: true });

      const req = { body: { email: 'ok@email.com' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await usuarioController.solicitarVerificacao(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Email já verificado!' });
    });

    it('deve rejeitar envio quando o serviço de email falha', async () => {
      const usuario = {
        email: 'novo@email.com',
        emailVerificado: false,
        update: jest.fn().mockResolvedValue(true)
      };
      Usuario.findOne.mockResolvedValue(usuario);
      sendVerificationEmail.mockResolvedValue(false);
      jest.spyOn(crypto, 'randomInt').mockReturnValue(456789);

      const req = { body: { email: 'novo@email.com' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await usuarioController.solicitarVerificacao(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Erro ao enviar verificação!' });
    });

    it('deve solicitar verificação de email', async () => {
      const usuario = {
        email: 'novo@email.com',
        emailVerificado: false,
        update: jest.fn().mockResolvedValue(true)
      };
      Usuario.findOne.mockResolvedValue(usuario);
      sendVerificationEmail.mockResolvedValue(true);
      jest.spyOn(crypto, 'randomInt').mockReturnValue(123456);

      const req = { body: { email: 'novo@email.com' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await usuarioController.solicitarVerificacao(req, res);

      expect(usuario.update).toHaveBeenCalled();
      expect(sendVerificationEmail).toHaveBeenCalledWith('novo@email.com', '123456');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Código de verificação enviado com sucesso!' });
    });

    it('deve rejeitar verificação quando código estiver inválido', async () => {
      const usuario = {
        email: 'novo@email.com',
        emailVerificado: false,
        codigoVerificacao: '111111',
        codigoExpiracao: new Date(Date.now() + 60_000)
      };
      Usuario.findOne.mockResolvedValue(usuario);

      const req = { body: { email: 'novo@email.com', codigo: '222222' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await usuarioController.verificarEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Código inválido!' });
    });

    it('deve rejeitar verificação quando código estiver expirado', async () => {
      const usuario = {
        email: 'novo@email.com',
        emailVerificado: false,
        codigoVerificacao: '123456',
        codigoExpiracao: new Date(Date.now() - 60_000)
      };
      Usuario.findOne.mockResolvedValue(usuario);

      const req = { body: { email: 'novo@email.com', codigo: '123456' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await usuarioController.verificarEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Código expirado!' });
    });

    it('deve verificar o código do email', async () => {
      const usuario = {
        email: 'novo@email.com',
        emailVerificado: false,
        codigoVerificacao: '123456',
        codigoExpiracao: new Date(Date.now() + 60_000),
        update: jest.fn().mockResolvedValue(true)
      };
      Usuario.findOne.mockResolvedValue(usuario);

      const req = { body: { email: 'novo@email.com', codigo: '123456' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await usuarioController.verificarEmail(req, res);

      expect(usuario.update).toHaveBeenCalledWith({
        emailVerificado: true,
        codigoVerificacao: null,
        codigoExpiracao: null
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email verificado com sucesso!' });
    });
  });

  describe('alunoController', () => {
    it('deve criar aluno com sucesso', async () => {
      const alunoPayload = {
        nome: 'Ana',
        dataNascimento: new Date('2000-01-01'),
        usuarioId: 1,
        enderecoId: 2
      };

      Usuario.findByPk.mockResolvedValue({ id: 1, role: 'aluno' });
      Endereco.findByPk.mockResolvedValue({ id: 2 });
      Aluno.findOne.mockResolvedValue(null);
      Aluno.create.mockResolvedValue({ id: 5 });
      Aluno.findByPk.mockResolvedValue({
        id: 5,
        nome: 'Ana',
        dataNascimento: alunoPayload.dataNascimento,
        usuario: { id: 1, email: 'ana@email.com', role: 'aluno', emailVerificado: true },
        endereco: { id: 2, rua: 'A', numero: 10, cidade: 'SP', estado: 'SP', cep: '01000-000', complemento: 'Casa' }
      });

      const req = { body: alunoPayload };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await alunoController.criarAluno(req, res);

      expect(Aluno.create).toHaveBeenCalledWith(alunoPayload);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 5, nome: 'Ana' }));
    });

    it('deve listar alunos com sucesso', async () => {
      Aluno.findAll.mockResolvedValue([
        { id: 8, nome: 'Bia', usuario: { id: 1, email: 'b@email.com', role: 'aluno', emailVerificado: true }, endereco: { id: 2, rua: 'A', numero: 10, cidade: 'SP', estado: 'SP', cep: '01000-000', complemento: 'Casa' } }
      ]);

      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await alunoController.listarAlunos(req, res);

      expect(Aluno.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith([
        expect.objectContaining({ id: 8, nome: 'Bia' })
      ]);
    });

    it('deve retornar 404 quando aluno não existe ao buscar por id', async () => {
      Aluno.findByPk.mockResolvedValue(null);

      const req = { params: { id: 999 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await alunoController.buscarAlunoPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Aluno não encontrado!' });
    });

    it('deve atualizar aluno com sucesso', async () => {
      const aluno = { id: 9, update: jest.fn().mockResolvedValue(true) };
      const alunoAtualizado = { id: 9, nome: 'Novo Nome', usuario: {}, endereco: {} };
      Aluno.findByPk.mockResolvedValueOnce(aluno).mockResolvedValueOnce(alunoAtualizado);
      Endereco.findByPk.mockResolvedValue({ id: 4 });

      const req = { params: { id: 9 }, body: { nome: 'Novo Nome', enderecoId: 4 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await alunoController.atualizarAluno(req, res);

      expect(aluno.update).toHaveBeenCalledWith({ nome: 'Novo Nome', enderecoId: 4 });
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 9, nome: 'Novo Nome' }));
    });

    it('deve retornar 404 ao atualizar aluno inexistente', async () => {
      Aluno.findByPk.mockResolvedValue(null);

      const req = { params: { id: 50 }, body: { nome: 'X' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await alunoController.atualizarAluno(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Aluno não encontrado!' });
    });

    it('deve deletar aluno com sucesso', async () => {
      const aluno = { id: 10, destroy: jest.fn().mockResolvedValue(true) };
      Aluno.findByPk.mockResolvedValue(aluno);

      const req = { params: { id: 10 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await alunoController.deletarAluno(req, res);

      expect(aluno.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Aluno deletado com sucesso!' });
    });
  });

  describe('enderecoController', () => {
    it('deve criar endereço com sucesso', async () => {
      Endereco.create.mockResolvedValue({
        id: 7,
        rua: 'Rua A',
        numero: 101,
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01000-000',
        complemento: 'Casa'
      });

      const req = { body: { rua: 'Rua A', numero: 101, cidade: 'São Paulo', estado: 'SP', cep: '01000-000', complemento: 'Casa' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await enderecoController.criarEndereco(req, res);

      expect(Endereco.create).toHaveBeenCalledWith({
        rua: 'Rua A',
        numero: 101,
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01000-000',
        complemento: 'Casa'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 7, rua: 'Rua A' }));
    });

    it('deve listar endereços com sucesso', async () => {
      Endereco.findAll.mockResolvedValue([
        { id: 1, rua: 'Rua B', numero: 2, cidade: 'RJ', estado: 'RJ', cep: '20000-000', complemento: 'Apto 4' }
      ]);

      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await enderecoController.listarEnderecos(req, res);

      expect(Endereco.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith([
        expect.objectContaining({ id: 1, rua: 'Rua B' })
      ]);
    });

    it('deve buscar endereço por id inexistente', async () => {
      Endereco.findByPk.mockResolvedValue(null);

      const req = { params: { id: 999 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await enderecoController.buscarEnderecoPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Endereço não encontrado!' });
    });

    it('deve atualizar endereço com sucesso', async () => {
      const endereco = { id: 3, rua: 'Rua Antiga', update: jest.fn().mockResolvedValue(true) };
      Endereco.findByPk.mockResolvedValue(endereco);

      const req = { params: { id: 3 }, body: { rua: 'Rua Nova' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await enderecoController.atualizarEndereco(req, res);

      expect(endereco.update).toHaveBeenCalledWith({ rua: 'Rua Nova' });
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 3, rua: 'Rua Antiga' }));
    });

    it('deve impedir exclusão de endereço em uso por alunos', async () => {
      const endereco = {
        id: 5,
        getAlunos: jest.fn().mockResolvedValue([{ id: 1 }])
      };
      Endereco.findByPk.mockResolvedValue(endereco);

      const req = { params: { id: 5 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await enderecoController.deletarEndereco(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        erro: 'Não é possível deletar este endereço pois está sendo usado por alunos!'
      });
    });

    it('deve deletar endereço com sucesso', async () => {
      const endereco = {
        id: 6,
        getAlunos: jest.fn().mockResolvedValue([]),
        destroy: jest.fn().mockResolvedValue(true)
      };
      Endereco.findByPk.mockResolvedValue(endereco);

      const req = { params: { id: 6 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await enderecoController.deletarEndereco(req, res);

      expect(endereco.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ mensagem: 'Endereço deletado com sucesso!' });
    });
  });
});
