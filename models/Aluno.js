/* * models/Aluno.js - CORRIGIDO com 'static async findByEmail'
 */
const { executeQuery } = require('../config/database-sqlite');

class Aluno {
    
    // Buscar todos os alunos (com join)
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

    // Buscar aluno por ID (O seu código original)
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

    // --- NOVO MÉTODO (COM A SINTAXE CORRETA) ---
    // Buscar aluno por Email (para a verificação de duplicado)
    static async findByEmail(email) {
        const sql = "SELECT * FROM Aluno WHERE Email = ?";
        const params = [email];
        try {
            const result = await executeQuery(sql, params);
            return result[0]; // Retorna o primeiro encontrado ou undefined
        } catch (error) {
            console.error(`Erro ao buscar aluno por email: ${email}`, error);
            throw error;
        }
    }
    // --- FIM DO NOVO MÉTODO ---

    // Criar novo aluno
    static async create(data) {
        // Separa dados do aluno dos dados de escolaridade
        const { Escolaridade, ...alunoData } = data;
        
        const sqlAluno = "INSERT INTO Aluno (Nome, CPF, Data_Nascimento, Email, Telefone, Endereco, Renda_Familiar, Conheceu_Como, Colaborador_Resp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const paramsAluno = [
            alunoData.Nome, alunoData.CPF, alunoData.Data_Nascimento, alunoData.Email, 
            alunoData.Telefone, alunoData.Endereco, alunoData.Renda_Familiar, 
            alunoData.Conheceu_Como, alunoData.Colaborador_Resp
        ];
        
        // 'this' refere-se ao 'lastID' retornado pelo executeQuery no INSERT
        const result = await executeQuery(sqlAluno, paramsAluno);
        const alunoId = result.id; // Pega o ID do aluno recém-criado

        // Se tiver escolaridade, insere na tabela Escolaridade
        if (Escolaridade && alunoId) {
            const sqlEscolaridade = "INSERT INTO Escolaridade (ID_Aluno, Nivel) VALUES (?, ?)";
            // Assume que Escolaridade é uma string, se for array, precisa de loop
            await executeQuery(sqlEscolaridade, [alunoId, Escolaridade]);
        }
        
        return { id: alunoId };
    }

    // Atualizar aluno
    static async update(id, data) {
        const { Escolaridade, ...alunoData } = data;

        const sqlAluno = "UPDATE Aluno SET Nome = ?, CPF = ?, Data_Nascimento = ?, Email = ?, Telefone = ?, Endereco = ?, Renda_Familiar = ?, Conheceu_Como = ?, Colaborador_Resp = ? WHERE ID_Aluno = ?";
        const paramsAluno = [
            alunoData.Nome, alunoData.CPF, alunoData.Data_Nascimento, alunoData.Email, 
            alunoData.Telefone, alunoData.Endereco, alunoData.Renda_Familiar, 
            alunoData.Conheceu_Como, alunoData.Colaborador_Resp,
            id
        ];
        
        await executeQuery(sqlAluno, paramsAluno);

        // Atualiza Escolaridade (simplificado: apaga e recria)
        if (Escolaridade !== undefined) {
            await executeQuery("DELETE FROM Escolaridade WHERE ID_Aluno = ?", [id]);
            if (Escolaridade) { // Só insere se não for nulo/vazio
                await executeQuery("INSERT INTO Escolaridade (ID_Aluno, Nivel) VALUES (?, ?)", [id, Escolaridade]);
            }
        }
        
        return { id: id };
    }

    // Deletar aluno
    static async delete(id) {
        // Deleta registros associados primeiro (Escolaridade)
        await executeQuery("DELETE FROM Escolaridade WHERE ID_Aluno = ?", [id]);
        
        // Deleta o aluno
        const sql = "DELETE FROM Aluno WHERE ID_Aluno = ?";
        await executeQuery(sql, [id]);
        return { id: id };
    }
    
    // Verificar aluno (lógica do frontend)
    static async verificar(id, colaboradorId) {
        // Esta lógica pode precisar ser mais complexa
        // (ex: verificar quem verificou, data, etc.)
        const sql = "UPDATE Aluno SET Verificado = 1, Colaborador_Resp = ? WHERE ID_Aluno = ?";
        await executeQuery(sql, [colaboradorId, id]);
        return { id: id };
    }
}

module.exports = Aluno;
