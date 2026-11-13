const jwt =  require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET || 'secret';
const EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION || process.env.ACESS_TOKEN_EXPIRATION || '1h';

const generateToken = (usuario) => {
    return jwt.sign(
        {
            id: usuario.id,
            email: usuario.email,
            role: usuario.role
        },
        SECRET,
        { expiresIn: EXPIRATION }
    );
}

const verifyToken =  (token) => {
    try {
        return jwt.verify(token, SECRET);
    } catch (error) {
        throw new Error('Token inválido ou expirado!');
    }
}

module.exports = {
    generateToken,
    verifyToken
}