# Integração Backend-Frontend - CliniFlow

## 🚀 Visão Geral

Este documento descreve como integrar o backend Node.js com o frontend React do CliniFlow.

## 📁 Estrutura do Projeto

```
Documents/
├── cliniflow/              # Frontend React
│   ├── src/
│   │   ├── services/
│   │   │   └── api.ts     # Cliente API
│   │   └── components/
│   └── package.json
└── cliniflow-server/       # Backend Node.js
    ├── src/
    │   ├── controllers/    # Controladores da API
    │   ├── services/       # Lógica de negócio
    │   ├── routes/         # Rotas da API
    │   ├── middlewares/    # Middlewares (auth, validation)
    │   └── migrations/     # Migrações do banco
    └── package.json
```

## 🔧 Configuração

### 1. Variáveis de Ambiente

**Backend (cliniflow-server/.env):**
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/cliniflow
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3001/api/v1
VITE_APP_NAME=CliniFlow
VITE_NODE_ENV=development
```

### 2. Instalação

```bash
# Instalar dependências do backend
cd cliniflow-server
npm install

# Instalar dependências do frontend
cd ../cliniflow
npm install
```

### 3. Banco de Dados

```bash
# Executar migrações
cd cliniflow-server
npm run db:migrate
```

## 🚀 Executando

### Desenvolvimento Local

```bash
# Terminal 1 - Backend
cd cliniflow-server
npm run dev

# Terminal 2 - Frontend
cd cliniflow
npm run dev
```

### Docker Compose

```bash
# Executar tudo com Docker (do diretório cliniflow)
cd cliniflow
docker-compose up -d
```

## 🔐 Autenticação

### Fluxo de Autenticação

1. **Login**: `POST /api/v1/auth/login`
2. **Registro**: `POST /api/v1/auth/register`
3. **Refresh Token**: `POST /api/v1/auth/refresh`
4. **Logout**: `POST /api/v1/auth/logout`

### Uso no Frontend

```typescript
import { apiClient } from './services/api';

// Login
const response = await apiClient.login(email, password);
if (response.success) {
  // Token é automaticamente salvo
  console.log('Login realizado com sucesso');
}

// Requisições autenticadas
const patients = await apiClient.getPatients();
```

## 📊 Endpoints Principais

### Pacientes
- `GET /api/v1/patients` - Listar pacientes
- `POST /api/v1/patients` - Criar paciente
- `GET /api/v1/patients/:id` - Obter paciente
- `PUT /api/v1/patients/:id` - Atualizar paciente
- `DELETE /api/v1/patients/:id` - Excluir paciente

### Agendamentos
- `GET /api/v1/appointments` - Listar agendamentos
- `POST /api/v1/appointments` - Criar agendamento
- `GET /api/v1/appointments/:id` - Obter agendamento
- `PUT /api/v1/appointments/:id` - Atualizar agendamento
- `DELETE /api/v1/appointments/:id` - Excluir agendamento

### Sessões (Prontuário)
- `GET /api/v1/sessions` - Listar sessões
- `POST /api/v1/sessions` - Criar sessão
- `GET /api/v1/sessions/:id` - Obter sessão
- `PUT /api/v1/sessions/:id` - Atualizar sessão
- `DELETE /api/v1/sessions/:id` - Excluir sessão

### Financeiro
- `GET /api/v1/financial/transactions` - Listar transações
- `POST /api/v1/financial/transactions` - Criar transação
- `GET /api/v1/financial/dashboard` - Dashboard financeiro

### Telepsicologia
- `GET /api/v1/video/sessions` - Listar sessões de vídeo
- `POST /api/v1/video/sessions` - Criar sessão de vídeo
- `POST /api/v1/video/sessions/:id/start` - Iniciar sessão
- `POST /api/v1/video/sessions/:id/end` - Finalizar sessão

### Notificações
- `GET /api/v1/notifications` - Listar notificações
- `PATCH /api/v1/notifications/:id/read` - Marcar como lida
- `PATCH /api/v1/notifications/mark-all-read` - Marcar todas como lidas

### Configurações
- `GET /api/v1/settings/profile` - Obter perfil
- `PUT /api/v1/settings/profile` - Atualizar perfil
- `GET /api/v1/settings/working-hours` - Horários de trabalho
- `PUT /api/v1/settings/working-hours` - Atualizar horários

## 🔄 Integração com Stores

### Exemplo: PatientStore

```typescript
// src/stores/usePatientStore.ts
import { apiClient } from '../services/api';

export const usePatientStore = create<PatientStore>((set, get) => ({
  patients: [],
  loading: false,
  error: null,

  fetchPatients: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.getPatients();
      if (response.success) {
        set({ patients: response.data.patients, loading: false });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createPatient: async (patientData) => {
    try {
      const response = await apiClient.createPatient(patientData);
      if (response.success) {
        // Atualizar lista local
        const { patients } = get();
        set({ patients: [...patients, response.data] });
      }
    } catch (error) {
      set({ error: error.message });
    }
  },
}));
```

## 🧪 Testes

### Backend
```bash
cd cliniflow-server
npm test
```

### Frontend
```bash
cd cliniflow
npm test
```

## 📈 Monitoramento

### Health Check
- Backend: `GET http://localhost:3001/health`
- Frontend: `http://localhost:5173`

### Logs
- Backend: Logs estruturados com Winston
- Frontend: Console logs em desenvolvimento

## 🚀 Deploy

### Produção
```bash
# Build do backend
cd server
npm run build

# Build do frontend
npm run build

# Deploy com Docker
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Troubleshooting

### Problemas Comuns

1. **CORS Error**
   - Verificar `CORS_ORIGIN` no backend
   - Verificar `VITE_API_URL` no frontend

2. **Token Expirado**
   - Verificar refresh token
   - Verificar configuração JWT

3. **Banco de Dados**
   - Verificar conexão PostgreSQL
   - Executar migrações

4. **Portas em Uso**
   - Backend: 3001
   - Frontend: 5173
   - PostgreSQL: 5432
   - Redis: 6379

### Logs de Debug

```bash
# Backend logs
cd cliniflow-server
npm run dev

# Frontend logs
cd cliniflow
npm run dev
```

## 📚 Documentação Adicional

- [API Specification](./docs/API_SPECIFICATION.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Development Guide](./docs/DEVELOPMENT.md)

---

**CliniFlow** - Sistema de gestão clínica para psicólogos
