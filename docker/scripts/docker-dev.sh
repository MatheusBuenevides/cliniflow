#!/bin/bash

# CliniFlow Docker Development Script
echo "🐳 Iniciando CliniFlow com Docker (Desenvolvimento)..."

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

# Navegar para o diretório correto
cd "$(dirname "$0")/../.."

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose -f docker/docker-compose.dev.yml down

# Remover volumes órfãos
echo "🧹 Limpando volumes órfãos..."
docker-compose -f docker/docker-compose.dev.yml down -v

# Construir e iniciar containers
echo "🔨 Construindo e iniciando containers..."
docker-compose -f docker/docker-compose.dev.yml up --build -d

# Aguardar serviços ficarem prontos
echo "⏳ Aguardando serviços ficarem prontos..."
sleep 10

# Verificar status dos containers
echo "📊 Status dos containers:"
docker-compose -f docker/docker-compose.dev.yml ps

# Verificar logs
echo "📋 Logs dos serviços:"
echo "🔧 Backend logs:"
docker-compose -f docker/docker-compose.dev.yml logs --tail=10 api

echo "📱 Frontend logs:"
docker-compose -f docker/docker-compose.dev.yml logs --tail=10 frontend

echo ""
echo "✅ CliniFlow iniciado com sucesso!"
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:3001"
echo "💚 Health Check: http://localhost:3001/health"
echo ""
echo "📋 Comandos úteis:"
echo "  Ver logs: docker-compose -f docker/docker-compose.dev.yml logs -f"
echo "  Parar: docker-compose -f docker/docker-compose.dev.yml down"
echo "  Rebuild: docker-compose -f docker/docker-compose.dev.yml up --build"
echo ""
