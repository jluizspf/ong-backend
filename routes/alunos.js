const express = require('express');
const router = express.Router();
const Aluno = require('../models/Aluno');
const {serializeBigInt} = require("./utils");

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
router.post('/', async (req, res) => {
    try {
        const { Email, CPF } = req.body;

        // --- ETAPA 1: Sua verificação (MELHORADA) ---

        // 1a. Verificar se o E-mail já existe
        if (Email) {
            const emailExistente = await Aluno.findByEmail(Email);
            if (emailExistente) {
                return res.status(409).json({ // 409 Conflict
                    success: false,
                    message: 'Erro: O E-mail fornecido já está cadastrado.'
                });
            }
        }

        // 1b. Verificar se o CPF já existe
        if (CPF) {
            // (Precisamos assumir que você tem Aluno.findByCPF no seu models/Aluno.js)
            // Se não tiver, esta é uma boa altura para o criar!
            // Por agora, vamos deixar o try...catch tratar disto.
            // Se tiver o findByCPF, descomente o bloco abaixo.
            /*
            const cpfExistente = await Aluno.findByCPF(CPF); 
            if (cpfExistente) {
                return res.status(409).json({ // 409 Conflict
                    success: false,
                    message: 'Erro: O CPF fornecido já está cadastrado.'
                });
            }
            */
        }

        // --- ETAPA 2: Criar o Aluno (Se tudo passou) ---
        // O Aluno.create vai tentar inserir.
        // Se o CPF for duplicado (e não o verificámos acima),
        // o try...catch abaixo vai apanhar o erro SQLITE_CONSTRAINT.
        
        const novoAlunoId = await Aluno.create(req.body);
        
        res.status(201).json({ 
            success: true, 
            message: 'Aluno criado com sucesso!', 
            data: { id: novoAlunoId } 
        });
    
    } catch (error) {
        // --- ETAPA 3: Apanhar erros (O mais importante!) ---

        // Verifica se o erro é o SQLITE_CONSTRAINT (de CPF ou Email)
        if (error.code === 'SQLITE_CONSTRAINT') {
            let campoFalha = 'CPF ou E-mail';
            if (error.message.includes('CPF')) campoFalha = 'CPF';
            if (error.message.includes('Email')) campoFalha = 'E-mail';
            
            return res.status(409).json({ // 409 Conflict
                success: false, 
                message: `Erro: ${campoFalha} já cadastrado no sistema.` 
            });
        }
        
        // Se for outro erro qualquer
        console.error("Erro inesperado ao criar aluno:", error); // Log para o PM2
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno no servidor ao criar aluno.', 
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
