module.exports = {
    toEntity: (body) => {
        if (!body.nome || typeof body.nome !== 'string') {
            throw new Error('Nome é obrigatório!');
        }
        if (!body.dataNascimento || !(body.dataNascimento instanceof Date) && isNaN(Date.parse(body.dataNascimento))) {
            throw new Error('Data de nascimento é obrigatória e deve ser uma data válida!');
        }

        return {
            nome: body.nome,
            dataNascimento: new Date(body.dataNascimento),
            usuarioId: body.usuarioId,
            enderecoId: body.enderecoId
        };
    },

    toUpdateEntity: (body) => {
        const updateData = {};

        if (body.nome !== undefined) {
            if (typeof body.nome !== 'string') {
                throw new Error('Nome deve ser uma string!');
            }
            updateData.nome = body.nome;
        }

        if (body.dataNascimento !== undefined) {
            if (!(body.dataNascimento instanceof Date) && isNaN(Date.parse(body.dataNascimento))) {
                throw new Error('Data de nascimento deve ser uma data válida!');
            }
            updateData.dataNascimento = new Date(body.dataNascimento);
        }

        if (body.enderecoId !== undefined) {
            if (typeof body.enderecoId !== 'number') {
                throw new Error('ID do endereço deve ser um número!');
            }
            updateData.enderecoId = body.enderecoId;
        }

        return updateData;
    }
}; 