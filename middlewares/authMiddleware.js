const { verifyToken } = require("../utils/tokenService");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ erro: 'Token não está no header!' })
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ erro: 'Token não fornecido!' })
        }

        const decoded = verifyToken(token);
        req.usuario = decoded;
        next()
    } catch (error) {
        return res.status(401).json({ erro: 'Token inválido ou expirado!' })
    }
}

const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.usuario.role)) {
            return res.status(403).json({
                erro: 'Você não tem permissão para acessar esse recurso!'
            });
        }
        next();
    }
}

module.exports = {
    roleMiddleware,
    authMiddleware
}