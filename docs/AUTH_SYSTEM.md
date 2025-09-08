# Sistema de Autenticação - CliniFlow

## Visão Geral

O sistema de autenticação do CliniFlow foi implementado seguindo as melhores práticas de segurança e usabilidade. Ele inclui proteção de rotas, persistência de sessão, auto-refresh de tokens e interceptors para requisições API.

## Componentes Principais

### 1. AuthContext Provider

O `AuthProvider` gerencia o estado global de autenticação e fornece:

- **Estado de autenticação**: `user`, `isAuthenticated`, `loading`, `error`
- **Funções de autenticação**: `login`, `logout`, `register`, `updateProfile`, `refreshToken`
- **Auto-refresh de token**: Renovação automática a cada 5 minutos
- **Persistência de sessão**: JWT armazenado no localStorage
- **Verificação de expiração**: Validação automática de tokens

### 2. ProtectedRoute Component

Componente para proteger rotas que requerem autenticação:

```tsx
import { ProtectedRoute } from '../components/auth';

<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

**Props disponíveis:**
- `requireAuth`: boolean (padrão: true)
- `redirectTo`: string (padrão: '/login')
- `fallback`: ReactNode (componente de loading customizado)

### 3. Hooks Customizados

#### useAuth()
Hook principal para acessar o contexto de autenticação:

```tsx
import { useAuth } from '../hooks';

const { user, isAuthenticated, login, logout, loading, error } = useAuth();
```

#### useRequireAuth()
Hook para componentes que requerem autenticação:

```tsx
import { useRequireAuth } from '../hooks';

const { isAuthenticated, loading } = useRequireAuth('/login');
```

#### useAuthRedirect()
Hook para redirecionamento baseado no estado de autenticação:

```tsx
import { useAuthRedirect } from '../hooks';

// Redireciona usuários autenticados para a página inicial
useAuthRedirect('/');
```

#### useRequirePermission()
Hook para verificar permissões específicas:

```tsx
import { useRequirePermission } from '../hooks';

const { hasPermission } = useRequirePermission('admin');
```

## Interceptor de API

O sistema inclui um interceptor automático que:

- **Adiciona tokens**: Inclui automaticamente o JWT nas requisições
- **Verifica expiração**: Valida tokens antes de enviar requisições
- **Logout automático**: Desconecta o usuário em caso de erro 401
- **Refresh de token**: Renova tokens automaticamente quando necessário

## Persistência de Sessão

### JWT Storage
- Tokens são armazenados no `localStorage`
- Limpeza automática em logout
- Verificação de expiração antes de cada requisição

### Auto-refresh
- Renovação automática a cada 5 minutos
- Fallback para logout em caso de falha
- Verificação na inicialização da aplicação

## Uso em Páginas

### Página de Login
```tsx
import { useAuth, useAuthRedirect } from '../hooks';

const Login = () => {
  const { login, error, clearError } = useAuth();
  
  // Redireciona se já autenticado
  useAuthRedirect();
  
  // ... resto da implementação
};
```

### Página Protegida
```tsx
import { useRequireAuth } from '../hooks';

const Dashboard = () => {
  // Redireciona automaticamente se não autenticado
  useRequireAuth();
  
  // ... resto da implementação
};
```

## Configuração

### Variáveis de Ambiente
```env
REACT_APP_API_URL=http://localhost:3001/api
```

### Integração com Zustand
O sistema está integrado com o `useAuthStore` do Zustand para:
- Persistência de estado
- Gerenciamento de loading
- Tratamento de erros

## Segurança

### Medidas Implementadas
- ✅ Validação de tokens JWT
- ✅ Verificação de expiração
- ✅ Logout automático em erros 401
- ✅ Limpeza de storage em logout
- ✅ Interceptors para requisições
- ✅ Auto-refresh de tokens

### Preparação para Produção
- 🔄 Integração com API real
- 🔄 Implementação de roles/permissões
- 🔄 Refresh token real
- 🔄 Validação server-side

## Exemplo Completo

```tsx
import React from 'react';
import { useAuth, useRequireAuth, useRequirePermission } from '../hooks';

const ProtectedComponent = () => {
  const { user, logout } = useAuth();
  const { hasPermission } = useRequirePermission('admin');
  
  // Redireciona se não autenticado
  useRequireAuth();

  return (
    <div>
      <h1>Bem-vindo, {user?.name}!</h1>
      {hasPermission && <AdminPanel />}
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

## Troubleshooting

### Problemas Comuns

1. **Token expirado**: O sistema faz logout automático
2. **Erro 401**: Verifica se o token está sendo enviado corretamente
3. **Redirecionamento infinito**: Verifica se o `useAuthRedirect` está sendo usado corretamente

### Debug
Para debugar problemas de autenticação:
1. Verifique o localStorage para o token
2. Confirme se o `AuthProvider` está envolvendo a aplicação
3. Verifique se os hooks estão sendo usados corretamente
