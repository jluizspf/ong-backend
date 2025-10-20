const { executeQuery } = require('../config/database-sqlite');

class Aluno {
    // Buscar todos os alunos
    static async getAll() {
        const sql = `
            SELECT a.*, 
                   GROUP_CONCAT(e.Nivel, ', ') as Escolaridades
            FROM Aluno a
            LEFT JOIN Escolaridade e ON a.ID_Aluno = e.ID_Aluno
            GROUP BY a.ID_Aluno
            ORDER BY a.Nome
        `;
        return await executeQuery(sql);
    }

    // Buscar aluno por ID
    static async getById(id) {
        const sql = `
            SELECT a.*, 
                   GROUP_CONCAT(e.Nivel, ', ') as Escolaridades
            FROM Aluno a
            LEFT JOIN Escolaridade e ON a.ID_Aluno = e.ID_Aluno
            WHERE a.ID_Aluno = ?
            GROUP BY a.ID_Aluno
        `;
        const result = await executeQuery(sql, [id]);
        return result[0] || null;
    }

    // Criar novo aluno
    static async create(alunoData) {
        const { Nome, CPF, Data_Nascimento, Email, Telefone, Endereco, Renda_Familiar, Conheceu_Como, Colaborador_Resp } = alunoData;
        
        const sql = `
            INSERT INTO Aluno (Nome, CPF, Data_Nascimento, Email, Telefone, Endereco, Renda_Familiar, Conheceu_Como, Colaborador_Resp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const result = await executeQuery(sql, [
            Nome, CPF, Data_Nascimento, Email, Telefone, Endereco, Renda_Familiar, Conheceu_Como, Colaborador_Resp
        ]);
        
        return result.insertId;
    }

    // Atualizar aluno
    static async update(id, alunoData) {
        const { Nome, CPF, Data_Nascimento, Email, Telefone, Endereco, Renda_Familiar, Conheceu_Como, Verificado, Colaborador_Resp } = alunoData;
        
        const sql = `
            UPDATE Aluno 
            SET Nome = ?, CPF = ?, Data_Nascimento = ?, Email = ?, Telefone = ?, 
                Endereco = ?, Renda_Familiar = ?, Conheceu_Como = ?, Verificado = ?, Colaborador_Resp = ?
            WHERE ID_Aluno = ?
        `;
        
        const result = await executeQuery(sql, [
            Nome, CPF, Data_Nascimento, Email, Telefone, Endereco, Renda_Familiar, 
            Conheceu_Como, Verificado, Colaborador_Resp, id
        ]);
        
        return result.affectedRows > 0;
    }

    // Deletar aluno
    static async delete(id) {
        const sql = 'DELETE FROM Aluno WHERE ID_Aluno = ?';
        const result = await executeQuery(sql, [id]);
        return result.affectedRows > 0;
    }

    // Buscar alunos por curso
    static async getByCurso(cursoId) {
        const sql = `
            SELECT a.*, i.Data_Inscricao, i.Status as Status_Inscricao
            FROM Aluno a
            INNER JOIN Inscricao i ON a.ID_Aluno = i.ID_Aluno
            WHERE i.ID_Curso = ?
            ORDER BY a.Nome
        `;
        return await executeQuery(sql, [cursoId]);
    }

    // Adicionar escolaridade
    static async addEscolaridade(alunoId, escolaridadeData) {
        const { Nivel, Instituicao, Ano_Conclusao } = escolaridadeData;
        
        const sql = `
            INSERT INTO Escolaridade (ID_Aluno, Nivel, Instituicao, Ano_Conclusao)
            VALUES (?, ?, ?, ?)
        `;
        
        const result = await executeQuery(sql, [alunoId, Nivel, Instituicao, Ano_Conclusao]);
        return result.insertId;
    }
}

module.exports = Aluno;
