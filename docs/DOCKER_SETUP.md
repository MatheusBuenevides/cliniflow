# 🐳 CliniFlow - Setup Docker

Este documento descreve como configurar e executar o CliniFlow usando Docker para uma solução robusta e escalável.

## 🏗️ Arquitetura Docker

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │
│   Port: 5173    │    │   Port: 3001    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │     Redis       │
                    │   (Cache)       │
                    │   Port: 6379    │
                    └─────────────────┘
```

## 🚀 Início Rápido

### 1. Desenvolvimento
```bash
cd cliniflow
make dev
```

### 2. Produção
```bash
cd cliniflow
make prod
```

## 📁 Estrutura de Arquivos Docker

```
cliniflow/
├── docker-compose.dev.yml      # Desenvolvimento
├── docker-compose.prod.yml     # Produção
├── Dockerfile.frontend         # Frontend multi-stage
├── nginx.conf                  # Nginx para frontend
├── nginx-proxy.conf            # Proxy reverso
├── docker-dev.sh              # Script desenvolvimento
├── docker-prod.sh             # Script produção
├── Makefile                   # Comandos simplificados
└── env.prod.example           # Variáveis produção
```

## 🔧 Configurações

### Desenvolvimento
- **Frontend**: Hot reload ativado
- **Backend**: Modo desenvolvimento com logs detalhados
- **Database**: Dados persistidos em volumes
- **Redis**: Cache em memória

### Produção
- **Frontend**: Build otimizado com Nginx
- **Backend**: Build otimizado com multi-stage
- **Database**: Configurações de produção
- **Redis**: Persistência habilitada
- **SSL**: Certificados HTTPS
- **Rate Limiting**: Proteção contra abuso

## 🛠️ Comandos Disponíveis

### Makefile (Recomendado)
```bash
make help          # Ver todos os comandos
make dev           # Iniciar desenvolvimento
make prod          # Iniciar produção
make stop          # Parar containers
make clean         # Limpar tudo
make logs          # Ver logs
make test          # Executar testes
make build         # Construir imagens
make install       # Instalar dependências
make migrate       # Executar migrações
make shell-backend # Shell do backend
make shell-frontend# Shell do frontend
make db-shell      # Shell do banco
make redis-shell   # Shell do Redis
```

### Scripts Diretos
```bash
./docker-dev.sh    # Desenvolvimento
./docker-prod.sh   # Produção
```

### Docker Compose Direto
```bash
# Desenvolvimento
docker-compose -f docker-compose.dev.yml up -d

# Produção
docker-compose -f docker-compose.prod.yml up -d
```

## 🌐 Acesso aos Serviços

### Desenvolvimento
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Database**: localhost:5432
- **Redis**: localhost:6379

### Produção
- **Frontend**: http://localhost:80 / https://localhost:443
- **Backend**: http://localhost:3001
- **Database**: localhost:5432
- **Redis**: localhost:6379

## 🔐 Segurança

### Desenvolvimento
- Senhas padrão (apenas para desenvolvimento)
- CORS liberado para localhost
- Logs detalhados

### Produção
- Senhas seguras obrigatórias
- CORS configurável
- Rate limiting
- SSL/TLS
- Headers de segurança
- Usuário não-root nos containers

## 📊 Monitoramento

### Health Checks
```bash
# Backend
curl http://localhost:3001/health

# Frontend
curl http://localhost:5173/health
```

### Logs
```bash
# Todos os serviços
make logs

# Serviço específico
docker-compose -f docker-compose.dev.yml logs -f api
docker-compose -f docker-compose.dev.yml logs -f frontend
```

### Métricas
```bash
# Status dos containers
docker-compose -f docker-compose.dev.yml ps

# Uso de recursos
docker stats
```

## 🗄️ Banco de Dados

### Migrações
```bash
make migrate
```

### Backup
```bash
# Criar backup
docker-compose -f docker-compose.dev.yml exec postgres pg_dump -U postgres cliniflow_dev > backup.sql

# Restaurar backup
docker-compose -f docker-compose.dev.yml exec -T postgres psql -U postgres cliniflow_dev < backup.sql
```

### Acesso Direto
```bash
make db-shell
```

## 🔄 Atualizações

### Rebuild Completo
```bash
make clean
make build
make dev
```

### Atualizar Código
```bash
# Desenvolvimento (hot reload)
git pull
# Código é atualizado automaticamente

# Produção
git pull
make prod
```

## 🐛 Troubleshooting

### Container não inicia
```bash
# Ver logs
make logs

# Verificar status
docker-compose -f docker-compose.dev.yml ps

# Reiniciar
make stop
make dev
```

### Problemas de rede
```bash
# Verificar redes
docker network ls

# Limpar redes
docker network prune
```

### Problemas de volume
```bash
# Ver volumes
docker volume ls

# Limpar volumes
make clean
```

### Problemas de porta
```bash
# Verificar portas em uso
lsof -i :3001
lsof -i :5173
lsof -i :5432
```

## 📈 Performance

### Otimizações de Desenvolvimento
- Hot reload para frontend
- Watch mode para backend
- Volumes para persistência
- Logs detalhados

### Otimizações de Produção
- Multi-stage builds
- Imagens otimizadas
- Nginx para frontend
- Gzip compression
- Cache headers
- Resource limits

## 🔧 Customização

### Variáveis de Ambiente
```bash
# Desenvolvimento
cp env.example .env

# Produção
cp env.prod.example .env.prod
```

### Configurações Nginx
Edite `nginx.conf` ou `nginx-proxy.conf` conforme necessário.

### Configurações Docker
Modifique os arquivos `docker-compose.*.yml` para suas necessidades.

---

**CliniFlow Docker Setup** - Solução robusta e escalável! 🚀
