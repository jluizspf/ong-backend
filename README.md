# Sistema de Gestão - ONG "Moradia e Cidadania"

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=for-the-badge&logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-4.x-lightgrey?style=for-the-badge&logo=express)
![React](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)
![SQLite](https://img.shields.io/badge/SQLite-3-blue?style=for-the-badge&logo=sqlite)
![Nginx](https://img.shields.io/badge/Nginx-1.x-brightgreen?style=for-the-badge&logo=nginx)
![PM2](https://img.shields.io/badge/PM2-5.x-darkgreen?style=for-the-badge&logo=pm2)

Este repositório contém o código para um sistema de gestão completo para a ONG "Moradia e Cidadania". O sistema é desenhado para gerir alunos, cursos, professores e colaboradores, facilitando a administração da organização.

O projeto é composto por três componentes principais:
1.  **API RESTful (Backend):** Um servidor **Node.js/Express** que fornece endpoints para todas as operações de CRUD (Criar, Ler, Atualizar, Apagar).
2.  **Painel Administrativo (Frontend):** Uma interface de gestão interna construída em **React** (localizada na pasta `/frontend`).
3.  **Página de Matrícula (Frontend Estático):** Um formulário **HTML/CSS/JS** simples para a inscrição pública de novos alunos.

---

## Arquitetura de Produção

Este projeto está configurado para ser hospedado numa **Máquina Virtual (VM)** (ex: Google Cloud Platform), utilizando uma arquitetura robusta com **Nginx** e **PM2**.

* **Nginx** atua como **Proxy Reverso**. Ele recebe todo o tráfego na porta 80 (HTTP) e o distribui:
    * Requisições para a raiz (`/`) são servidas pelo painel de administrador React (pasta `/frontend/build`).
    * Requisições para (`/matricula`) são servidas pela página HTML estática.
    * Requisições para (`/api/*`) são encaminhadas para a API Node.js.
* **PM2** atua como **Gestor de Processos** para a API Node.js, garantindo que ela permaneça online e reinicie automaticamente em caso de falhas.

---

## Tecnologias Utilizadas

#### Backend
* **Node.js**: Ambiente de execução JavaScript.
* **Express.js**: Framework para a construção da API RESTful.
* **SQLite3**: Banco de dados relacional baseado em ficheiro (`ong.db`). Substitui a implementação original de MySQL/Sequelize para maior simplicidade e portabilidade.
* **CORS**: Middleware para habilitar o acesso de diferentes domínios.

#### Frontend
* **React**: Biblioteca para construir o painel de administrador (SPA - Single Page Application).
* **HTML5 / CSS / JS**: Para a página pública de matrícula.

#### Infraestrutura (Deploy)
* **Google Cloud Platform**: Hospedagem da Máquina Virtual (VM) Linux.
* **Nginx**: Servidor web e proxy reverso.
* **PM2**: Gestor de processos para o Node.js em produção.

---

## Instalação e Setup (Desenvolvimento Local)

Siga estes passos para configurar o ambiente de desenvolvimento na sua máquina.

### 1. Backend (API)

```bash
# 1. Clone o repositório
git clone [https://github.com/jluizspf/ong-backend.git](https://github.com/jluizspf/ong-backend.git)
cd ong-backend

# 2. Instale as dependências do Node.js
npm install

# 3. Configure o Banco de Dados (SQLite)
# (Não é necessário instalar um servidor de BD)

# 3a. Entre na pasta do banco de dados
cd database

# 3b. Crie o ficheiro ong.db e popule as tabelas usando o schema.sql
sqlite3 ong.db < schema.sql

# 3c. (Opcional) Popule o banco com dados de exemplo
sqlite3 ong.db < seed.sql

# 3d. Volte para a raiz do backend
cd ..
````

### 2\. Frontend (Painel Admin React)

```bash
# 1. Navegue até a pasta do frontend
cd frontend

# 2. Instale as dependências do React
npm install

# 3. (Para Deploy) Crie a build de produção
# (Isto cria a pasta /frontend/build que o Nginx utiliza)
npm run build
```

-----

## Como Rodar

### Modo de Desenvolvimento

Para rodar o backend e o frontend separadamente em modo de desenvolvimento:

```bash
# Terminal 1: Rodar o Backend (API)
# (Na pasta raiz /ong-backend)
npm run dev
# (A API estará disponível em http://localhost:3000)
```

```bash
# Terminal 2: Rodar o Frontend (React)
# (Na pasta /frontend)
npm start
# (O painel admin abrirá em http://localhost:5000 ou outra porta)
```

### Modo de Produção (Simulando a VM)

Para testar a configuração de produção (Nginx + PM2):

1.  Certifique-se de que o **Nginx** esteja instalado e configurado (ver ficheiro de configuração Nginx no histórico de commits).
2.  Certifique-se de que o **PM2** esteja instalado (`npm install pm2 -g`).
3.  Inicie a API com PM2:
    ```bash
    # (Na pasta raiz /ong-backend)
    pm2 start server.js --name ong-api
    ```
4.  Inicie o Nginx:
    ```bash
    sudo systemctl start nginx
    ```

-----

## Estrutura de Roteamento (Produção)

Quando hospedado na VM com Nginx, o sistema responde nos seguintes caminhos:

  * `http://cidemoradia.duckdns.org/`
      * **O que faz:** Serve o Painel de Administrador (React).
  * `http://cidemoradia.duckdns.org/matricula`
      * **O que faz:** Serve a página de matrícula pública (HTML Estático).
  * `http://cidemoradia.duckdns.org/api/*`
      * **O que faz:** Encaminha todas as chamadas de API (ex: `/api/alunos`) para o servidor Node.js/Express.

-----

## Autores

  * **Alexandre dos Santos Abrantes**
  * **Alexandre Xavier Dantas**
  * **Cristian Lopes dos Santos Germano**
  * **Dafny Caroline Freitas**
  * **José Luiz dos Santos Pereira Filho**
  * **Mayra Alencar Vidal**
    
<!-- end list -->

```
```
