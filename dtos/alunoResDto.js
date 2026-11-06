module.exports = {
    fromEntity: (aluno) => {
        return {
            id: aluno.id,
            nome: aluno.nome,
            dataNascimento: aluno.dataNascimento,
            usuario: aluno.usuario ? {
                id: aluno.usuario.id,
                email: aluno.usuario.email,
                role: aluno.usuario.role,
                emailVerificado: aluno.usuario.emailVerificado
            } : null,
            endereco: aluno.endereco ? {
                id: aluno.endereco.id,
                rua: aluno.endereco.rua,
                numero: aluno.endereco.numero,
                cidade: aluno.endereco.cidade,
                estado: aluno.endereco.estado,
                cep: aluno.endereco.cep,
                complemento: aluno.endereco.complemento
            } : null,
            createdAt: aluno.createdAt,
            updatedAt: aluno.updatedAt
        };
    }
}; 