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
        tags: [
            { name: 'Auth', description: 'Autenticação' },
            { name: 'Usuários', description: 'Cadastro e verificação de usuários' },
            { name: 'Endereços', description: 'Gestão de endereços' },
            { name: 'Alunos', description: 'Gestão de alunos' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
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
                MessageResponse: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Operação realizada com sucesso!' },
                        mensagem: { type: 'string', example: 'Operação realizada com sucesso!' }
                    }
                },
                UsuarioRequest: {
                    type: 'object',
                    required: ['email', 'senha', 'role'],
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
                },
                EmailRequest: {
                    type: 'object',
                    required: ['email'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'aluno@exemplo.com' }
                    }
                },
                VerifyEmailRequest: {
                    type: 'object',
                    required: ['email', 'codigo'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'aluno@exemplo.com' },
                        codigo: { type: 'string', example: '123456' }
                    }
                },
                AuthLoginRequest: {
                    type: 'object',
                    required: ['email', 'senha'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'admin@exemplo.com' },
                        senha: { type: 'string', format: 'password', example: 'senha-segura' }
                    }
                },
                AuthLoginResponse: {
                    type: 'object',
                    properties: {
                        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
                    }
                },
                EnderecoRequest: {
                    type: 'object',
                    required: ['cep'],
                    properties: {
                        rua: { type: 'string', example: 'Rua das Flores' },
                        numero: { type: 'string', example: '123' },
                        cidade: { type: 'string', example: 'Fortaleza' },
                        estado: { type: 'string', example: 'CE' },
                        cep: { type: 'string', example: '60000-000' },
                        complemento: { type: 'string', example: 'Apto 302' }
                    }
                },
                EnderecoUpdateRequest: {
                    type: 'object',
                    properties: {
                        rua: { type: 'string', example: 'Rua das Flores' },
                        numero: { type: 'string', example: '123' },
                        cidade: { type: 'string', example: 'Fortaleza' },
                        estado: { type: 'string', example: 'CE' },
                        cep: { type: 'string', example: '60000-000' },
                        complemento: { type: 'string', example: 'Apto 302' }
                    }
                },
                EnderecoResponse: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        rua: { type: 'string', example: 'Rua das Flores' },
                        numero: { type: 'string', example: '123' },
                        cidade: { type: 'string', example: 'Fortaleza' },
                        estado: { type: 'string', example: 'CE' },
                        cep: { type: 'string', example: '60000-000' },
                        complemento: { type: 'string', example: 'Apto 302' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                AlunoRequest: {
                    type: 'object',
                    required: ['nome', 'dataNascimento', 'usuarioId', 'enderecoId'],
                    properties: {
                        nome: { type: 'string', example: 'João Silva' },
                        dataNascimento: { type: 'string', format: 'date', example: '2008-05-15' },
                        usuarioId: { type: 'integer', example: 1 },
                        enderecoId: { type: 'integer', example: 2 }
                    }
                },
                AlunoUpdateRequest: {
                    type: 'object',
                    properties: {
                        nome: { type: 'string', example: 'João Silva Santos' },
                        dataNascimento: { type: 'string', format: 'date', example: '2008-05-15' },
                        enderecoId: { type: 'integer', example: 3 }
                    }
                },
                AlunoResponse: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        nome: { type: 'string', example: 'João Silva' },
                        dataNascimento: { type: 'string', format: 'date-time' },
                        usuario: {
                            type: 'object',
                            nullable: true,
                            properties: {
                                id: { type: 'integer', example: 1 },
                                email: { type: 'string', format: 'email', example: 'aluno@exemplo.com' },
                                role: { type: 'string', enum: ['admin', 'professor', 'aluno'], example: 'aluno' },
                                emailVerificado: { type: 'boolean', example: true }
                            }
                        },
                        endereco: {
                            type: 'object',
                            nullable: true,
                            properties: {
                                id: { type: 'integer', example: 2 },
                                rua: { type: 'string', example: 'Rua das Flores' },
                                numero: { type: 'string', example: '123' },
                                cidade: { type: 'string', example: 'Fortaleza' },
                                estado: { type: 'string', example: 'CE' },
                                cep: { type: 'string', example: '60000-000' },
                                complemento: { type: 'string', example: 'Apto 302' }
                            }
                        },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                }
            }
        },
        paths: {
            '/auth/login': {
                post: {
                    tags: ['Auth'],
                    summary: 'Realiza login e retorna token JWT',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/AuthLoginRequest' }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Login realizado com sucesso',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/AuthLoginResponse' }
                                }
                            }
                        },
                        400: {
                            description: 'Email ou senha inválidos',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        401: {
                            description: 'Senha inválida',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        403: {
                            description: 'Email não verificado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },
            '/usuarios': {
                post: {
                    tags: ['Usuários'],
                    summary: 'Cria um usuário',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/UsuarioRequest' }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Usuário criado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/UsuarioResponse' }
                                }
                            }
                        },
                        400: {
                            description: 'Dados inválidos',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                },
                get: {
                    tags: ['Usuários'],
                    summary: 'Lista usuários',
                    responses: {
                        200: {
                            description: 'Lista de usuários',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/UsuarioResponse' }
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Erro ao listar usuários',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },
            '/usuarios/solicitar': {
                post: {
                    tags: ['Usuários'],
                    summary: 'Solicita código de verificação de email',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/EmailRequest' }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Código enviado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/MessageResponse' }
                                }
                            }
                        },
                        400: {
                            description: 'Não foi possível enviar a verificação ou email já verificado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        404: {
                            description: 'Usuário não encontrado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },
            '/usuarios/verificar': {
                post: {
                    tags: ['Usuários'],
                    summary: 'Verifica o email do usuário',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/VerifyEmailRequest' }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Email verificado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/MessageResponse' }
                                }
                            }
                        },
                        400: {
                            description: 'Dados inválidos ou email já verificado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        401: {
                            description: 'Código inválido ou expirado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        404: {
                            description: 'Usuário não encontrado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },
            '/enderecos': {
                post: {
                    tags: ['Endereços'],
                    summary: 'Cria um endereço (admin)',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/EnderecoRequest' }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Endereço criado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/EnderecoResponse' }
                                }
                            }
                        },
                        400: {
                            description: 'Dados inválidos',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        401: {
                            description: 'Token inválido ou ausente',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        403: {
                            description: 'Sem permissão',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                },
                get: {
                    tags: ['Endereços'],
                    summary: 'Lista endereços (admin)',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: {
                            description: 'Lista de endereços',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/EnderecoResponse' }
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Erro ao listar endereços',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        401: {
                            description: 'Token inválido ou ausente',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        403: {
                            description: 'Sem permissão',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },
            '/enderecos/{id}': {
                get: {
                    tags: ['Endereços'],
                    summary: 'Busca endereço por ID (admin)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ $ref: '#/components/parameters/Id' }],
                    responses: {
                        200: {
                            description: 'Endereço encontrado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/EnderecoResponse' }
                                }
                            }
                        },
                        404: {
                            description: 'Endereço não encontrado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        401: {
                            description: 'Token inválido ou ausente',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        403: {
                            description: 'Sem permissão',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                },
                put: {
                    tags: ['Endereços'],
                    summary: 'Atualiza endereço (admin)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ $ref: '#/components/parameters/Id' }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/EnderecoUpdateRequest' }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Endereço atualizado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/EnderecoResponse' }
                                }
                            }
                        },
                        400: {
                            description: 'Dados inválidos',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        404: {
                            description: 'Endereço não encontrado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        401: {
                            description: 'Token inválido ou ausente',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        403: {
                            description: 'Sem permissão',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                },
                delete: {
                    tags: ['Endereços'],
                    summary: 'Deleta endereço (admin)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ $ref: '#/components/parameters/Id' }],
                    responses: {
                        200: {
                            description: 'Endereço deletado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/MessageResponse' }
                                }
                            }
                        },
                        400: {
                            description: 'Não foi possível deletar o endereço',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        404: {
                            description: 'Endereço não encontrado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        401: {
                            description: 'Token inválido ou ausente',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        403: {
                            description: 'Sem permissão',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },
            '/alunos': {
                post: {
                    tags: ['Alunos'],
                    summary: 'Cria aluno (admin)',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/AlunoRequest' }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Aluno criado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/AlunoResponse' }
                                }
                            }
                        },
                        400: {
                            description: 'Dados inválidos ou regra de negócio violada',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        401: {
                            description: 'Token inválido ou ausente',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        403: {
                            description: 'Sem permissão',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        404: {
                            description: 'Usuário ou endereço não encontrado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                },
                get: {
                    tags: ['Alunos'],
                    summary: 'Lista alunos (admin e professor)',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: {
                            description: 'Lista de alunos',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/AlunoResponse' }
                                    }
                                }
                            }
                        },
                        400: {
                            description: 'Erro ao listar alunos',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        401: {
                            description: 'Token inválido ou ausente',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        403: {
                            description: 'Sem permissão',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            },
            '/alunos/{id}': {
                get: {
                    tags: ['Alunos'],
                    summary: 'Busca aluno por ID (admin e professor)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ $ref: '#/components/parameters/Id' }],
                    responses: {
                        200: {
                            description: 'Aluno encontrado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/AlunoResponse' }
                                }
                            }
                        },
                        404: {
                            description: 'Aluno não encontrado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        401: {
                            description: 'Token inválido ou ausente',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        403: {
                            description: 'Sem permissão',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                },
                put: {
                    tags: ['Alunos'],
                    summary: 'Atualiza aluno (admin)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ $ref: '#/components/parameters/Id' }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/AlunoUpdateRequest' }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Aluno atualizado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/AlunoResponse' }
                                }
                            }
                        },
                        400: {
                            description: 'Dados inválidos',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        404: {
                            description: 'Aluno ou endereço não encontrado',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        401: {
                            description: 'Token inválido ou ausente',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        },
                        403: {
                            description: 'Sem permissão',
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/Error' }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    apis: []
};

module.exports = swaggerJsdoc(options);
