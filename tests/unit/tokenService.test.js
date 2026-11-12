describe('Verifica o serviço de token', () => {
    beforeAll(() => {
        process.env.JWT_SECRET = 'secret';
        process.env.ACESS_TOKEN_EXPIRATION = '1h';
        tokenService = require('../../utils/tokenService.js')
    })

    it('deve gerar token e validar dados de usuario', () => {
        const usuario = {
            id: 7,
            email: 'teste@email.com',
            role: 'admin'
        }

        const token = tokenService.generateToken(usuario);
        const payload = tokenService.verifyToken(token);

        expect(payload).toEqual(expect.objectContaining(usuario));

    });

    it('deve rejeitar um token invalido', () => {
        expect(() => tokenService.verifyToken('token-errado')).toThrow('Token invalido ou expirado!')
    });

});