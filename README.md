# 🏫 Sistema de Gestão da ONG

Sistema completo para gerenciar alunos, cursos, professores e colaboradores de uma ONG.

## 🚀 Tecnologias Utilizadas

- **Backend:** Node.js + Express
- **Banco de Dados:** SQLite
- **Frontend:** React
- **API:** RESTful

## 📋 Funcionalidades

- ✅ Gerenciamento de Alunos
- ✅ Gerenciamento de Cursos
- ✅ Gerenciamento de Professores
- ✅ Gerenciamento de Colaboradores
- ✅ Dashboard com estatísticas
- ✅ Interface responsiva

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/ong-backend.git
cd ong-backend
```

### 2. Instalar dependências

```bash
# Backend
npm install

# Frontend
cd frontend
npm install
cd ..
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DB_TYPE=sqlite
DB_PATH=./database/ong_database.db
PORT=3000
NODE_ENV=development
```

### 4. Executar o projeto

```bash
# Terminal 1 - Backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

### 5. Acessar o sistema

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3000/api
- **Health Check:** http://localhost:3000/health

## 📁 Estrutura do Projeto

```
ong-backend/
├── config/
│   └── database-sqlite.js    # Configuração do banco SQLite
├── database/
│   └── ong_database.db       # Arquivo do banco SQLite
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   └── App.js           # App principal
│   └── package.json
├── models/                   # Modelos de dados
├── routes/                   # Rotas da API
├── server.js                # Servidor principal
└── package.json
```

## 🔧 Scripts Disponíveis

```bash
# Backend
npm start          # Iniciar servidor
npm run dev        # Modo desenvolvimento (nodemon)

# Frontend
cd frontend
npm start          # Iniciar React
npm run build      # Build para produção
```

## 📊 API Endpoints

### Alunos
- `GET /api/alunos` - Listar todos os alunos
- `POST /api/alunos` - Criar novo aluno
- `PUT /api/alunos/:id` - Atualizar aluno
- `DELETE /api/alunos/:id` - Deletar aluno

### Cursos
- `GET /api/cursos` - Listar todos os cursos
- `POST /api/cursos` - Criar novo curso
- `PUT /api/cursos/:id` - Atualizar curso
- `DELETE /api/cursos/:id` - Deletar curso

### Professores
- `GET /api/professores` - Listar todos os professores
- `POST /api/professores` - Criar novo professor
- `PUT /api/professores/:id` - Atualizar professor
- `DELETE /api/professores/:id` - Deletar professor

### Colaboradores
- `GET /api/colaboradores` - Listar todos os colaboradores
- `POST /api/colaboradores` - Criar novo colaborador
- `PUT /api/colaboradores/:id` - Atualizar colaborador
- `DELETE /api/colaboradores/:id` - Deletar colaborador

## 🗄️ Banco de Dados

O sistema utiliza SQLite como banco de dados, que é criado automaticamente na primeira execução. O arquivo do banco fica em `database/ong_database.db`.

### Tabelas Principais

- **Aluno** - Dados dos alunos
- **Curso** - Cursos oferecidos
- **Professor** - Professores
- **Colaborador** - Colaboradores da ONG
- **Escolaridade** - Escolaridade dos alunos
- **Inscricao** - Inscrições de alunos em cursos

## 🚀 Deploy

### Opção 1: Heroku

1. Instalar Heroku CLI
2. `heroku create ong-sistema`
3. `git push heroku main`

### Opção 2: Vercel

1. Conectar repositório no Vercel
2. Configurar build settings
3. Deploy automático

### Opção 3: VPS/Cloud

1. Configurar servidor
2. Instalar Node.js
3. Clonar repositório
4. Configurar PM2 para produção

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- **Seu Nome** - *Desenvolvimento inicial* - [seu-github](https://github.com/seu-usuario)

## 📞 Suporte

Para suporte, envie um email para seu-email@exemplo.com ou abra uma issue no GitHub.