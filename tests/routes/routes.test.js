jest.mock('../../controllers/authController', () => ({
  login: jest.fn()
}));

jest.mock('../../controllers/usuarioController', () => ({
  criarUsuario: jest.fn(),
  listarUsuarios: jest.fn(),
  solicitarVerificacao: jest.fn(),
  verificarEmail: jest.fn()
}));

jest.mock('../../controllers/alunoController', () => ({
  criarAluno: jest.fn(),
  listarAlunos: jest.fn(),
  buscarAlunoPorId: jest.fn(),
  atualizarAluno: jest.fn(),
  deletarAluno: jest.fn()
}));

jest.mock('../../controllers/enderecoController', () => ({
  criarEndereco: jest.fn(),
  listarEnderecos: jest.fn(),
  buscarEnderecoPorId: jest.fn(),
  atualizarEndereco: jest.fn(),
  deletarEndereco: jest.fn()
}));

const authRoutes = require('../../routes/authRoutes');
const usuarioRoutes = require('../../routes/usuarioRoutes');
const alunoRoutes = require('../../routes/alunoRoutes');
const enderecoRoutes = require('../../routes/enderecoRoutes');

const getRouteInfo = (router) => {
  return router.stack
    .filter((layer) => layer.route)
    .map((layer) => ({
      path: layer.route.path,
      methods: Object.keys(layer.route.methods)
    }));
};

describe('Rotas da API', () => {
  it('deve registrar rota de login', () => {
    expect(getRouteInfo(authRoutes)).toEqual([
      { path: '/login', methods: ['post'] }
    ]);
  });

  it('deve registrar rotas de usuários', () => {
    expect(getRouteInfo(usuarioRoutes)).toEqual([
      { path: '/', methods: ['post'] },
      { path: '/', methods: ['get'] },
      { path: '/solicitar', methods: ['post'] },
      { path: '/verificar', methods: ['post'] }
    ]);
  });

  it('deve registrar rotas de alunos com autenticação e roles', () => {
    const routes = getRouteInfo(alunoRoutes);

    expect(routes.map((route) => route.path)).toEqual(['/', '/:id', '/', '/:id']);
    expect(routes.every((route) => route.methods.length > 0)).toBe(true);
  });

  it('deve registrar rotas de endereços com autenticação e roles', () => {
    const routes = getRouteInfo(enderecoRoutes);
    const paths = routes.map((route) => route.path);

    expect(paths).toEqual(expect.arrayContaining(['/', '/:id']));
    expect(paths.length).toBe(5);
    expect(routes.every((route) => route.methods.length > 0)).toBe(true);
  });
});
