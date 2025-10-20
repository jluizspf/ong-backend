const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { testConnection, initializeDatabase } = require('./config/database-sqlite');

// Importar rotas
const alunosRoutes = require('./routes/alunos');
const cursosRoutes = require('./routes/cursos');
const professoresRoutes = require('./routes/professores');
const colaboradoresRoutes = require('./routes/colaboradores');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para log de requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rota de teste
app.get('/', (req, res) => {
    res.json({
        message: 'API da ONG - Sistema de Gestão Educacional',
        version: '1.0.0',
        status: 'online',
        timestamp: new Date().toISOString()
    });
});

// Rota de saúde da API
app.get('/health', async (req, res) => {
    try {
        const dbStatus = await testConnection();
        res.json({
            status: 'ok',
            database: dbStatus ? 'connected' : 'disconnected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erro ao verificar saúde da API',
            error: error.message
        });
    }
});

// Rotas da API
app.use('/api/alunos', alunosRoutes);
app.use('/api/cursos', cursosRoutes);
app.use('/api/professores', professoresRoutes);
app.use('/api/colaboradores', colaboradoresRoutes);

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
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
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
    });
});

// Iniciar servidor
app.listen(PORT, async () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    
    // Inicializar banco de dados SQLite
    const dbInitialized = await initializeDatabase();
    if (dbInitialized) {
        console.log('✅ Banco de dados SQLite inicializado com sucesso!');
    } else {
        console.log('⚠️  Aviso: Erro ao inicializar banco de dados');
    }
    
    // Testar conexão com banco
    const dbConnected = await testConnection();
    if (dbConnected) {
        console.log('✅ Conexão com banco de dados estabelecida!');
    } else {
        console.log('⚠️  Aviso: Banco de dados não conectado');
    }
    
    console.log(`🌐 API disponível em: http://localhost:${PORT}`);
    console.log(`📋 Documentação: http://localhost:${PORT}/health`);
});

module.exports = app;
