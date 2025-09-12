# CliniFlow - Comandos Globais
.PHONY: help dev prod stop clean logs build test setup

# Default target
help:
	@echo "CliniFlow - Comandos disponíveis:"
	@echo ""
	@echo "🚀 Setup:"
	@echo "  make setup         - Setup inicial do projeto"
	@echo "  make install       - Instalar dependências"
	@echo ""
	@echo "🐳 Docker:"
	@echo "  make dev           - Iniciar em modo desenvolvimento"
	@echo "  make prod          - Iniciar em modo produção"
	@echo "  make stop          - Parar todos os containers"
	@echo "  make clean         - Limpar containers e volumes"
	@echo "  make logs          - Ver logs de todos os serviços"
	@echo "  make build         - Construir imagens Docker"
	@echo ""
	@echo "🧪 Testes:"
	@echo "  make test          - Executar todos os testes"
	@echo "  make test-frontend - Executar testes do frontend"
	@echo "  make test-backend  - Executar testes do backend"
	@echo ""
	@echo "🔧 Desenvolvimento:"
	@echo "  make migrate       - Executar migrações do banco"
	@echo "  make shell-backend - Acessar shell do backend"
	@echo "  make shell-frontend- Acessar shell do frontend"
	@echo "  make db-shell      - Acessar shell do banco"
	@echo "  make redis-shell   - Acessar shell do Redis"
	@echo ""
	@echo "📚 Documentação:"
	@echo "  make docs          - Abrir documentação"
	@echo "  make api-docs      - Documentação da API"

# Setup inicial
setup:
	@echo "🚀 Configurando CliniFlow..."
	@chmod +x docker/scripts/*.sh
	@chmod +x scripts/*.sh
	@echo "✅ Setup concluído!"

# Instalar dependências
install:
	@echo "📦 Instalando dependências..."
	@cd ../cliniflow-server && npm install
	@npm install
	@echo "✅ Dependências instaladas!"

# Docker Development
dev:
	@echo "🐳 Iniciando CliniFlow em modo desenvolvimento..."
	@docker/scripts/docker-dev.sh

# Docker Production
prod:
	@echo "🚀 Iniciando CliniFlow em modo produção..."
	@docker/scripts/docker-prod.sh

# Stop containers
stop:
	@echo "🛑 Parando containers..."
	@docker-compose -f docker/docker-compose.dev.yml down 2>/dev/null || true
	@docker-compose -f docker/docker-compose.prod.yml down 2>/dev/null || true

# Clean containers and volumes
clean:
	@echo "🧹 Limpando containers e volumes..."
	@docker-compose -f docker/docker-compose.dev.yml down -v 2>/dev/null || true
	@docker-compose -f docker/docker-compose.prod.yml down -v 2>/dev/null || true
	@docker system prune -f

# View logs
logs:
	@echo "📋 Logs dos serviços:"
	@docker-compose -f docker/docker-compose.dev.yml logs -f

# Build images
build:
	@echo "🔨 Construindo imagens Docker..."
	@docker-compose -f docker/docker-compose.dev.yml build

# Tests
test: test-frontend test-backend

test-frontend:
	@echo "🧪 Executando testes do frontend..."
	@npm test

test-backend:
	@echo "🧪 Executando testes do backend..."
	@docker-compose -f docker/docker-compose.dev.yml exec api npm test

# Database
migrate:
	@echo "🗄️ Executando migrações..."
	@docker-compose -f docker/docker-compose.dev.yml exec api npm run db:migrate

# Shell access
shell-backend:
	@echo "🔧 Acessando shell do backend..."
	@docker-compose -f docker/docker-compose.dev.yml exec api sh

shell-frontend:
	@echo "📱 Acessando shell do frontend..."
	@docker-compose -f docker/docker-compose.dev.yml exec frontend sh

db-shell:
	@echo "🗄️ Acessando shell do PostgreSQL..."
	@docker-compose -f docker/docker-compose.dev.yml exec postgres psql -U postgres -d cliniflow_dev

redis-shell:
	@echo "🔴 Acessando shell do Redis..."
	@docker-compose -f docker/docker-compose.dev.yml exec redis redis-cli

# Documentation
docs:
	@echo "📚 Abrindo documentação..."
	@open docs/README.md

api-docs:
	@echo "📚 Abrindo documentação da API..."
	@open docs/api/API_SPECIFICATION.md
