// Importa a conexão 'db' do ficheiro de configuração
const { db } = require('../config/database-sqlite.js');

/**
 * Classe Modelo para a entidade Curso.
 * Contém métodos estáticos para interagir com a tabela Curso.
 */
class Curso {

    // (Pode adicionar outros métodos aqui, como findAll, findById, create...)

    /**
     * Obtém a contagem de matrículas (Inscricao) por curso dentro de um período.
     * Esta é a função que o IntelliJ estava a sentir falta.
     * * @param {string} dataInicio Formato 'YYYY-MM-DD'
     * @param {string} dataFim Formato 'YYYY-MM-DD'
     * @returns {Promise<Array>} Uma lista de objetos (ex: [{ nome_curso: 'Inglês', quantidade_matriculas: 10 }])
     */
    static async getMatriculasPorPeriodo(dataInicio, dataFim) {

        // Conceito-chave: Este SQL usa JOIN para "juntar" as tabelas
        // Inscricao e Curso, e GROUP BY para "agrupar" os resultados.
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
            // O db.all() executa a consulta e retorna todas as linhas
            const rows = await db.all(sql, [dataInicio, dataFim]);
            return rows;
        } catch (err) {
            console.error(err.message);
            throw new Error('Erro ao consultar estatísticas no banco de dados');
        }
    }
}

// Exporta a classe para que o 'routes/cursos.js' possa importá-la
module.exports = Curso;