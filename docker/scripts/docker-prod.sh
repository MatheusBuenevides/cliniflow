#!/bin/bash

# CliniFlow Docker Production Script
echo "🚀 Iniciando CliniFlow com Docker (Produção)..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Inicie o Docker e tente novamente."
    exit 1
fi

# Verificar se docker-compose está disponível
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose não está instalado."
    exit 1
fi

# Verificar se arquivo .env.prod existe
if [ ! -f ".env.prod" ]; then
    echo "⚠️  Arquivo .env.prod não encontrado."
    echo "📝 Copiando arquivo de exemplo..."
    cp env.prod.example .env.prod
    echo "🔧 Edite o arquivo .env.prod com suas configurações de produção!"
    echo "⚠️  IMPORTANTE: Altere as senhas e secrets antes de continuar!"
    read -p "Pressione Enter após editar o arquivo .env.prod..."
fi

# Verificar se SSL está configurado
if [ ! -d "ssl" ] || [ ! -f "ssl/cert.pem" ] || [ ! -f "ssl/key.pem" ]; then
    echo "⚠️  Certificados SSL não encontrados."
    echo "📝 Criando certificados auto-assinados para desenvolvimento..."
    mkdir -p ssl
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ssl/key.pem \
        -out ssl/cert.pem \
        -subj "/C=BR/ST=SP/L=SaoPaulo/O=CliniFlow/CN=localhost"
    echo "✅ Certificados SSL criados!"
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose -f docker-compose.prod.yml down

# Construir e iniciar containers
echo "🔨 Construindo e iniciando containers de produção..."
docker-compose -f docker-compose.prod.yml --env-file .env.prod up --build -d

# Aguardar serviços ficarem prontos
echo "⏳ Aguardando serviços ficarem prontos..."
sleep 15

# Verificar status dos containers
echo "📊 Status dos containers:"
docker-compose -f docker-compose.prod.yml ps

# Verificar logs
echo "📋 Logs dos serviços:"
echo "🔧 Backend logs:"
docker-compose -f docker-compose.prod.yml logs --tail=10 api

echo "📱 Frontend logs:"
docker-compose -f docker-compose.prod.yml logs --tail=10 frontend

echo ""
echo "✅ CliniFlow em produção iniciado com sucesso!"
echo "🌐 Frontend: http://localhost:80 (HTTP) / https://localhost:443 (HTTPS)"
echo "🔧 Backend: http://localhost:3001"
echo "💚 Health Check: http://localhost:3001/health"
echo ""
echo "📋 Comandos úteis:"
echo "  Ver logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "  Parar: docker-compose -f docker-compose.prod.yml down"
echo "  Rebuild: docker-compose -f docker-compose.prod.yml up --build"
echo ""
