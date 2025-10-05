const { executeQuery } = require('../config/database');

class Colaborador {
    // Buscar todos os colaboradores
    static async getAll() {
        const sql = `
            SELECT c.*, 
                   COUNT(DISTINCT v.ID_Curso) as Cursos_Verificados,
                   COUNT(DISTINCT ip.ID_Prof) as Professores_Inscritos
            FROM Colaborador c
            LEFT JOIN Verificacao_Curso v ON c.ID_Colab = v.ID_Colab
            LEFT JOIN Inscricao_Professor ip ON c.ID_Colab = ip.ID_Colab AND ip.Status = 'Ativa'
            GROUP BY c.ID_Colab
            ORDER BY c.Nome
        `;
        return await executeQuery(sql);
    }

    // Buscar colaborador por ID
    static async getById(id) {
        const sql = `
            SELECT c.*, 
                   COUNT(DISTINCT v.ID_Curso) as Cursos_Verificados,
                   COUNT(DISTINCT ip.ID_Prof) as Professores_Inscritos
            FROM Colaborador c
            LEFT JOIN Verificacao_Curso v ON c.ID_Colab = v.ID_Colab
            LEFT JOIN Inscricao_Professor ip ON c.ID_Colab = ip.ID_Colab AND ip.Status = 'Ativa'
            WHERE c.ID_Colab = ?
            GROUP BY c.ID_Colab
        `;
        const result = await executeQuery(sql, [id]);
        return result[0] || null;
    }

    // Criar novo colaborador
    static async create(colaboradorData) {
        const { Nome, CPF, Email, Data_Admissao, Telefone, Endereco } = colaboradorData;
        
        const sql = `
            INSERT INTO Colaborador (Nome, CPF, Email, Data_Admissao, Telefone, Endereco)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const result = await executeQuery(sql, [
            Nome, CPF, Email, Data_Admissao, Telefone, Endereco
        ]);
        
        return result.insertId;
    }

    // Atualizar colaborador
    static async update(id, colaboradorData) {
        const { Nome, CPF, Email, Data_Admissao, Telefone, Endereco } = colaboradorData;
        
        const sql = `
            UPDATE Colaborador 
            SET Nome = ?, CPF = ?, Email = ?, Data_Admissao = ?, Telefone = ?, Endereco = ?
            WHERE ID_Colab = ?
        `;
        
        const result = await executeQuery(sql, [
            Nome, CPF, Email, Data_Admissao, Telefone, Endereco, id
        ]);
        
        return result.affectedRows > 0;
    }

    // Deletar colaborador
    static async delete(id) {
        const sql = 'DELETE FROM Colaborador WHERE ID_Colab = ?';
        const result = await executeQuery(sql, [id]);
        return result.affectedRows > 0;
    }

    // Buscar cursos verificados pelo colaborador
    static async getCursosVerificados(id) {
        const sql = `
            SELECT c.*, v.Data_Verificacao, v.Status as Status_Verificacao, v.Observacoes
            FROM Curso c
            INNER JOIN Verificacao_Curso v ON c.ID_Curso = v.ID_Curso
            WHERE v.ID_Colab = ?
            ORDER BY v.Data_Verificacao DESC
        `;
        return await executeQuery(sql, [id]);
    }

    // Buscar professores inscritos pelo colaborador
    static async getProfessoresInscritos(id) {
        const sql = `
            SELECT p.*, ip.Data_Inscricao, ip.Status as Status_Inscricao
            FROM Professor p
            INNER JOIN Inscricao_Professor ip ON p.ID_Prof = ip.ID_Prof
            WHERE ip.ID_Colab = ?
            ORDER BY ip.Data_Inscricao DESC
        `;
        return await executeQuery(sql, [id]);
    }

    // Verificar curso
    static async verificarCurso(colaboradorId, cursoId, status, observacoes) {
        const sql = `
            INSERT INTO Verificacao_Curso (ID_Colab, ID_Curso, Status, Observacoes)
            VALUES (?, ?, ?, ?)
        `;
        
        const result = await executeQuery(sql, [colaboradorId, cursoId, status, observacoes]);
        return result.insertId;
    }

    // Inscrever professor
    static async inscreverProfessor(colaboradorId, professorId) {
        const sql = `
            INSERT INTO Inscricao_Professor (ID_Colab, ID_Prof)
            VALUES (?, ?)
        `;
        
        const result = await executeQuery(sql, [colaboradorId, professorId]);
        return result.insertId;
    }
}

module.exports = Colaborador;
