-- Script para criar o banco de dados da ONG
-- Baseado no ERD fornecido

-- Criar o banco de dados
CREATE DATABASE IF NOT EXISTS ong_database;
USE ong_database;

-- Tabela: Colaborador
CREATE TABLE Colaborador (
    ID_Colab INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    CPF VARCHAR(14) UNIQUE NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Data_Admissao DATE NOT NULL,
    Telefone VARCHAR(20),
    Endereco TEXT
);

-- Tabela: Professor
CREATE TABLE Professor (
    ID_Prof INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    CPF VARCHAR(14) UNIQUE NOT NULL,
    Data_Nascimento DATE,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Formacao VARCHAR(255),
    Endereco TEXT
);

-- Tabela: Curso
CREATE TABLE Curso (
    ID_Curso INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    Qtd_Vagas INT NOT NULL,
    Per_Duracao VARCHAR(100),
    Local VARCHAR(255),
    Prof_Responsavel VARCHAR(255),
    Horario VARCHAR(100),
    Data_Registro DATE DEFAULT CURRENT_DATE,
    Verificado BOOLEAN DEFAULT FALSE,
    Colaborador_Resp VARCHAR(255)
);

-- Tabela: Aluno
CREATE TABLE Aluno (
    ID_Aluno INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    CPF VARCHAR(14) UNIQUE NOT NULL,
    Data_Nascimento DATE,
    Email VARCHAR(255) UNIQUE,
    Telefone VARCHAR(20),
    Endereco TEXT,
    Renda_Familiar DECIMAL(10,2),
    Conheceu_Como VARCHAR(255),
    Verificado BOOLEAN DEFAULT FALSE,
    Colaborador_Resp VARCHAR(255)
);

-- Tabela: Escolaridade (para o atributo multivalorado)
CREATE TABLE Escolaridade (
    ID_Escolaridade INT AUTO_INCREMENT PRIMARY KEY,
    ID_Aluno INT,
    Nivel VARCHAR(100) NOT NULL,
    Instituicao VARCHAR(255),
    Ano_Conclusao YEAR,
    FOREIGN KEY (ID_Aluno) REFERENCES Aluno(ID_Aluno) ON DELETE CASCADE
);

-- Tabela de relacionamento: Aluno se inscreve em Curso
CREATE TABLE Inscricao (
    ID_Inscricao INT AUTO_INCREMENT PRIMARY KEY,
    ID_Aluno INT,
    ID_Curso INT,
    Data_Inscricao DATE DEFAULT CURRENT_DATE,
    Status ENUM('Ativa', 'Cancelada', 'Concluida') DEFAULT 'Ativa',
    FOREIGN KEY (ID_Aluno) REFERENCES Aluno(ID_Aluno) ON DELETE CASCADE,
    FOREIGN KEY (ID_Curso) REFERENCES Curso(ID_Curso) ON DELETE CASCADE,
    UNIQUE KEY unique_inscricao (ID_Aluno, ID_Curso)
);

-- Tabela de relacionamento: Colaborador verifica Curso
CREATE TABLE Verificacao_Curso (
    ID_Verificacao INT AUTO_INCREMENT PRIMARY KEY,
    ID_Colab INT,
    ID_Curso INT,
    Data_Verificacao DATE DEFAULT CURRENT_DATE,
    Status ENUM('Aprovado', 'Rejeitado', 'Pendente') DEFAULT 'Pendente',
    Observacoes TEXT,
    FOREIGN KEY (ID_Colab) REFERENCES Colaborador(ID_Colab) ON DELETE CASCADE,
    FOREIGN KEY (ID_Curso) REFERENCES Curso(ID_Curso) ON DELETE CASCADE
);

-- Tabela de relacionamento: Professor ministra Curso
CREATE TABLE Ministracao (
    ID_Ministracao INT AUTO_INCREMENT PRIMARY KEY,
    ID_Prof INT,
    ID_Curso INT,
    Data_Inicio DATE,
    Data_Fim DATE,
    Status ENUM('Ativo', 'Inativo', 'Concluido') DEFAULT 'Ativo',
    FOREIGN KEY (ID_Prof) REFERENCES Professor(ID_Prof) ON DELETE CASCADE,
    FOREIGN KEY (ID_Curso) REFERENCES Curso(ID_Curso) ON DELETE CASCADE
);

-- Tabela de relacionamento: Colaborador inscreve Professor
CREATE TABLE Inscricao_Professor (
    ID_Inscricao_Prof INT AUTO_INCREMENT PRIMARY KEY,
    ID_Colab INT,
    ID_Prof INT,
    Data_Inscricao DATE DEFAULT CURRENT_DATE,
    Status ENUM('Ativa', 'Cancelada', 'Concluida') DEFAULT 'Ativa',
    FOREIGN KEY (ID_Colab) REFERENCES Colaborador(ID_Colab) ON DELETE CASCADE,
    FOREIGN KEY (ID_Prof) REFERENCES Professor(ID_Prof) ON DELETE CASCADE
);

-- Índices para melhorar performance
CREATE INDEX idx_aluno_cpf ON Aluno(CPF);
CREATE INDEX idx_professor_cpf ON Professor(CPF);
CREATE INDEX idx_colaborador_cpf ON Colaborador(CPF);
CREATE INDEX idx_curso_nome ON Curso(Nome);
CREATE INDEX idx_inscricao_aluno ON Inscricao(ID_Aluno);
CREATE INDEX idx_inscricao_curso ON Inscricao(ID_Curso);
