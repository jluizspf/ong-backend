8# 🏫 Sistema de Gestão da ONG

Sistema completo para gerenciar alunos, cursos, professores e colaboradores de uma ONG educacional.

## 📋 Visão Geral

Este sistema foi desenvolvido com base em um ERD (Entity-Relationship Diagram) e implementa:

- **Backend**: API REST em Node.js com Express e MariaDB
- **Frontend**: Interface React moderna e responsiva
- **Banco de Dados**: MariaDB com schema baseado no ERD fornecido
- **Deploy**: Configurado para Google Cloud Platform

## 🏗️ Arquitetura

### Entidades Principais
- **Alunos**: Gestão de estudantes com informações pessoais e acadêmicas
- **Cursos**: Controle de cursos, vagas e horários
- **Professores**: Cadastro e atribuição de professores aos cursos
- **Colaboradores**: Equipe administrativa responsável por verificações

### Relacionamentos
- Alunos se inscrevem em Cursos (M:N)
- Colaboradores verificam Cursos (M:N)
- Professores ministram Cursos (M:N)
- Colaboradores inscrevem Professores (M:N)

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MariaDB** - Banco de dados relacional
- **mariadb** - Driver para MariaDB
- **CORS** - Middleware para requisições cross-origin
- **dotenv** - Gerenciamento de variáveis de ambiente

### Frontend
- **React 18** - Biblioteca para interface de usuário
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **CSS3** - Estilização moderna e responsiva

## 📁 Estrutura do Projeto

```
ong-backend/
├── config/
│   └── database.js          # Configuração do banco
├── models/
│   ├── Aluno.js             # Modelo de Aluno
│   ├── Curso.js             # Modelo de Curso
│   ├── Professor.js         # Modelo de Professor
│   └── Colaborador.js       # Modelo de Colaborador
├── routes/
│   ├── alunos.js            # Rotas de Alunos
│   ├── cursos.js            # Rotas de Cursos
│   ├── professores.js       # Rotas de Professores
│   └── colaboradores.js     # Rotas de Colaboradores
├── database/
│   ├── schema.sql           # Script de criação do banco
│   └── seed.sql             # Dados de exemplo
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   └── App.js           # Aplicação principal
│   └── package.json
├── server.js                # Servidor principal
├── package.json
└── README.md
```

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js (versão 16 ou superior)
- MariaDB (versão 10.3 ou superior)
- Git

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/ong-backend.git
cd ong-backend
```

### 2. Instale as dependências do backend
```bash
npm install
```

### 3. Configure o banco de dados
```bash
# Crie o banco de dados MariaDB
mysql -u root -p < database/schema.sql

# Insira dados de exemplo (opcional)
mysql -u root -p ong_database < database/seed.sql
```

### 4. Configure as variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp env.example .env

# Edite o arquivo .env com suas configurações
DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=ong_database
PORT=3000
NODE_ENV=development
```

### 5. Instale as dependências do frontend
```bash
cd frontend
npm install
cd ..
```

### 6. Execute o projeto
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## 🌐 Acesso ao Sistema

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

## 📚 API Endpoints

### Alunos
- `GET /api/alunos` - Listar todos os alunos
- `GET /api/alunos/:id` - Buscar aluno por ID
- `POST /api/alunos` - Criar novo aluno
- `PUT /api/alunos/:id` - Atualizar aluno
- `DELETE /api/alunos/:id` - Deletar aluno

### Cursos
- `GET /api/cursos` - Listar todos os cursos
- `GET /api/cursos/:id` - Buscar curso por ID
- `POST /api/cursos` - Criar novo curso
- `PUT /api/cursos/:id` - Atualizar curso
- `DELETE /api/cursos/:id` - Deletar curso
- `POST /api/cursos/:id/verificar` - Verificar curso

### Professores
- `GET /api/professores` - Listar todos os professores
- `GET /api/professores/:id` - Buscar professor por ID
- `POST /api/professores` - Criar novo professor
- `PUT /api/professores/:id` - Atualizar professor
- `DELETE /api/professores/:id` - Deletar professor

### Colaboradores
- `GET /api/colaboradores` - Listar todos os colaboradores
- `GET /api/colaboradores/:id` - Buscar colaborador por ID
- `POST /api/colaboradores` - Criar novo colaborador
- `PUT /api/colaboradores/:id` - Atualizar colaborador
- `DELETE /api/colaboradores/:id` - Deletar colaborador

## 🚀 Deploy na Google Cloud Platform

### 1. Configurar Google Cloud
```bash
# Instale o Google Cloud SDK
# Configure sua conta
gcloud auth login
gcloud config set project SEU_PROJECT_ID
```

### 2. Criar instância de máquina virtual
```bash
# Criar VM
gcloud compute instances create ong-server \
    --zone=us-central1-a \
    --machine-type=e2-medium \
    --image-family=ubuntu-2004-lts \
    --image-project=ubuntu-os-cloud \
    --boot-disk-size=20GB
```

### 3. Configurar servidor
```bash
# Conectar à VM
gcloud compute ssh ong-server --zone=us-central1-a

# Instalar dependências
sudo apt update
sudo apt install -y nodejs npm mariadb-server git

# Configurar MariaDB
sudo mysql_secure_installation
```

### 4. Deploy da aplicação
```bash
# Clonar repositório
git clone https://github.com/seu-usuario/ong-backend.git
cd ong-backend

# Instalar dependências
npm install
cd frontend && npm install && cd ..

# Configurar banco
mysql -u root -p < database/schema.sql

# Executar aplicação
npm start
```

## 📊 Funcionalidades

### Dashboard
- Visão geral com estatísticas
- Contadores de entidades
- Status do sistema

### Gestão de Alunos
- Cadastro completo com informações pessoais
- Controle de escolaridade
- Gestão de renda familiar
- Verificação de dados

### Gestão de Cursos
- Criação e edição de cursos
- Controle de vagas e inscrições
- Verificação por colaboradores
- Atribuição de professores

### Gestão de Professores
- Cadastro de professores
- Controle de formação acadêmica
- Atribuição a cursos
- Histórico de ministrações

### Gestão de Colaboradores
- Cadastro da equipe administrativa
- Controle de verificações
- Gestão de responsabilidades

## 🔧 Desenvolvimento

### Scripts Disponíveis
```bash
# Backend
npm start          # Executar em produção
npm run dev        # Executar em desenvolvimento

# Frontend
cd frontend
npm start          # Executar React
npm run build      # Build para produção
```

### Estrutura do Banco
O banco de dados segue exatamente o ERD fornecido com:
- Tabelas principais para cada entidade
- Tabelas de relacionamento para associações M:N
- Índices para otimização de performance
- Constraints de integridade referencial

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.


## 🎯 Roadmap

- [ ] Sistema de autenticação
- [ ] Relatórios avançados
- [ ] Notificações por email
- [ ] API de integração
- [ ] App mobile
- [ ] Sistema de backup automático

---

**Desenvolvido com ❤️ para ONGs educacionais**
