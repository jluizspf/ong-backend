const express = require('express');
const router = express.Router();
const Professor = require('../models/Professor');

// GET /api/professores - Buscar todos os professores
router.get('/', async (req, res) => {
    try {
        const professores = await Professor.getAll();
        res.json({
            success: true,
            data: professores,
            count: professores.length
        });
    } catch (error) {
        console.error('Erro ao buscar professores:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// GET /api/professores/:id - Buscar professor por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const professor = await Professor.getById(id);
        
        if (!professor) {
            return res.status(404).json({
                success: false,
                message: 'Professor não encontrado'
            });
        }
        
        res.json({
            success: true,
            data: professor
        });
    } catch (error) {
        console.error('Erro ao buscar professor:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// POST /api/professores - Criar novo professor
router.post('/', async (req, res) => {
    try {
        const professorData = req.body;
        
        // Validações básicas
        if (!professorData.Nome || !professorData.CPF) {
            return res.status(400).json({
                success: false,
                message: 'Nome e CPF são obrigatórios'
            });
        }
        
        const professorId = await Professor.create(professorData);
        
        res.status(201).json({
            success: true,
            message: 'Professor criado com sucesso',
            data: { id: professorId }
        });
    } catch (error) {
        console.error('Erro ao criar professor:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// PUT /api/professores/:id - Atualizar professor
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const professorData = req.body;
        
        const updated = await Professor.update(id, professorData);
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Professor não encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Professor atualizado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao atualizar professor:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// DELETE /api/professores/:id - Deletar professor
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const deleted = await Professor.delete(id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Professor não encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Professor deletado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao deletar professor:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// GET /api/professores/:id/cursos - Buscar cursos do professor
router.get('/:id/cursos', async (req, res) => {
    try {
        const { id } = req.params;
        const cursos = await Professor.getCursos(id);
        
        res.json({
            success: true,
            data: cursos,
            count: cursos.length
        });
    } catch (error) {
        console.error('Erro ao buscar cursos do professor:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// POST /api/professores/:id/atribuir-curso - Atribuir professor a curso
router.post('/:id/atribuir-curso', async (req, res) => {
    try {
        const { id } = req.params;
        const { cursoId, dataInicio, dataFim } = req.body;
        
        if (!cursoId) {
            return res.status(400).json({
                success: false,
                message: 'ID do curso é obrigatório'
            });
        }
        
        const ministracaoId = await Professor.atribuirCurso(id, cursoId, dataInicio, dataFim);
        
        res.status(201).json({
            success: true,
            message: 'Professor atribuído ao curso com sucesso',
            data: { id: ministracaoId }
        });
    } catch (error) {
        console.error('Erro ao atribuir professor ao curso:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// DELETE /api/professores/:id/remover-curso - Remover professor de curso
router.delete('/:id/remover-curso', async (req, res) => {
    try {
        const { id } = req.params;
        const { cursoId } = req.body;
        
        if (!cursoId) {
            return res.status(400).json({
                success: false,
                message: 'ID do curso é obrigatório'
            });
        }
        
        const removed = await Professor.removerCurso(id, cursoId);
        
        if (!removed) {
            return res.status(404).json({
                success: false,
                message: 'Atribuição não encontrada'
            });
        }
        
        res.json({
            success: true,
            message: 'Professor removido do curso com sucesso'
        });
    } catch (error) {
        console.error('Erro ao remover professor do curso:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

module.exports = router;
