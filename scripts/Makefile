# CliniFlow Makefile
.PHONY: help dev prod stop clean logs build test

# Default target
help:
	@echo "CliniFlow - Comandos disponíveis:"
	@echo ""
	@echo "🐳 Docker:"
	@echo "  make dev          - Iniciar em modo desenvolvimento"
	@echo "  make prod         - Iniciar em modo produção"
	@echo "  make stop         - Parar todos os containers"
	@echo "  make clean        - Limpar containers e volumes"
	@echo "  make logs         - Ver logs de todos os serviços"
	@echo "  make build        - Construir imagens Docker"
	@echo ""
	@echo "🧪 Testes:"
	@echo "  make test         - Executar testes"
	@echo "  make test-backend - Executar testes do backend"
	@echo "  make test-frontend- Executar testes do frontend"
	@echo ""
	@echo "🔧 Desenvolvimento:"
	@echo "  make install      - Instalar dependências"
	@echo "  make migrate      - Executar migrações do banco"
	@echo "  make shell-backend- Acessar shell do backend"
	@echo "  make shell-frontend- Acessar shell do frontend"

# Docker Development
dev:
	@echo "🐳 Iniciando CliniFlow em modo desenvolvimento..."
	./docker-dev.sh

# Docker Production
prod:
	@echo "🚀 Iniciando CliniFlow em modo produção..."
	./docker-prod.sh

# Stop containers
stop:
	@echo "🛑 Parando containers..."
	docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
	docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# Clean containers and volumes
clean:
	@echo "🧹 Limpando containers e volumes..."
	docker-compose -f docker-compose.dev.yml down -v 2>/dev/null || true
	docker-compose -f docker-compose.prod.yml down -v 2>/dev/null || true
	docker system prune -f

# View logs
logs:
	@echo "📋 Logs dos serviços:"
	docker-compose -f docker-compose.dev.yml logs -f

# Build images
build:
	@echo "🔨 Construindo imagens Docker..."
	docker-compose -f docker-compose.dev.yml build

# Install dependencies
install:
	@echo "📦 Instalando dependências..."
	cd ../cliniflow-server && npm install
	cd ../cliniflow && npm install

# Run migrations
migrate:
	@echo "🗄️ Executando migrações..."
	docker-compose -f docker-compose.dev.yml exec api npm run db:migrate

# Tests
test: test-backend test-frontend

test-backend:
	@echo "🧪 Executando testes do backend..."
	docker-compose -f docker-compose.dev.yml exec api npm test

test-frontend:
	@echo "🧪 Executando testes do frontend..."
	docker-compose -f docker-compose.dev.yml exec frontend npm test

# Shell access
shell-backend:
	@echo "🔧 Acessando shell do backend..."
	docker-compose -f docker-compose.dev.yml exec api sh

shell-frontend:
	@echo "📱 Acessando shell do frontend..."
	docker-compose -f docker-compose.dev.yml exec frontend sh

# Database access
db-shell:
	@echo "🗄️ Acessando shell do PostgreSQL..."
	docker-compose -f docker-compose.dev.yml exec postgres psql -U postgres -d cliniflow_dev

# Redis access
redis-shell:
	@echo "🔴 Acessando shell do Redis..."
	docker-compose -f docker-compose.dev.yml exec redis redis-cli
