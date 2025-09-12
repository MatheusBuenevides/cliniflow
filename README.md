# 🏥 CliniFlow - Sistema de Gestão Clínica

Sistema completo de gestão clínica para psicólogos, desenvolvido com React (frontend) e Node.js (backend).

## 📁 Estrutura do Projeto

```
cliniflow/                          # Frontend React
├── src/                            # Código fonte
├── public/                         # Arquivos estáticos
├── docs/                           # Documentação
├── scripts/                        # Scripts de configuração
└── package.json

cliniflow-server/                   # Backend Node.js
├── src/                            # Código fonte
├── config/                         # Configurações
├── docs/                           # Documentação
└── package.json

docker/                             # Configurações Docker
├── frontend/                       # Dockerfile frontend
├── backend/                        # Dockerfile backend
├── docker-compose.dev.yml          # Desenvolvimento
├── docker-compose.prod.yml         # Produção
└── scripts/                        # Scripts Docker

docs/                               # Documentação geral
├── api/                            # Documentação da API
├── architecture/                   # Arquitetura
├── deployment/                     # Deploy
└── development/                    # Desenvolvimento

scripts/                            # Scripts globais
├── setup.sh                        # Setup inicial
├── dev.sh                          # Desenvolvimento
└── build.sh                        # Build
```

## 🚀 Início Rápido

### 1. Setup Inicial
```bash
make setup
```

### 2. Instalar Dependências
```bash
make install
```

### 3. Executar em Desenvolvimento
```bash
make dev
```

### 4. Acessar Aplicação
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 🐳 Docker (Recomendado)

### Desenvolvimento
```bash
make dev
```

### Produção
```bash
make prod
```

### Comandos Úteis
```bash
make help          # Ver todos os comandos
make stop          # Parar containers
make clean         # Limpar containers e volumes
make logs          # Ver logs
make test          # Executar testes
make shell-backend # Acessar shell do backend
make db-shell      # Acessar banco de dados
```

## 🧪 Testes

```bash
# Todos os testes
make test

# Testes específicos
make test-frontend
make test-backend
```

## 🛠️ Desenvolvimento

### Estrutura do Frontend
- **Componentes**: Organizados por funcionalidade
- **Hooks**: Customizados para lógica reutilizável
- **Stores**: Estado global com Zustand
- **Services**: Cliente API e serviços

### Estrutura do Backend
- **Controllers**: Lógica de requisições
- **Services**: Lógica de negócio
- **Routes**: Definição de rotas
- **Middlewares**: Autenticação e validação

## 📚 Documentação

- [Documentação da API](./docs/api/)
- [Arquitetura](./docs/architecture/)
- [Deploy](./docs/deployment/)
- [Desenvolvimento](./docs/development/)

## 🛠️ Tecnologias

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Zustand (Estado)
- React Router

### Backend
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Knex.js
- JWT
- Winston (Logs)

### DevOps
- Docker
- Docker Compose
- Nginx
- PostgreSQL
- Redis

## 📄 Licença

MIT License

---

**CliniFlow** - Sistema de gestão clínica para psicólogos 🚀
