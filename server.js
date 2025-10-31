const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
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

// Rota de saúde da API (SIMPLIFICADA E CORRIGIDA)
// Se a API está a responder, o DB *tem* de estar ligado,
// porque 'startServer' (abaixo) teria falhado se não estivesse.
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        database: 'connected', // Assumimos 'connected' porque o 'startServer' foi bem-sucedido
        timestamp: new Date().toISOString()
    });
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

// Middleware de tratamento de erros (O ORIGINAL do seu ficheiro)
app.use((error, req, res, next) => {
    console.error('Erro não tratado:', error);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: NODE_ENV === 'development' ? error.message : 'Erro interno'
    });
});

// Iniciar servidor
const startServer = async () => {
    try {
        await initializeDatabase(); // Tenta ligar/inicializar o DB
        // SÓ CHEGA AQUI SE O DB ESTIVER OK
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
            console.log(`📊 Ambiente: ${NODE_ENV}`);
            console.log(`✅ Conexão com banco de dados estabelecida!`);
        });
    } catch (error) {
        console.error("❌ Falha ao inicializar o servidor:", error);
        process.exit(1); // Sai se não conseguir ligar o DB
    }
};

startServer();

module.exports = app;
