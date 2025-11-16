const express = require('express');
const router = express.Router();
const Curso = require('../models/Curso');
const { handleError } = require('./utils');
const { serializeBigInt } = require('./utils');


// Dentro de routes/cursos.js, adicione esta nova rota:
// (Não se esqueça de importar o 'handleError' e o 'Curso' no topo do ficheiro)

router.get('/stats/matriculas-por-curso', async (req, res) => {
    try {
        const { data_inicio, data_fim } = req.query; // Ex: ?data_inicio=2025-01-01&data_fim=2025-12-31

        if (!data_inicio || !data_fim) {
            return res.status(400).json({
                success: false,
                message: "Datas de início e fim são obrigatórias."
            });
        }

        // 3. Chamar a nova função no Model (que vamos criar a seguir)
        const stats = await Curso.getMatriculasPorPeriodo(data_inicio, data_fim);

        res.json({ success: true, data: stats });

    } catch (error) {
        handleError(res, error, 'Erro ao buscar estatísticas de matrículas');
    }
});


// GET /api/cursos - Buscar todos os cursos
router.get('/', async (req, res) => {
    try {
        const cursos = await Curso.getAll();
        res.json(serializeBigInt({
            success: true,
            data: cursos,
            count: cursos.length
        }));
    } catch (error) {
        console.error('Erro ao buscar cursos:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// GET /api/cursos/:id - Buscar curso por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const curso = await Curso.getById(id);
        
        if (!curso) {
            return res.status(404).json({
                success: false,
                message: 'Curso não encontrado'
            });
        }
        
        res.json({
            success: true,
            data: curso
        });
    } catch (error) {
        console.error('Erro ao buscar curso:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// POST /api/cursos - Criar novo curso
router.post('/', async (req, res) => {
    try {
        const cursoData = req.body;
        
        // Validações básicas
        if (!cursoData.Nome || !cursoData.Qtd_Vagas) {
            return res.status(400).json({
                success: false,
                message: 'Nome e quantidade de vagas são obrigatórios'
            });
        }
        
        const cursoId = await Curso.create(cursoData);
        
        res.status(201).json({
            success: true,
            message: 'Curso criado com sucesso',
            data: { id: cursoId }
        });
    } catch (error) {
        console.error('Erro ao criar curso:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// PUT /api/cursos/:id - Atualizar curso
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cursoData = req.body;
        
        const updated = await Curso.update(id, cursoData);
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Curso não encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Curso atualizado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao atualizar curso:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// DELETE /api/cursos/:id - Deletar curso
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const deleted = await Curso.delete(id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Curso não encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Curso deletado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao deletar curso:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// GET /api/cursos/verificados - Buscar cursos verificados
router.get('/verificados/todos', async (req, res) => {
    try {
        const cursos = await Curso.getVerificados();
        res.json({
            success: true,
            data: cursos,
            count: cursos.length
        });
    } catch (error) {
        console.error('Erro ao buscar cursos verificados:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// POST /api/cursos/:id/verificar - Verificar curso
router.post('/:id/verificar', async (req, res) => {
    try {
        const { id } = req.params;
        const { colaboradorId } = req.body;
        
        if (!colaboradorId) {
            return res.status(400).json({
                success: false,
                message: 'ID do colaborador é obrigatório'
            });
        }
        
        const verified = await Curso.verificar(id, colaboradorId);
        
        if (!verified) {
            return res.status(404).json({
                success: false,
                message: 'Curso não encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Curso verificado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao verificar curso:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// POST /api/cursos/:id/inscrever - Inscrever aluno no curso
router.post('/:id/inscrever', async (req, res) => {
    try {
        const { id } = req.params;
        const { alunoId } = req.body;
        
        if (!alunoId) {
            return res.status(400).json({
                success: false,
                message: 'ID do aluno é obrigatório'
            });
        }
        
        const inscricaoId = await Curso.inscreverAluno(alunoId, id);
        
        res.status(201).json({
            success: true,
            message: 'Aluno inscrito com sucesso',
            data: { id: inscricaoId }
        });
    } catch (error) {
        console.error('Erro ao inscrever aluno:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// DELETE /api/cursos/:id/cancelar-inscricao - Cancelar inscrição
router.delete('/:id/cancelar-inscricao', async (req, res) => {
    try {
        const { id } = req.params;
        const { alunoId } = req.body;
        
        if (!alunoId) {
            return res.status(400).json({
                success: false,
                message: 'ID do aluno é obrigatório'
            });
        }
        
        const cancelled = await Curso.cancelarInscricao(alunoId, id);
        
        if (!cancelled) {
            return res.status(404).json({
                success: false,
                message: 'Inscrição não encontrada'
            });
        }
        
        res.json({
            success: true,
            message: 'Inscrição cancelada com sucesso'
        });
    } catch (error) {
        console.error('Erro ao cancelar inscrição:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

module.exports = router;
