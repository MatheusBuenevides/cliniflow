# Guia de Desenvolvimento - CliniFlow

## Configuração do Ambiente

### Pré-requisitos
- **Node.js**: versão 18+ (recomendado 20+)
- **npm**: versão 9+ (incluído com Node.js)
- **Git**: para controle de versão

### Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd cliniflow

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Acesse http://localhost:5173
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento (Vite)

# Build
npm run build        # Gera build de produção
npm run preview      # Preview do build de produção

# Qualidade de Código
npm run lint         # Executa ESLint
npm run lint:fix     # Corrige problemas automaticamente

# Tipos TypeScript
npx tsc --noEmit     # Verifica tipos sem gerar arquivos
```

## Estrutura do Projeto

### Organização Atual

```
src/
├── App.tsx              # Componente principal (temporário)
├── main.tsx             # Entry point
├── index.css            # Estilos globais + Tailwind
├── vite-env.d.ts       # Tipos do Vite
├── components/          # Componentes reutilizáveis (vazio)
├── hooks/               # Custom hooks (vazio)
├── pages/               # Páginas do sistema (vazio)
├── services/            # Serviços de API (vazio)
├── stores/              # Gerenciamento de estado (vazio)
├── types/               # Definições TypeScript (vazio)
└── assets/              # Recursos estáticos
    └── react.svg
```

### Estrutura Planejada (Refatoração)

```
src/
├── components/
│   ├── ui/              # Componentes base (Button, Input, etc.)
│   ├── layout/          # Layout components (Sidebar, Header)
│   ├── dashboard/       # Componentes específicos do dashboard
│   ├── agenda/          # Componentes da agenda
│   ├── patients/        # Componentes de pacientes
│   └── financials/      # Componentes financeiros
├── pages/
│   ├── Dashboard.tsx
│   ├── Agenda.tsx
│   ├── Patients.tsx
│   ├── Financials.tsx
│   └── Settings.tsx
├── hooks/
│   ├── usePatients.ts
│   ├── useAppointments.ts
│   └── useFinancials.ts
├── services/
│   ├── api.ts           # Configuração base da API
│   ├── patients.ts      # Serviços de pacientes
│   ├── appointments.ts  # Serviços de agendamentos
│   └── financials.ts    # Serviços financeiros
├── stores/
│   ├── useAuthStore.ts  # Estado de autenticação
│   ├── useAppStore.ts   # Estado global da aplicação
│   └── index.ts         # Exports dos stores
├── types/
│   ├── patient.ts
│   ├── appointment.ts
│   ├── financial.ts
│   └── index.ts         # Barrel export
└── utils/
    ├── formatters.ts    # Formatação de dados
    ├── validators.ts    # Validações
    └── constants.ts     # Constantes da aplicação
```

## Convenções de Código

### Nomenclatura

#### Arquivos e Pastas
```bash
# Componentes: PascalCase
PatientCard.tsx
DashboardMetrics.tsx

# Hooks: camelCase com prefixo 'use'
usePatients.ts
useLocalStorage.ts

# Services: camelCase
patientService.ts
apiClient.ts

# Types: camelCase para arquivos, PascalCase para tipos
patient.ts → export interface Patient
appointment.ts → export interface Appointment

# Pastas: kebab-case ou camelCase
components/
patient-management/
```

#### Variáveis e Funções
```typescript
// camelCase para variáveis e funções
const patientList = [];
const handleSubmit = () => {};

// PascalCase para componentes e tipos
const PatientCard = () => {};
interface Patient {}

// UPPER_SNAKE_CASE para constantes
const API_BASE_URL = 'https://api.example.com';
const MAX_PATIENTS_PER_PAGE = 50;
```

### Estrutura de Componentes

#### Template Padrão
```typescript
import React from 'react';
import { SomeIcon } from 'lucide-react';

// Imports de tipos
import type { Patient } from '@/types';

// Imports de hooks/services
import { usePatients } from '@/hooks/usePatients';

// Props interface
interface PatientCardProps {
  patient: Patient;
  onEdit?: (id: number) => void;
  className?: string;
}

// Componente principal
export const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  onEdit,
  className = ''
}) => {
  // Hooks e estado local
  const { updatePatient } = usePatients();
  const [isEditing, setIsEditing] = React.useState(false);

  // Funções auxiliares
  const handleEdit = () => {
    setIsEditing(true);
    onEdit?.(patient.id);
  };

  // Early returns
  if (!patient) {
    return <div>Paciente não encontrado</div>;
  }

  // Render principal
  return (
    <div className={`patient-card ${className}`}>
      <h3>{patient.name}</h3>
      <p>{patient.email}</p>
      <button onClick={handleEdit}>
        <SomeIcon size={16} />
        Editar
      </button>
    </div>
  );
};

// Export default se for o único export
export default PatientCard;
```

### TypeScript

#### Tipos e Interfaces
```typescript
// Preferir interfaces para objetos
interface Patient {
  id: number;
  name: string;
  email: string;
  phone?: string; // Opcional
}

// Types para unions e primitivos
type Status = 'active' | 'inactive' | 'pending';
type PatientId = number;

// Generics quando necessário
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Utility types
type PatientUpdate = Partial<Omit<Patient, 'id'>>;
type PatientCreate = Omit<Patient, 'id'>;
```

#### Props de Componentes
```typescript
// Props básicas
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

// Extendendo HTML props
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

// Componentes com ref
interface CustomInputProps {
  label: string;
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, ...props }, ref) => (
    <div>
      <label>{label}</label>
      <input ref={ref} {...props} />
    </div>
  )
);
```

### CSS e Estilização

#### Tailwind CSS
```typescript
// Classes utilitárias organizadas
const buttonClasses = [
  'inline-flex items-center gap-2',  // Layout
  'px-4 py-2',                       // Spacing
  'bg-purple-600 text-white',        // Colors
  'rounded-lg font-semibold',        // Appearance
  'hover:bg-purple-700',             // States
  'transition-colors duration-200',   // Animations
  'disabled:opacity-50'              // Disabled state
].join(' ');

// Conditional classes
const getStatusClass = (status: string) => {
  const base = 'px-2 py-1 rounded-full text-xs font-semibold';
  const variants = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700'
  };
  return `${base} ${variants[status] || ''}`;
};
```

#### Responsive Design
```typescript
// Mobile-first approach
const cardClasses = [
  'w-full',              // Mobile
  'md:w-1/2',           // Tablet
  'lg:w-1/3',           // Desktop
  'xl:w-1/4'            // Large desktop
].join(' ');

// Grid responsivo
const gridClasses = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6';
```

## Gerenciamento de Estado

### Estado Local (useState)
```typescript
// Para estado simples de componente
const [isLoading, setIsLoading] = useState(false);
const [formData, setFormData] = useState<PatientForm>({
  name: '',
  email: '',
  phone: ''
});

// Com tipos explícitos quando necessário
const [patients, setPatients] = useState<Patient[]>([]);
```

### Estado Global (Zustand - Planejado)
```typescript
// stores/usePatientStore.ts
import { create } from 'zustand';

interface PatientStore {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchPatients: () => Promise<void>;
  addPatient: (patient: Omit<Patient, 'id'>) => Promise<void>;
  updatePatient: (id: number, data: Partial<Patient>) => Promise<void>;
  deletePatient: (id: number) => Promise<void>;
}

export const usePatientStore = create<PatientStore>((set, get) => ({
  patients: [],
  loading: false,
  error: null,

  fetchPatients: async () => {
    set({ loading: true, error: null });
    try {
      const patients = await patientService.getAll();
      set({ patients, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addPatient: async (patientData) => {
    const newPatient = await patientService.create(patientData);
    set(state => ({
      patients: [...state.patients, newPatient]
    }));
  }
}));
```

## Integração com APIs

### Configuração Base
```typescript
// services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Adicionar token de auth se disponível
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Métodos de conveniência
  get<T>(endpoint: string) {
    return this.request<T>(endpoint);
  }

  post<T>(endpoint: string, data: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put<T>(endpoint: string, data: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
```

### Services Específicos
```typescript
// services/patientService.ts
import { apiClient } from './api';
import type { Patient, PatientCreate, PatientUpdate } from '@/types';

export const patientService = {
  async getAll(): Promise<Patient[]> {
    return apiClient.get<Patient[]>('/patients');
  },

  async getById(id: number): Promise<Patient> {
    return apiClient.get<Patient>(`/patients/${id}`);
  },

  async create(data: PatientCreate): Promise<Patient> {
    return apiClient.post<Patient>('/patients', data);
  },

  async update(id: number, data: PatientUpdate): Promise<Patient> {
    return apiClient.put<Patient>(`/patients/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/patients/${id}`);
  },

  async search(query: string): Promise<Patient[]> {
    return apiClient.get<Patient[]>(`/patients/search?q=${encodeURIComponent(query)}`);
  }
};
```

## Custom Hooks

### Hook de API
```typescript
// hooks/usePatients.ts
import { useState, useEffect } from 'react';
import { patientService } from '@/services/patientService';
import type { Patient } from '@/types';

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await patientService.getAll();
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const addPatient = async (patientData: Omit<Patient, 'id'>) => {
    try {
      const newPatient = await patientService.create(patientData);
      setPatients(prev => [...prev, newPatient]);
      return newPatient;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar paciente');
      throw err;
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return {
    patients,
    loading,
    error,
    fetchPatients,
    addPatient,
  };
};
```

### Hook Utilitário
```typescript
// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};
```

## Tratamento de Erros

### Boundary de Erro
```typescript
// components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>Ops! Algo deu errado</h2>
          <p>Ocorreu um erro inesperado. Tente recarregar a página.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Tratamento em Hooks
```typescript
// hooks/useAsync.ts
import { useState, useEffect, useCallback } from 'react';

export const useAsync = <T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
};
```

## Performance

### Otimizações React
```typescript
// Memoização de componentes caros
const ExpensiveComponent = React.memo(({ data }: { data: Patient[] }) => {
  // Processamento custoso
  const processedData = useMemo(() => {
    return data.map(patient => ({
      ...patient,
      displayName: patient.name.toUpperCase()
    }));
  }, [data]);

  return <div>{/* render */}</div>;
});

// Callback memoizado
const PatientList = () => {
  const handlePatientClick = useCallback((id: number) => {
    // ação
  }, []);

  return (
    <div>
      {patients.map(patient => (
        <PatientCard
          key={patient.id}
          patient={patient}
          onClick={handlePatientClick}
        />
      ))}
    </div>
  );
};
```

### Lazy Loading
```typescript
// Páginas lazy-loaded
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Patients = lazy(() => import('@/pages/Patients'));

const App = () => (
  <Suspense fallback={<div>Carregando...</div>}>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/patients" element={<Patients />} />
    </Routes>
  </Suspense>
);
```

## Testes (Planejado)

### Setup Recomendado
- **Vitest**: Framework de testes
- **Testing Library**: Testes de componentes
- **MSW**: Mock de APIs

### Exemplo de Teste
```typescript
// __tests__/PatientCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { PatientCard } from '@/components/PatientCard';

const mockPatient = {
  id: 1,
  name: 'João Silva',
  email: 'joao@example.com',
  phone: '(11) 99999-9999'
};

describe('PatientCard', () => {
  it('renders patient information', () => {
    render(<PatientCard patient={mockPatient} />);
    
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('joao@example.com')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = vi.fn();
    render(<PatientCard patient={mockPatient} onEdit={mockOnEdit} />);
    
    fireEvent.click(screen.getByText('Editar'));
    expect(mockOnEdit).toHaveBeenCalledWith(1);
  });
});
```

## Deploy

### Build de Produção
```bash
# Gerar build otimizado
npm run build

# Verificar build localmente
npm run preview
```

### Variáveis de Ambiente
```bash
# .env.local
VITE_API_URL=https://api.cliniflow.com
VITE_APP_VERSION=1.0.0
```

### Deploy Recomendados
- **Vercel**: Deploy automático via Git
- **Netlify**: Ideal para SPAs
- **Docker**: Para ambientes containerizados
