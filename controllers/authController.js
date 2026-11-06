const authReqDto = require("../dtos/authReqDto.js");
const bcrypt = require('bcrypt');
const { Usuario } = require('../models');
const { generateToken } = require("../utils/tokenService");
const authResDto = require("../dtos/authResDto.js");

exports.login = async (req, res) => {
    try {
        const dados = authReqDto.loginToEntity(req.body);
        const usuario = await Usuario.findOne({
            where: { email: dados.email }
        });

        if(!usuario) {
            return res.status(400).json({ erro: 'Email ou senha inválidos!' });
        }

        if (!usuario.emailVerificado) {
            return res.status(403).json({
                erro: 'Email não verificado. Por favor, verifique antes de realizar o login',
                email: usuario.email
            });
        }

        const senhaValida = await bcrypt.compare(dados.senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Email ou senha inválidos!' });
        }
        
        const token = generateToken(usuario);
        res.json(authResDto.loginFromEntity(usuario, token))
    } catch (error) {
        res.status(400).json({ erro: error.message })
    }
}