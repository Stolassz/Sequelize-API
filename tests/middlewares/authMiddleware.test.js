jest.mock('../../utils/tokenService', () => ({
  verifyToken: jest.fn()
}));

const { authMiddleware, roleMiddleware } = require('../../middlewares/authMiddleware');
const { verifyToken } = require('../../utils/tokenService');

describe('Auth Middleware', () => {
  it('deve bloquear requisição sem header de autorização', () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ erro: 'Token não está no header!' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve bloquear requisição sem token', () => {
    const req = { headers: { authorization: 'Bearer' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ erro: 'Token não fornecido!' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve autenticar usuário com token válido', () => {
    verifyToken.mockReturnValue({ id: 7, email: 'user@email.com', role: 'admin' });

    const req = { headers: { authorization: 'Bearer token-valido' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(verifyToken).toHaveBeenCalledWith('token-valido');
    expect(req.usuario).toEqual({ id: 7, email: 'user@email.com', role: 'admin' });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('deve negar acesso quando o papel não é permitido', () => {
    const req = { usuario: { role: 'aluno' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    roleMiddleware(['admin'])(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ erro: 'Você não tem permissão para acessar esse recurso!' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve permitir acesso quando o papel tem permissão', () => {
    const req = { usuario: { role: 'professor' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    roleMiddleware(['admin', 'professor'])(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
