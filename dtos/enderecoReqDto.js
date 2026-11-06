module.exports = {
    toEntity: (body) => {
        if(!body.cep || typeof body.cep !== 'string' || !/^\d{5}-?\d{3}$/.test(body.cep)) {
            throw new Error('CEP no formato inválido')
        }

        return {
            rua: body.rua,
            numero: body.numero,
            cidade: body.cidade,
            estado: body.estado,
            cep: body.cep,
            complemento: body.complemento
        }
    }
}