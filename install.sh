#!/bin/bash

echo "🚀 Instalando Sistema de Gestão da ONG..."

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js primeiro."
    echo "📥 Download: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"

# Instalar dependências do backend
echo "📦 Instalando dependências do backend..."
npm install

# Instalar dependências do frontend
echo "📦 Instalando dependências do frontend..."
cd frontend
npm install
cd ..

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cat > .env << EOF
DB_TYPE=sqlite
DB_PATH=./database/ong_database.db
PORT=3000
NODE_ENV=development
EOF
    echo "✅ Arquivo .env criado!"
fi

# Criar diretório database se não existir
mkdir -p database

echo "🎉 Instalação concluída!"
echo ""
echo "📋 Para executar o sistema:"
echo "1. Backend: npm start"
echo "2. Frontend: cd frontend && npm start"
echo ""
echo "🌐 Acesse: http://localhost:3000"
