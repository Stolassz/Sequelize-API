const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'Sequelize API',
            version: '1.0.0',
            description: 'API de gerenciamento da aplicação escolar.'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor local'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        erro: {
                            type: 'string',
                            example: 'Recurso não encontrado!'
                        }
                    }
                },
                UsuarioRequest: {
                    type: 'object',
                    required: ['senha'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'aluno@exemplo.com' },
                        senha: { type: 'string', format: 'password', example: 'senha-segura' },
                        role: { type: 'string', enum: ['admin', 'professor', 'aluno'], example: 'aluno' },
                        emailVerificado: { type: 'boolean', default: false, example: false }
                    }
                },
                UsuarioResponse: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        email: { type: 'string', format: 'email', example: 'aluno@exemplo.com' },
                        role: { type: 'string', enum: ['admin', 'professor', 'aluno'], example: 'aluno' },
                        emailVerificado: { type: 'boolean', example: true }
                    }
                }
            },
            parameters: {
                Id: {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'integer', minimum: 1 },
                    example: 1
                }
            }
        },
        paths: {
            '/usuarios': {
                post: {
                    tags: ['Usuários'],
                    summary: 'Cria um usuário',
                    requestBody: {
                        required: true,
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/UsuarioRequest' } } }
                    },
                    responses: {
                        201: { description: 'Usuário criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/UsuarioResponse' } } } },
                        400: { description: 'Dados inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                        409: { description: 'Email já cadastrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                    }
                },
                get: {
                    tags: ['Usuários'],
                    summary: 'Lista usuários',
                    responses: {
                        200: {
                            description: 'Lista de usuários',
                            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/UsuarioResponse' } } } }
                        }
                    }
                }
            },
            '/usuarios/{id}': {
                get: {
                    tags: ['Usuários'],
                    summary: 'Busca usuário por ID',
                    parameters: [{ $ref: '#/components/parameters/Id' }],
                    responses: {
                        200: { description: 'Usuário encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/UsuarioResponse' } } } },
                        404: { description: 'Usuário não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                    }
                }
            },
            '/usuarios/solicitar': {
                post: {
                    tags: ['Usuários'],
                    summary: 'Solicita código de verificação de email',
                    requestBody: {
                        required: true,
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/EmailRequest' } } }
                    },
                    responses: {
                        200: { description: 'Código enviado', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } },
                        400: { description: 'Não foi possível enviar a verificação', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                        404: { description: 'Usuário não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                    }
                }
            },
            '/usuarios/verificar': {
                post: {
                    tags: ['Usuários'],
                    summary: 'Verifica o email do usuário',
                    requestBody: {
                        required: true,
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/VerifyEmailRequest' } } }
                    },
                    responses: {
                        200: { description: 'Email verificado', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } },
                        400: { description: 'Dados inválidos ou email já verificado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                        401: { description: 'Código inválido ou expirado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                        404: { description: 'Usuário não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                    }
                }
            }
        }
    },
    apis: []
};

module.exports = swaggerJsdoc(options);
