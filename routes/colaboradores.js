const express = require('express');
const router = express.Router();
const Colaborador = require('../models/Colaborador');
const { serializeBigInt } = require('./utils');

// GET /api/colaboradores - Buscar todos os colaboradores
router.get('/', async (req, res) => {
    try {
        const colaboradores = await Colaborador.getAll();
        res.json(serializeBigInt({
            success: true,
            data: colaboradores,
            count: colaboradores.length
        }));
    } catch (error) {
        console.error('Erro ao buscar colaboradores:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// GET /api/colaboradores/:id - Buscar colaborador por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const colaborador = await Colaborador.getById(id);
        
        if (!colaborador) {
            return res.status(404).json({
                success: false,
                message: 'Colaborador não encontrado'
            });
        }
        
        res.json({
            success: true,
            data: colaborador
        });
    } catch (error) {
        console.error('Erro ao buscar colaborador:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// POST /api/colaboradores - Criar novo colaborador
router.post('/', async (req, res) => {
    try {
        const colaboradorData = req.body;
        
        // Validações básicas
        if (!colaboradorData.Nome || !colaboradorData.CPF || !colaboradorData.Email) {
            return res.status(400).json({
                success: false,
                message: 'Nome, CPF e Email são obrigatórios'
            });
        }
        
        const colaboradorId = await Colaborador.create(colaboradorData);
        
        res.status(201).json({
            success: true,
            message: 'Colaborador criado com sucesso',
            data: { id: colaboradorId }
        });
    } catch (error) {
        console.error('Erro ao criar colaborador:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// PUT /api/colaboradores/:id - Atualizar colaborador
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const colaboradorData = req.body;
        
        const updated = await Colaborador.update(id, colaboradorData);
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Colaborador não encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Colaborador atualizado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao atualizar colaborador:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// DELETE /api/colaboradores/:id - Deletar colaborador
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const deleted = await Colaborador.delete(id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Colaborador não encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Colaborador deletado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao deletar colaborador:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// GET /api/colaboradores/:id/cursos-verificados - Buscar cursos verificados pelo colaborador
router.get('/:id/cursos-verificados', async (req, res) => {
    try {
        const { id } = req.params;
        const cursos = await Colaborador.getCursosVerificados(id);
        
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

// GET /api/colaboradores/:id/professores-inscritos - Buscar professores inscritos pelo colaborador
router.get('/:id/professores-inscritos', async (req, res) => {
    try {
        const { id } = req.params;
        const professores = await Colaborador.getProfessoresInscritos(id);
        
        res.json({
            success: true,
            data: professores,
            count: professores.length
        });
    } catch (error) {
        console.error('Erro ao buscar professores inscritos:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// POST /api/colaboradores/:id/verificar-curso - Verificar curso
router.post('/:id/verificar-curso', async (req, res) => {
    try {
        const { id } = req.params;
        const { cursoId, status, observacoes } = req.body;
        
        if (!cursoId || !status) {
            return res.status(400).json({
                success: false,
                message: 'ID do curso e status são obrigatórios'
            });
        }
        
        const verificacaoId = await Colaborador.verificarCurso(id, cursoId, status, observacoes);
        
        res.status(201).json({
            success: true,
            message: 'Curso verificado com sucesso',
            data: { id: verificacaoId }
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

// POST /api/colaboradores/:id/inscrever-professor - Inscrever professor
router.post('/:id/inscrever-professor', async (req, res) => {
    try {
        const { id } = req.params;
        const { professorId } = req.body;
        
        if (!professorId) {
            return res.status(400).json({
                success: false,
                message: 'ID do professor é obrigatório'
            });
        }
        
        const inscricaoId = await Colaborador.inscreverProfessor(id, professorId);
        
        res.status(201).json({
            success: true,
            message: 'Professor inscrito com sucesso',
            data: { id: inscricaoId }
        });
    } catch (error) {
        console.error('Erro ao inscrever professor:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

module.exports = router;
