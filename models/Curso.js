const { executeQuery } = require('../config/database');

class Curso {
    // Buscar todos os cursos
    static async getAll() {
        const sql = `
            SELECT c.*, 
                   COUNT(i.ID_Aluno) as Alunos_Inscritos,
                   p.Nome as Nome_Professor
            FROM Curso c
            LEFT JOIN Inscricao i ON c.ID_Curso = i.ID_Curso AND i.Status = 'Ativa'
            LEFT JOIN Ministracao m ON c.ID_Curso = m.ID_Curso AND m.Status = 'Ativo'
            LEFT JOIN Professor p ON m.ID_Prof = p.ID_Prof
            GROUP BY c.ID_Curso
            ORDER BY c.Nome
        `;
        return await executeQuery(sql);
    }

    // Buscar curso por ID
    static async getById(id) {
        const sql = `
            SELECT c.*, 
                   COUNT(i.ID_Aluno) as Alunos_Inscritos,
                   p.Nome as Nome_Professor
            FROM Curso c
            LEFT JOIN Inscricao i ON c.ID_Curso = i.ID_Curso AND i.Status = 'Ativa'
            LEFT JOIN Ministracao m ON c.ID_Curso = m.ID_Curso AND m.Status = 'Ativo'
            LEFT JOIN Professor p ON m.ID_Prof = p.ID_Prof
            WHERE c.ID_Curso = ?
            GROUP BY c.ID_Curso
        `;
        const result = await executeQuery(sql, [id]);
        return result[0] || null;
    }

    // Criar novo curso
    static async create(cursoData) {
        const { Nome, Qtd_Vagas, Per_Duracao, Local, Prof_Responsavel, Horario, Colaborador_Resp } = cursoData;
        
        const sql = `
            INSERT INTO Curso (Nome, Qtd_Vagas, Per_Duracao, Local, Prof_Responsavel, Horario, Colaborador_Resp)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const result = await executeQuery(sql, [
            Nome, Qtd_Vagas, Per_Duracao, Local, Prof_Responsavel, Horario, Colaborador_Resp
        ]);
        
        return result.insertId;
    }

    // Atualizar curso
    static async update(id, cursoData) {
        const { Nome, Qtd_Vagas, Per_Duracao, Local, Prof_Responsavel, Horario, Verificado, Colaborador_Resp } = cursoData;
        
        const sql = `
            UPDATE Curso 
            SET Nome = ?, Qtd_Vagas = ?, Per_Duracao = ?, Local = ?, 
                Prof_Responsavel = ?, Horario = ?, Verificado = ?, Colaborador_Resp = ?
            WHERE ID_Curso = ?
        `;
        
        const result = await executeQuery(sql, [
            Nome, Qtd_Vagas, Per_Duracao, Local, Prof_Responsavel, Horario, 
            Verificado, Colaborador_Resp, id
        ]);
        
        return result.affectedRows > 0;
    }

    // Deletar curso
    static async delete(id) {
        const sql = 'DELETE FROM Curso WHERE ID_Curso = ?';
        const result = await executeQuery(sql, [id]);
        return result.affectedRows > 0;
    }

    // Buscar cursos verificados
    static async getVerificados() {
        const sql = `
            SELECT c.*, 
                   COUNT(i.ID_Aluno) as Alunos_Inscritos,
                   p.Nome as Nome_Professor
            FROM Curso c
            LEFT JOIN Inscricao i ON c.ID_Curso = i.ID_Curso AND i.Status = 'Ativa'
            LEFT JOIN Ministracao m ON c.ID_Curso = m.ID_Curso AND m.Status = 'Ativo'
            LEFT JOIN Professor p ON m.ID_Prof = p.ID_Prof
            WHERE c.Verificado = TRUE
            GROUP BY c.ID_Curso
            ORDER BY c.Nome
        `;
        return await executeQuery(sql);
    }

    // Verificar curso
    static async verificar(id, colaboradorId) {
        const sql = `
            UPDATE Curso 
            SET Verificado = TRUE, Colaborador_Resp = (SELECT Nome FROM Colaborador WHERE ID_Colab = ?)
            WHERE ID_Curso = ?
        `;
        
        const result = await executeQuery(sql, [colaboradorId, id]);
        
        // Registrar verificação
        if (result.affectedRows > 0) {
            const verifSql = `
                INSERT INTO Verificacao_Curso (ID_Colab, ID_Curso, Status)
                VALUES (?, ?, 'Aprovado')
            `;
            await executeQuery(verifSql, [colaboradorId, id]);
        }
        
        return result.affectedRows > 0;
    }

    // Inscrever aluno no curso
    static async inscreverAluno(alunoId, cursoId) {
        const sql = `
            INSERT INTO Inscricao (ID_Aluno, ID_Curso)
            VALUES (?, ?)
        `;
        
        const result = await executeQuery(sql, [alunoId, cursoId]);
        return result.insertId;
    }

    // Cancelar inscrição
    static async cancelarInscricao(alunoId, cursoId) {
        const sql = `
            UPDATE Inscricao 
            SET Status = 'Cancelada'
            WHERE ID_Aluno = ? AND ID_Curso = ?
        `;
        
        const result = await executeQuery(sql, [alunoId, cursoId]);
        return result.affectedRows > 0;
    }
}

module.exports = Curso;
