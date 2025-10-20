@echo off
echo 🚀 Instalando Sistema de Gestão da ONG...

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado. Instale Node.js primeiro.
    echo 📥 Download: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
node --version

REM Instalar dependências do backend
echo 📦 Instalando dependências do backend...
call npm install

REM Instalar dependências do frontend
echo 📦 Instalando dependências do frontend...
cd frontend
call npm install
cd ..

REM Criar arquivo .env se não existir
if not exist .env (
    echo 📝 Criando arquivo .env...
    echo DB_TYPE=sqlite > .env
    echo DB_PATH=./database/ong_database.db >> .env
    echo PORT=3000 >> .env
    echo NODE_ENV=development >> .env
    echo ✅ Arquivo .env criado!
)

REM Criar diretório database se não existir
if not exist database mkdir database

echo 🎉 Instalação concluída!
echo.
echo 📋 Para executar o sistema:
echo 1. Backend: npm start
echo 2. Frontend: cd frontend ^&^& npm start
echo.
echo 🌐 Acesse: http://localhost:3000
pause
