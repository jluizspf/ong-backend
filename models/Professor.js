const { executeQuery } = require('../config/database-sqlite');

class Professor {
    // Buscar todos os professores
    static async getAll() {
        const sql = `
            SELECT p.*, 
                   COUNT(m.ID_Curso) as Cursos_Ministrados
            FROM Professor p
            LEFT JOIN Ministracao m ON p.ID_Prof = m.ID_Prof AND m.Status = 'Ativo'
            GROUP BY p.ID_Prof
            ORDER BY p.Nome
        `;
        return await executeQuery(sql);
    }

    // Buscar professor por ID
    static async getById(id) {
        const sql = `
            SELECT p.*, 
                   COUNT(m.ID_Curso) as Cursos_Ministrados
            FROM Professor p
            LEFT JOIN Ministracao m ON p.ID_Prof = m.ID_Prof AND m.Status = 'Ativo'
            WHERE p.ID_Prof = ?
            GROUP BY p.ID_Prof
        `;
        const result = await executeQuery(sql, [id]);
        return result[0] || null;
    }

    // Criar novo professor
    static async create(professorData) {
        const { Nome, CPF, Data_Nascimento, Email, Formacao, Endereco } = professorData;
        
        const sql = `
            INSERT INTO Professor (Nome, CPF, Data_Nascimento, Email, Formacao, Endereco)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const result = await executeQuery(sql, [
            Nome, CPF, Data_Nascimento, Email, Formacao, Endereco
        ]);
        
        return result.insertId;
    }

    // Atualizar professor
    static async update(id, professorData) {
        const { Nome, CPF, Data_Nascimento, Email, Formacao, Endereco } = professorData;
        
        const sql = `
            UPDATE Professor 
            SET Nome = ?, CPF = ?, Data_Nascimento = ?, Email = ?, Formacao = ?, Endereco = ?
            WHERE ID_Prof = ?
        `;
        
        const result = await executeQuery(sql, [
            Nome, CPF, Data_Nascimento, Email, Formacao, Endereco, id
        ]);
        
        return result.affectedRows > 0;
    }

    // Deletar professor
    static async delete(id) {
        const sql = 'DELETE FROM Professor WHERE ID_Prof = ?';
        const result = await executeQuery(sql, [id]);
        return result.affectedRows > 0;
    }

    // Buscar cursos do professor
    static async getCursos(id) {
        const sql = `
            SELECT c.*, m.Data_Inicio, m.Data_Fim, m.Status as Status_Ministracao
            FROM Curso c
            INNER JOIN Ministracao m ON c.ID_Curso = m.ID_Curso
            WHERE m.ID_Prof = ?
            ORDER BY c.Nome
        `;
        return await executeQuery(sql, [id]);
    }

    // Atribuir professor a curso
    static async atribuirCurso(professorId, cursoId, dataInicio, dataFim) {
        const sql = `
            INSERT INTO Ministracao (ID_Prof, ID_Curso, Data_Inicio, Data_Fim)
            VALUES (?, ?, ?, ?)
        `;
        
        const result = await executeQuery(sql, [professorId, cursoId, dataInicio, dataFim]);
        return result.insertId;
    }

    // Remover professor de curso
    static async removerCurso(professorId, cursoId) {
        const sql = `
            UPDATE Ministracao 
            SET Status = 'Inativo'
            WHERE ID_Prof = ? AND ID_Curso = ?
        `;
        
        const result = await executeQuery(sql, [professorId, cursoId]);
        return result.affectedRows > 0;
    }
}

module.exports = Professor;
