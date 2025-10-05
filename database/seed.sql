-- Script para inserir dados de exemplo
USE ong_database;

-- Inserir Colaboradores
INSERT INTO Colaborador (Nome, CPF, Email, Data_Admissao, Telefone, Endereco) VALUES
('Maria Silva Santos', '123.456.789-01', 'maria.silva@ong.org', '2023-01-15', '(11) 99999-1111', 'Rua das Flores, 123 - São Paulo/SP'),
('João Oliveira Costa', '987.654.321-02', 'joao.costa@ong.org', '2023-02-20', '(11) 99999-2222', 'Av. Paulista, 456 - São Paulo/SP'),
('Ana Paula Ferreira', '456.789.123-03', 'ana.ferreira@ong.org', '2023-03-10', '(11) 99999-3333', 'Rua Augusta, 789 - São Paulo/SP');

-- Inserir Professores
INSERT INTO Professor (Nome, CPF, Email, Data_Nascimento, Formacao, Endereco) VALUES
('Carlos Eduardo Lima', '111.222.333-44', 'carlos.lima@professor.com', '1980-05-15', 'Mestrado em Educação', 'Rua dos Professores, 100 - São Paulo/SP'),
('Lucia Helena Martins', '555.666.777-88', 'lucia.martins@professor.com', '1975-08-22', 'Doutorado em Pedagogia', 'Av. Educadores, 200 - São Paulo/SP'),
('Roberto Carlos Silva', '999.888.777-66', 'roberto.silva@professor.com', '1985-12-03', 'Especialização em Tecnologia', 'Rua da Tecnologia, 300 - São Paulo/SP');

-- Inserir Cursos
INSERT INTO Curso (Nome, Qtd_Vagas, Per_Duracao, Local, Prof_Responsavel, Horario, Data_Registro, Verificado, Colaborador_Resp) VALUES
('Informática Básica', 30, '3 meses', 'Sede da ONG - Sala 1', 'Carlos Eduardo Lima', 'Segunda e Quarta 19:00-21:00', '2024-01-10', TRUE, 'Maria Silva Santos'),
('Inglês Iniciante', 25, '6 meses', 'Sede da ONG - Sala 2', 'Lucia Helena Martins', 'Terça e Quinta 18:00-20:00', '2024-01-15', TRUE, 'João Oliveira Costa'),
('Matemática Fundamental', 35, '4 meses', 'Sede da ONG - Sala 3', 'Roberto Carlos Silva', 'Sábado 09:00-12:00', '2024-01-20', FALSE, 'Ana Paula Ferreira');

-- Inserir Alunos
INSERT INTO Aluno (Nome, CPF, Data_Nascimento, Email, Telefone, Endereco, Renda_Familiar, Conheceu_Como, Verificado, Colaborador_Resp) VALUES
('Pedro Henrique Santos', '123.456.789-10', '1995-03-15', 'pedro.santos@email.com', '(11) 88888-1111', 'Rua A, 100 - São Paulo/SP', 1500.00, 'Internet', TRUE, 'Maria Silva Santos'),
('Juliana Costa Lima', '987.654.321-20', '1998-07-22', 'juliana.lima@email.com', '(11) 88888-2222', 'Rua B, 200 - São Paulo/SP', 2000.00, 'Indicação', TRUE, 'João Oliveira Costa'),
('Marcos Antonio Silva', '456.789.123-30', '1992-11-08', 'marcos.silva@email.com', '(11) 88888-3333', 'Rua C, 300 - São Paulo/SP', 1200.00, 'Panfleto', FALSE, 'Ana Paula Ferreira');

-- Inserir Escolaridade
INSERT INTO Escolaridade (ID_Aluno, Nivel, Instituicao, Ano_Conclusao) VALUES
(1, 'Ensino Médio', 'Escola Estadual São Paulo', 2013),
(2, 'Ensino Superior Incompleto', 'Universidade de São Paulo', 2020),
(3, 'Ensino Médio', 'Escola Municipal Centro', 2010);

-- Inserir Inscrições
INSERT INTO Inscricao (ID_Aluno, ID_Curso, Data_Inscricao, Status) VALUES
(1, 1, '2024-01-15', 'Ativa'),
(2, 1, '2024-01-16', 'Ativa'),
(3, 2, '2024-01-20', 'Ativa'),
(1, 3, '2024-01-25', 'Ativa');

-- Inserir Verificações de Curso
INSERT INTO Verificacao_Curso (ID_Colab, ID_Curso, Data_Verificacao, Status, Observacoes) VALUES
(1, 1, '2024-01-12', 'Aprovado', 'Curso aprovado para início'),
(2, 2, '2024-01-18', 'Aprovado', 'Curso aprovado com ressalvas'),
(3, 3, '2024-01-25', 'Pendente', 'Aguardando documentação');

-- Inserir Ministrações
INSERT INTO Ministracao (ID_Prof, ID_Curso, Data_Inicio, Data_Fim, Status) VALUES
(1, 1, '2024-02-01', '2024-05-01', 'Ativo'),
(2, 2, '2024-02-15', '2024-08-15', 'Ativo'),
(3, 3, '2024-03-01', '2024-07-01', 'Ativo');

-- Inserir Inscrições de Professores
INSERT INTO Inscricao_Professor (ID_Colab, ID_Prof, Data_Inscricao, Status) VALUES
(1, 1, '2024-01-05', 'Ativa'),
(2, 2, '2024-01-10', 'Ativa'),
(3, 3, '2024-01-15', 'Ativa');
