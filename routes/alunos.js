const express = require('express');
const router = express.Router();
const Aluno = require('../models/Aluno');
const {serializeBigInt} = require("./utils");
const validarAluno = require('../middlewares/validar-aluno');



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
        
        res.json(serializeBigInt({
            success: true,
            data: aluno
        }));
    } catch (error) {
        console.error('Erro ao buscar aluno:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Rota: Criar novo aluno (POST)
router.post('/', validarAluno, async (req, res) => {
  try {
    // aqui req.body.cpf já tem 11 dígitos
    const novoAluno = await inserirAlunoNoDB(req.body); // sua função existente
    res.status(201).json({ success: true, data: novoAluno });
  } catch (err) {
    console.error('Erro ao inserir aluno:', err);
    res.status(500).json({ success: false, message: 'Erro interno ao criar aluno' });
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
        
        res.json(serializeBigInt({
            success: true,
            message: 'Aluno atualizado com sucesso'
        }));
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
        
        res.json(serializeBigInt({
            success: true,
            message: 'Aluno deletado com sucesso'
        }));
    } catch (error) {
        console.error('Erro ao deletar aluno:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// POST /api/alunos/:id/verificar - Verificar aluno
router.post('/:id/verificar', async (req, res) => {
    try {
        const { id } = req.params;
        const { colaboradorId } = req.body; // Pega o ID do colaborador do corpo da requisição

        if (!colaboradorId) {
            return res.status(400).json({
                success: false,
                message: 'ID do colaborador é obrigatório'
            });
        }

        const verified = await Aluno.verificar(id, colaboradorId);

        if (!verified) {
            return res.status(404).json({
                success: false,
                message: 'Aluno não encontrado ou erro ao verificar'
            });
        }

        res.json({
            success: true,
            message: 'Aluno verificado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao verificar aluno:', error);
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
        
        res.json(serializeBigInt({
            success: true,
            data: alunos,
            count: alunos.length
        }));
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
