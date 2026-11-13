const authReqDto = require('../../dtos/authReqDto');
const authResDto = require('../../dtos/authResDto');
const usuarioReqDto = require('../../dtos/usuarioReqDto');
const usuarioResDto = require('../../dtos/usuarioResDto');
const alunoReqDto = require('../../dtos/alunoReqDto');
const alunoResDto = require('../../dtos/alunoResDto');
const enderecoReqDto = require('../../dtos/enderecoReqDto');
const enderecoResDto = require('../../dtos/enderecoResDto');

describe('DTOs', () => {
  it('deve mapear login para entidade', () => {
    const entidade = authReqDto.loginToEntity({ email: 'teste@email.com', senha: '123456' });

    expect(entidade).toEqual({ email: 'teste@email.com', senha: '123456' });
  });

  it('deve lançar erro ao validar login sem email', () => {
    expect(() => authReqDto.loginToEntity({ senha: '123456' })).toThrow('Email é obrigatório');
  });

  it('deve devolver payload do login', () => {
    expect(authResDto.loginFromEntity({}, 'token-abc')).toEqual({ token: 'token-abc' });
  });

  it('deve mapear usuário para entidade', () => {
    const entidade = usuarioReqDto.toEntity({ email: 'user@email.com', senha: '123456' });

    expect(entidade).toEqual({
      email: 'user@email.com',
      senha: '123456',
      role: 'aluno',
      emailVerificado: false
    });
  });

  it('deve serializar usuário para resposta', () => {
    const dto = usuarioResDto.fromEntity({
      id: 4,
      email: 'user@email.com',
      role: 'admin',
      emailVerificado: true
    });

    expect(dto).toEqual({
      id: 4,
      email: 'user@email.com',
      role: 'admin',
      emailVerificado: true
    });
  });

  it('deve validar aluno e converter data de nascimento', () => {
    const dto = alunoReqDto.toEntity({
      nome: 'Carlos',
      dataNascimento: '2000-02-10',
      usuarioId: 1,
      enderecoId: 2
    });

    expect(dto.nome).toBe('Carlos');
    expect(dto.usuarioId).toBe(1);
    expect(dto.enderecoId).toBe(2);
    expect(dto.dataNascimento).toBeInstanceOf(Date);
  });

  it('deve atualizar dados do aluno com valores válidos', () => {
    const dto = alunoReqDto.toUpdateEntity({
      nome: 'Maria',
      dataNascimento: '1998-10-15',
      enderecoId: 8
    });

    expect(dto).toEqual({
      nome: 'Maria',
      dataNascimento: new Date('1998-10-15'),
      enderecoId: 8
    });
  });

  it('deve serializar aluno completo', () => {
    const dto = alunoResDto.fromEntity({
      id: 3,
      nome: 'Lucas',
      dataNascimento: new Date('2001-01-01'),
      usuario: { id: 9, email: 'l@email.com', role: 'aluno', emailVerificado: true },
      endereco: { id: 2, rua: 'Rua XPTO', numero: 12, cidade: 'SP', estado: 'SP', cep: '01000-000', complemento: 'Apto 1' },
      createdAt: '2024-01-01',
      updatedAt: '2024-01-02'
    });

    expect(dto.usuario.email).toBe('l@email.com');
    expect(dto.endereco.rua).toBe('Rua XPTO');
  });

  it('deve validar CEP do endereço', () => {
    const dto = enderecoReqDto.toEntity({
      rua: 'Rua A',
      numero: 10,
      cidade: 'SP',
      estado: 'SP',
      cep: '01000-000',
      complemento: 'Casa'
    });

    expect(dto.cep).toBe('01000-000');
  });

  it('deve lançar erro para CEP inválido', () => {
    expect(() => enderecoReqDto.toEntity({ cep: '123456' })).toThrow('CEP no formato inválido');
  });

  it('deve serializar endereço para resposta', () => {
    const dto = enderecoResDto.fromEntity({
      id: 6,
      rua: 'Rua B',
      numero: 7,
      cidade: 'RJ',
      estado: 'RJ',
      cep: '20000-000',
      complemento: 'Bloco A',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-02'
    });

    expect(dto).toEqual({
      id: 6,
      rua: 'Rua B',
      numero: 7,
      cidade: 'RJ',
      estado: 'RJ',
      cep: '20000-000',
      complemento: 'Bloco A',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-02'
    });
  });
});
