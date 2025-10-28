const { executeQuery } = require('../config/database-sqlite');

class Aluno {
    static async getAll() {
        const sql = this._createGetAllSql(); // Método auxiliar para criar SQL
        return await executeQuery(sql);
    }

    static async getById(alunoId) {
        const sql = this._createGetByIdSql(); // Método auxiliar
        const result = await executeQuery(sql, [alunoId]);
        return result[0] || null; // Retorna o primeiro item ou null se não existir
    }

    static async create(alunoData) {
        const sql = this._createInsertSql(); // Reutiliza SQL para criação
        const result = await executeQuery(sql, [
            alunoData.Nome, alunoData.CPF, alunoData.Data_Nascimento, alunoData.Email,
            alunoData.Telefone, alunoData.Endereco, alunoData.Renda_Familiar,
            alunoData.Conheceu_Como, alunoData.Colaborador_Resp
        ]);
        return result.insertId; // Retorna ID do recém-criado
    }

    static async update(alunoId, alunoData) {
        const sql = this._createUpdateSql(); // Reutiliza SQL de atualização
        const result = await executeQuery(sql, [
            alunoData.Nome, alunoData.CPF, alunoData.Data_Nascimento, alunoData.Email,
            alunoData.Telefone, alunoData.Endereco, alunoData.Renda_Familiar,
            alunoData.Conheceu_Como, alunoData.Verificado, alunoData.Colaborador_Resp, alunoId
        ]);
        return result.affectedRows > 0; // Retorna verdadeiro se algo foi alterado
    }

    static async delete(alunoId) {
        const sql = 'DELETE FROM Aluno WHERE ID_Aluno = ?'; // SQL direto
        const result = await executeQuery(sql, [alunoId]);
        return result.affectedRows > 0; // Confirma exclusão
    }

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

    static async addEscolaridade(alunoId, escolaridadeData) {
        const sql = `
            INSERT INTO Escolaridade (ID_Aluno, Nivel, Instituicao, Ano_Conclusao)
            VALUES (?, ?, ?, ?)
        `;
        const result = await executeQuery(sql, [
            alunoId,
            escolaridadeData.Nivel,
            escolaridadeData.Instituicao,
            escolaridadeData.Ano_Conclusao
        ]);
        return result.insertId; // Retorna ID inserido
    }

    // Função para verificar um aluno
    static async verificar(alunoId, colaboradorId) {
        const colaboradorNome = await this._obterColaboradorNome(colaboradorId); // Extraiu função
        const sql = `
            UPDATE Aluno
            SET Verificado = 1, Colaborador_Resp = ?
            WHERE ID_Aluno = ?
        `;
        const result = await executeQuery(sql, [colaboradorNome, alunoId]);

        if (result.affectedRows > 0) {
            return { success: true, message: "Aluno verificado com sucesso.", colaboradorNome };
        }
        return { success: false, message: "Falha ao verificar o aluno." };
    }

    // Métodos auxiliares privados para criar SQLs
    static _createGetAllSql() {
        return `
            SELECT a.*, GROUP_CONCAT(e.Nivel, ', ') as Escolaridades
            FROM Aluno a
            LEFT JOIN Escolaridade e ON a.ID_Aluno = e.ID_Aluno
            GROUP BY a.ID_Aluno
            ORDER BY a.Nome
        `;
    }

    static _createGetByIdSql() {
        return `
            SELECT a.*, GROUP_CONCAT(e.Nivel, ', ') as Escolaridades
            FROM Aluno a
            LEFT JOIN Escolaridade e ON a.ID_Aluno = e.ID_Aluno
            WHERE a.ID_Aluno = ?
            GROUP BY a.ID_Aluno
        `;
    }

    static _createInsertSql() {
        return `
            INSERT INTO Aluno (Nome, CPF, Data_Nascimento, Email, Telefone, Endereco, 
            Renda_Familiar, Conheceu_Como, Colaborador_Resp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
    }

    static _createUpdateSql() {
        return `
            UPDATE Aluno 
            SET Nome = ?, CPF = ?, Data_Nascimento = ?, Email = ?, Telefone = ?, 
                Endereco = ?, Renda_Familiar = ?, Conheceu_Como = ?, Verificado = ?, 
                Colaborador_Resp = ?
            WHERE ID_Aluno = ?
        `;
    }

    static async _obterColaboradorNome(colaboradorId) {
        try {
            const sql = 'SELECT Nome FROM Colaborador WHERE ID_Colab = ?';
            const result = await executeQuery(sql, [colaboradorId]);
            return result.length > 0 ? result[0].Nome : 'Não informado';
        } catch (error) {
            console.error('Erro ao buscar colaborador:', error);
            return 'Não informado';
        }
    }
}

module.exports = Aluno;
