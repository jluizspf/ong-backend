const mariadb = require('mariadb');
require('dotenv').config();

// Configuração do pool de conexões
const pool = mariadb.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ong_database',
    connectionLimit: 10,
    acquireTimeout: 30000,
    timeout: 30000
});

// Função para testar a conexão
async function testConnection() {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log('✅ Conexão com MariaDB estabelecida com sucesso!');
        return true;
    } catch (err) {
        console.error('❌ Erro ao conectar com MariaDB:', err.message);
        return false;
    } finally {
        if (conn) conn.release();
    }
}

// Função para executar queries
async function executeQuery(sql, params = []) {
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query(sql, params);
        return result;
    } catch (err) {
        console.error('Erro na query:', err.message);
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

module.exports = {
    pool,
    testConnection,
    executeQuery
};
