// Importa a conexão 'db' do ficheiro de configuração
const { db } = require('../config/database-sqlite.js');

/**
 * Classe Modelo para a entidade Curso.
 * Contém métodos estáticos para interagir com a tabela Curso.
 */
class Curso {

    // --- MÉTODOS CRUD BÁSICOS ---

    // Busca todos os cursos
    static async getAll() {
        const sql = 'SELECT * FROM Curso';
        return await db.all(sql);
    }

    // Busca um curso específico pelo ID
    static async getById(id) {
        const sql = 'SELECT * FROM Curso WHERE ID_Curso = ?';
        return await db.get(sql, [id]);
    }

    // Cria um novo curso
    static async create(cursoData) {
        const sql = 'INSERT INTO Curso (Nome, Qtd_Vagas) VALUES (?, ?)';
        const result = await db.run(sql, [cursoData.Nome, cursoData.Qtd_Vagas]);
        return result.lastID; // Retorna o ID gerado pelo banco
    }

    // Atualiza um curso existente
    static async update(id, cursoData) {
        const sql = 'UPDATE Curso SET Nome = ?, Qtd_Vagas = ? WHERE ID_Curso = ?';
        const result = await db.run(sql, [cursoData.Nome, cursoData.Qtd_Vagas, id]);
        return result.changes > 0; // Retorna true se alterou alguma linha
    }

    // Deleta um curso
    static async delete(id) {
        const sql = 'DELETE FROM Curso WHERE ID_Curso = ?';
        const result = await db.run(sql, [id]);
        return result.changes > 0;
    }

    // --- MÉTODOS ESPECÍFICOS ---

    /**
     * Obtém a contagem de matrículas (Inscricao) por curso dentro de um período.
     * @param {string} dataInicio Formato 'YYYY-MM-DD'
     * @param {string} dataFim Formato 'YYYY-MM-DD'
     * @returns {Promise<Array>}
     */
    static async getMatriculasPorPeriodo(dataInicio, dataFim) {
        const sql = `
            SELECT
                C.Nome AS nome_curso,
                COUNT(I.ID_Inscricao) AS quantidade_matriculas
            FROM
                Inscricao AS I
            JOIN
                Curso AS C ON I.ID_Curso = C.ID_Curso
            WHERE
                I.Data_Inscricao BETWEEN ? AND ?
            GROUP BY
                C.Nome
            ORDER BY
                quantidade_matriculas DESC
        `;
        try {
            return await db.all(sql, [dataInicio, dataFim]);
        } catch (err) {
            console.error(err.message);
            throw new Error('Erro ao consultar estatísticas no banco de dados');
        }
    }
}

module.exports = Curso;