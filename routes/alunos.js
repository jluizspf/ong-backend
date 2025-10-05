const express = require('express');
const router = express.Router();
const Aluno = require('../models/Aluno');

// GET /api/alunos - Buscar todos os alunos
router.get('/', async (req, res) => {
    try {
        const alunos = await Aluno.getAll();
        res.json({
            success: true,
            data: alunos,
            count: alunos.length
        });
    } catch (error) {
        console.error('Erro ao buscar alunos:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// GET /api/alunos/:id - Buscar aluno por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const aluno = await Aluno.getById(id);
        
        if (!aluno) {
            return res.status(404).json({
                success: false,
                message: 'Aluno não encontrado'
            });
        }
        
        res.json({
            success: true,
            data: aluno
        });
    } catch (error) {
        console.error('Erro ao buscar aluno:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// POST /api/alunos - Criar novo aluno
router.post('/', async (req, res) => {
    try {
        const alunoData = req.body;
        
        // Validações básicas
        if (!alunoData.Nome || !alunoData.CPF) {
            return res.status(400).json({
                success: false,
                message: 'Nome e CPF são obrigatórios'
            });
        }
        
        const alunoId = await Aluno.create(alunoData);
        
        res.status(201).json({
            success: true,
            message: 'Aluno criado com sucesso',
            data: { id: alunoId }
        });
    } catch (error) {
        console.error('Erro ao criar aluno:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// PUT /api/alunos/:id - Atualizar aluno
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const alunoData = req.body;
        
        const updated = await Aluno.update(id, alunoData);
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Aluno não encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Aluno atualizado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao atualizar aluno:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// DELETE /api/alunos/:id - Deletar aluno
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const deleted = await Aluno.delete(id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Aluno não encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Aluno deletado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao deletar aluno:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// GET /api/alunos/curso/:cursoId - Buscar alunos por curso
router.get('/curso/:cursoId', async (req, res) => {
    try {
        const { cursoId } = req.params;
        const alunos = await Aluno.getByCurso(cursoId);
        
        res.json({
            success: true,
            data: alunos,
            count: alunos.length
        });
    } catch (error) {
        console.error('Erro ao buscar alunos do curso:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// POST /api/alunos/:id/escolaridade - Adicionar escolaridade
router.post('/:id/escolaridade', async (req, res) => {
    try {
        const { id } = req.params;
        const escolaridadeData = req.body;
        
        const escolaridadeId = await Aluno.addEscolaridade(id, escolaridadeData);
        
        res.status(201).json({
            success: true,
            message: 'Escolaridade adicionada com sucesso',
            data: { id: escolaridadeId }
        });
    } catch (error) {
        console.error('Erro ao adicionar escolaridade:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

module.exports = router;
