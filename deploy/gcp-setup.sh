#!/bin/bash

# Script para configurar o ambiente na Google Cloud Platform
# Execute este script na sua máquina local para automatizar o deploy

echo "🚀 Configurando deploy na Google Cloud Platform..."

# Verificar se o gcloud está instalado
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud SDK não encontrado. Instale em: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Configurações
PROJECT_ID="seu-projeto-id"
INSTANCE_NAME="ong-server"
ZONE="us-central1-a"
MACHINE_TYPE="e2-medium"

echo "📋 Configurações:"
echo "  Projeto: $PROJECT_ID"
echo "  Instância: $INSTANCE_NAME"
echo "  Zona: $ZONE"
echo "  Tipo: $MACHINE_TYPE"

# Configurar projeto
echo "🔧 Configurando projeto..."
gcloud config set project $PROJECT_ID

# Criar instância de máquina virtual
echo "🖥️ Criando instância de máquina virtual..."
gcloud compute instances create $INSTANCE_NAME \
    --zone=$ZONE \
    --machine-type=$MACHINE_TYPE \
    --image-family=ubuntu-2004-lts \
    --image-project=ubuntu-os-cloud \
    --boot-disk-size=20GB \
    --boot-disk-type=pd-standard \
    --tags=http-server,https-server

# Aguardar a instância estar pronta
echo "⏳ Aguardando instância estar pronta..."
sleep 30

# Conectar e configurar o servidor
echo "🔧 Configurando servidor..."
gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command="
    # Atualizar sistema
    sudo apt update && sudo apt upgrade -y
    
    # Instalar Node.js
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
    
    # Instalar MariaDB
    sudo apt install -y mariadb-server mariadb-client
    
    # Instalar Git
    sudo apt install -y git
    
    # Instalar PM2 para gerenciamento de processos
    sudo npm install -g pm2
    
    # Configurar MariaDB
    sudo mysql_secure_installation <<EOF
n
y
y
y
y
EOF
    
    # Criar usuário para a aplicação
    sudo mysql -e \"CREATE USER 'ong_user'@'localhost' IDENTIFIED BY 'ong_password123';\"
    sudo mysql -e \"GRANT ALL PRIVILEGES ON *.* TO 'ong_user'@'localhost';\"
    sudo mysql -e \"FLUSH PRIVILEGES;\"
    
    # Criar diretório da aplicação
    mkdir -p /home/ubuntu/ong-app
    cd /home/ubuntu/ong-app
    
    echo '✅ Servidor configurado com sucesso!'
"

# Copiar arquivos da aplicação
echo "📁 Copiando arquivos da aplicação..."
gcloud compute scp --recurse . $INSTANCE_NAME:/home/ubuntu/ong-app --zone=$ZONE

# Configurar e executar a aplicação
echo "🚀 Configurando e executando aplicação..."
gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command="
    cd /home/ubuntu/ong-app
    
    # Instalar dependências
    npm install
    cd frontend && npm install && cd ..
    
    # Configurar banco de dados
    mysql -u ong_user -pong_password123 < database/schema.sql
    mysql -u ong_user -pong_password123 ong_database < database/seed.sql
    
    # Configurar variáveis de ambiente
    cat > .env <<EOF
DB_HOST=localhost
DB_PORT=3306
DB_USER=ong_user
DB_PASSWORD=ong_password123
DB_NAME=ong_database
PORT=3000
NODE_ENV=production
EOF
    
    # Build do frontend
    cd frontend
    npm run build
    cd ..
    
    # Configurar PM2
    cat > ecosystem.config.js <<EOF
module.exports = {
  apps: [{
    name: 'ong-backend',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
EOF
    
    # Iniciar aplicação com PM2
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup
    
    echo '✅ Aplicação configurada e executando!'
"

# Configurar firewall
echo "🔥 Configurando firewall..."
gcloud compute firewall-rules create allow-http-https \
    --allow tcp:80,tcp:443,tcp:3000 \
    --source-ranges 0.0.0.0/0 \
    --target-tags http-server,https-server

# Obter IP da instância
IP=$(gcloud compute instances describe $INSTANCE_NAME --zone=$ZONE --format='get(networkInterfaces[0].accessConfigs[0].natIP)')

echo "🎉 Deploy concluído com sucesso!"
echo ""
echo "📊 Informações do deploy:"
echo "  IP da instância: $IP"
echo "  Aplicação: http://$IP:3000"
echo "  SSH: gcloud compute ssh $INSTANCE_NAME --zone=$ZONE"
echo ""
echo "🔧 Comandos úteis:"
echo "  Ver logs: gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command='pm2 logs'"
echo "  Reiniciar: gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command='pm2 restart all'"
echo "  Status: gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --command='pm2 status'"
echo ""
echo "⚠️  Lembre-se de:"
echo "  1. Configurar domínio personalizado (opcional)"
echo "  2. Configurar SSL/HTTPS"
echo "  3. Configurar backup automático"
echo "  4. Monitorar uso de recursos"
