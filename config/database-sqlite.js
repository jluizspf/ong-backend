const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o arquivo do banco de dados
const dbPath = path.join(__dirname, '..', 'database', 'ong_database.db');

// Criar conexão com SQLite
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Erro ao conectar com SQLite:', err.message);
    } else {
        console.log('✅ Conectado ao banco SQLite com sucesso!');
    }
});

// Função para testar a conexão
async function testConnection() {
    return new Promise((resolve, reject) => {
        db.get("SELECT 1 as test", (err, row) => {
            if (err) {
                console.error('❌ Erro ao testar conexão SQLite:', err.message);
                reject(false);
            } else {
                console.log('✅ Teste de conexão SQLite bem-sucedido!');
                resolve(true);
            }
        });
    });
}

// Função para executar queries
async function executeQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
            // Para SELECT, usar db.all
            db.all(sql, params, (err, rows) => {
                if (err) {
                    console.error('Erro na query SELECT:', err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        } else {
            // Para INSERT, UPDATE, DELETE, usar db.run
            db.run(sql, params, function(err) {
                if (err) {
                    console.error('Erro na query:', err.message);
                    reject(err);
                } else {
                    resolve({
                        insertId: this.lastID,
                        changes: this.changes,
                        affectedRows: this.changes
                    });
                }
            });
        }
    });
}

// Função para inicializar o banco de dados
async function initializeDatabase() {
    try {
        console.log('🔧 Inicializando banco de dados SQLite...');
        
        // Criar tabelas
        await executeQuery(`
            CREATE TABLE IF NOT EXISTS Colaborador (
                ID_Colab INTEGER PRIMARY KEY AUTOINCREMENT,
                Nome VARCHAR(255) NOT NULL,
                CPF VARCHAR(14) UNIQUE NOT NULL,
                Email VARCHAR(255) UNIQUE NOT NULL,
                Data_Admissao DATE NOT NULL,
                Telefone VARCHAR(20),
                Endereco TEXT
            )
        `);

        await executeQuery(`
            CREATE TABLE IF NOT EXISTS Professor (
                ID_Prof INTEGER PRIMARY KEY AUTOINCREMENT,
                Nome VARCHAR(255) NOT NULL,
                CPF VARCHAR(14) UNIQUE NOT NULL,
                Data_Nascimento DATE,
                Email VARCHAR(255) UNIQUE NOT NULL,
                Formacao VARCHAR(255),
                Endereco TEXT
            )
        `);

        await executeQuery(`
            CREATE TABLE IF NOT EXISTS Curso (
                ID_Curso INTEGER PRIMARY KEY AUTOINCREMENT,
                Nome VARCHAR(255) NOT NULL,
                Qtd_Vagas INTEGER NOT NULL,
                Per_Duracao VARCHAR(100),
                Local VARCHAR(255),
                Prof_Responsavel VARCHAR(255),
                Horario VARCHAR(100),
                Data_Registro DATE DEFAULT CURRENT_DATE,
                Verificado BOOLEAN DEFAULT 0,
                Colaborador_Resp VARCHAR(255)
            )
        `);

        await executeQuery(`
            CREATE TABLE IF NOT EXISTS Aluno (
                ID_Aluno INTEGER PRIMARY KEY AUTOINCREMENT,
                Nome VARCHAR(255) NOT NULL,
                CPF VARCHAR(14) UNIQUE NOT NULL,
                Data_Nascimento DATE,
                Email VARCHAR(255) UNIQUE,
                Telefone VARCHAR(20),
                Endereco TEXT,
                Renda_Familiar DECIMAL(10,2),
                Conheceu_Como VARCHAR(255),
                Verificado BOOLEAN DEFAULT 0,
                Colaborador_Resp VARCHAR(255)
            )
        `);

        await executeQuery(`
            CREATE TABLE IF NOT EXISTS Escolaridade (
                ID_Escolaridade INTEGER PRIMARY KEY AUTOINCREMENT,
                ID_Aluno INTEGER,
                Nivel VARCHAR(100) NOT NULL,
                Instituicao VARCHAR(255),
                Ano_Conclusao INTEGER,
                FOREIGN KEY (ID_Aluno) REFERENCES Aluno(ID_Aluno) ON DELETE CASCADE
            )
        `);

        await executeQuery(`
            CREATE TABLE IF NOT EXISTS Inscricao (
                ID_Inscricao INTEGER PRIMARY KEY AUTOINCREMENT,
                ID_Aluno INTEGER,
                ID_Curso INTEGER,
                Data_Inscricao DATE DEFAULT CURRENT_DATE,
                Status VARCHAR(20) DEFAULT 'Ativa',
                FOREIGN KEY (ID_Aluno) REFERENCES Aluno(ID_Aluno) ON DELETE CASCADE,
                FOREIGN KEY (ID_Curso) REFERENCES Curso(ID_Curso) ON DELETE CASCADE,
                UNIQUE(ID_Aluno, ID_Curso)
            )
        `);

        await executeQuery(`
            CREATE TABLE IF NOT EXISTS Verificacao_Curso (
                ID_Verificacao INTEGER PRIMARY KEY AUTOINCREMENT,
                ID_Colab INTEGER,
                ID_Curso INTEGER,
                Data_Verificacao DATE DEFAULT CURRENT_DATE,
                Status VARCHAR(20) DEFAULT 'Pendente',
                Observacoes TEXT,
                FOREIGN KEY (ID_Colab) REFERENCES Colaborador(ID_Colab) ON DELETE CASCADE,
                FOREIGN KEY (ID_Curso) REFERENCES Curso(ID_Curso) ON DELETE CASCADE
            )
        `);

        await executeQuery(`
            CREATE TABLE IF NOT EXISTS Ministracao (
                ID_Ministracao INTEGER PRIMARY KEY AUTOINCREMENT,
                ID_Prof INTEGER,
                ID_Curso INTEGER,
                Data_Inicio DATE,
                Data_Fim DATE,
                Status VARCHAR(20) DEFAULT 'Ativo',
                FOREIGN KEY (ID_Prof) REFERENCES Professor(ID_Prof) ON DELETE CASCADE,
                FOREIGN KEY (ID_Curso) REFERENCES Curso(ID_Curso) ON DELETE CASCADE
            )
        `);

        await executeQuery(`
            CREATE TABLE IF NOT EXISTS Inscricao_Professor (
                ID_Inscricao_Prof INTEGER PRIMARY KEY AUTOINCREMENT,
                ID_Colab INTEGER,
                ID_Prof INTEGER,
                Data_Inscricao DATE DEFAULT CURRENT_DATE,
                Status VARCHAR(20) DEFAULT 'Ativa',
                FOREIGN KEY (ID_Colab) REFERENCES Colaborador(ID_Colab) ON DELETE CASCADE,
                FOREIGN KEY (ID_Prof) REFERENCES Professor(ID_Prof) ON DELETE CASCADE
            )
        `);

        console.log('✅ Banco de dados SQLite inicializado com sucesso!');
        return true;
    } catch (error) {
        console.error('❌ Erro ao inicializar banco de dados:', error.message);
        return false;
    }
}

module.exports = {
    db,
    testConnection,
    executeQuery,
    initializeDatabase
};
