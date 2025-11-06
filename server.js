// server.js (MODERNIZADO)
const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser'); // <-- NÃO É MAIS NECESSÁRIO
const helmet = require('helmet');
require('dotenv').config();

// Importar apenas do ficheiro SQLITE
const { initializeDatabase } = require('./config/database-sqlite');

// Importar rotas
const alunosRoutes = require('./routes/alunos');
const cursosRoutes = require('./routes/cursos');
const professoresRoutes = require('./routes/professores');
const colaboradoresRoutes = require('./routes/colaboradores');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';


// Bloquear solicitações a arquivos sensíveis (caso nginx ou servidor tente servir algo)
app.use((req, res, next) => {
  const blocked = /\.(env|git|htpasswd|htaccess|sqlite|db|json|log)$/i;
  if (blocked.test(req.path)) {
    return res.status(404).end();
  }
  next();
});

// Segurança e middlewares
app.use(helmet());
app.use(cors({ origin: true }));
// ---- MUDANÇA AQUI ----
app.use(express.json({ limit: '1mb' })); // Substitui bodyParser.json
app.use(express.urlencoded({ extended: true, limit: '1mb' })); // Substitui bodyParser.urlencoded
// ---- FIM DA MUDANÇA ----


// Middleware para log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rota de teste raiz (apenas info básica)
app.get('/', (req, res) => {
  res.json({
    message: 'API da ONG - Sistema de Gestão Educacional',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Rota de saúde padronizada em /api/health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: 'connected',
    timestamp: new Date().toISOString()
  });
});

// Rotas da API (prefixadas em /api)
app.use('/api/alunos', alunosRoutes);
app.use('/api/cursos', cursosRoutes);
app.use('/api/professores', professoresRoutes);
app.use('/api/colaboradores', colaboradoresRoutes);



// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.error('Erro não tratado:', error);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: NODE_ENV === 'development' ? error.message : 'Erro interno'
  });
});

// Iniciar servidor apenas após DB inicializado
const startServer = async () => {
  try {
    console.log('🔧 Inicializando banco de dados SQLite...');
    await initializeDatabase();
    console.log('✅ Banco de dados inicializado com sucesso!');
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📊 Ambiente: ${NODE_ENV}`);
      console.log(`🌐 API disponível em: http://localhost:${PORT}`);
    });
    return server;
  } catch (error) {
    console.error('❌ Falha ao inicializar o servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
