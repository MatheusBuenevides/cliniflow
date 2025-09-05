# Design System - CliniFlow

## Visão Geral

O CliniFlow utiliza um design system consistente baseado em Tailwind CSS v4, desenvolvido especificamente para psicólogos. O foco está em criar uma experiência profissional, acolhedora e segura tanto para profissionais quanto para pacientes.

## Filosofia de Design

### Princípios
1. **Clareza**: Interface limpa e intuitiva, reduzindo ansiedade no uso
2. **Confiabilidade**: Visual que transmite segurança e profissionalismo
3. **Acolhimento**: Cores e formas que criam um ambiente acolhedor
4. **Privacidade**: Elementos visuais que reforçam a confidencialidade
5. **Acessibilidade**: Inclusivo para todos os usuários e dispositivos

## Paleta de Cores

### Cores Primárias
```css
/* Purple - Cor principal unificada do CliniFlow */
--primary-50: #f5f3ff   /* Backgrounds muito claros */
--primary-100: #ede9fe  /* Backgrounds de cards acolhedores */
--primary-200: #ddd6fe  /* Borders suaves */
--primary-500: #8b5cf6  /* Estados intermediários */
--primary-600: #7c3aed  /* Cor principal - botões, links, elementos interativos */
--primary-700: #6d28d9  /* Hover states */
--primary-800: #5b21b6  /* Elementos de destaque */
--primary-900: #4c1d95  /* Textos de alta importância */

/* Cor especial de identidade visual */
--brand-accent: #820AD1  /* Usado apenas em logo e detalhes gráficos específicos */
```

### Cores Terapêuticas
```css
/* Verde - Crescimento e bem-estar */
--therapeutic-green: #10b981
--therapeutic-green-light: #d1fae5

/* Azul - Tranquilidade e confiança */
--therapeutic-blue: #3b82f6
--therapeutic-blue-light: #dbeafe

/* Coral - Acolhimento e calor humano */
--therapeutic-coral: #f97316
--therapeutic-coral-light: #fed7aa
```

### Cores Neutras
```css
/* Slate - Cores neutras principais */
--slate-50: #f8fafc    /* Background geral */
--slate-100: #f1f5f9   /* Borders suaves */
--slate-200: #e2e8f0   /* Borders padrão */
--slate-300: #cbd5e1
--slate-400: #94a3b8   /* Texto secundário */
--slate-500: #64748b   /* Texto terciário */
--slate-600: #475569   /* Texto secundário escuro */
--slate-700: #334155   /* Texto principal */
--slate-800: #1e293b   /* Títulos principais */
--slate-900: #0f172a
```

### Cores Funcionais
```css
/* Sucesso - Consultas realizadas, pagamentos confirmados */
--success-50: #f0fdf4   /* Background muito claro */
--success-100: #dcfce7  /* Background suave */
--success-600: #16a34a  /* Texto e ícones */
--success-700: #15803d  /* Hover states */

/* Erro - Cancelamentos, problemas */
--error-50: #fef2f2     /* Background muito claro */
--error-100: #fee2e2    /* Background suave */
--error-600: #dc2626    /* Texto e ícones */
--error-700: #b91c1c    /* Hover states */

/* Atenção - Lembretes, pendências */
--warning-50: #fffbeb   /* Background muito claro */
--warning-100: #fef3c7  /* Background suave */
--warning-600: #d97706  /* Texto e ícones */
--warning-700: #b45309  /* Hover states */

/* Informação - Orientações, novidades */
--info-50: #eff6ff      /* Background muito claro */
--info-100: #dbeafe     /* Background suave */
--info-600: #2563eb     /* Texto e ícones */
--info-700: #1d4ed8     /* Hover states */

/* Neutro - Eventos neutros, falta */
--neutral-50: #f9fafb   /* Background muito claro */
--neutral-100: #f3f4f6  /* Background suave */
--neutral-600: #6b7280  /* Texto discreto */
--neutral-700: #374151  /* Hover states */

/* Privacidade - Dados sensíveis, criptografia */
--privacy-100: #f3f4f6  /* Background neutro */
--privacy-600: #6b7280  /* Texto discreto */
--privacy-icon: #9ca3af /* Ícones de segurança */

/* Background da aplicação */
--bg-main: #f8fafc     /* Fundo geral (slate-50) */
--bg-card: #ffffff     /* Cards e containers */
--bg-soft: #f1f5f9     /* Áreas de destaque suave */
```

## Tipografia

### Família de Fontes
- **Principal**: Inter, system-ui, sans-serif (configuração padrão do Tailwind)
- **Fallback**: Segoe UI, Arial, sans-serif

### Hierarquia Tipográfica

```css
/* Títulos de Página */
.page-title {
  font-size: 1.875rem;  /* text-3xl */
  font-weight: 700;     /* font-bold */
  color: #1e293b;      /* text-slate-800 */
}

/* Títulos de Seção */
.section-title {
  font-size: 1.25rem;   /* text-xl */
  font-weight: 700;     /* font-bold */
  color: #1e293b;      /* text-slate-800 */
}

/* Texto Principal */
.body-text {
  font-size: 0.875rem;  /* text-sm */
  color: #334155;       /* text-slate-700 */
}

/* Texto Secundário */
.secondary-text {
  font-size: 0.75rem;   /* text-xs */
  color: #475569;       /* text-slate-600 */
}

/* Texto Terciário */
.tertiary-text {
  font-size: 0.75rem;   /* text-xs */
  color: #64748b;       /* text-slate-500 */
}

/* Labels */
.label-text {
  font-size: 0.875rem;  /* text-sm */
  font-weight: 500;     /* font-medium */
  color: #475569;       /* text-slate-600 */
}
```

## Componentes Especializados

### AppointmentCard
Componente para exibir informações de agendamentos na agenda do psicólogo.

```typescript
interface AppointmentCardProps {
  appointment: Appointment;
  onEdit?: (id: number) => void;
  onCancel?: (id: number) => void;
  showPatientInfo?: boolean;
  compact?: boolean;
}
```

**Estrutura Visual:**
- Background: `bg-white` com border lateral colorida conforme status
- Padding: `p-4` (compact) ou `p-6` (normal)
- Border radius: `rounded-lg`
- Shadow: `shadow-sm` com hover `shadow-md`
- Status indicator: Border esquerda com cor do status (4px)
- Borda interna sutil: `border-r border-slate-100` para separar informações
- Transição suave: `transition-all duration-200`

### PatientProfileCard
Componente para exibir perfil do paciente no prontuário.

```typescript
interface PatientProfileCardProps {
  patient: Patient;
  showSensitiveData?: boolean;
  onEdit?: () => void;
  lastSession?: SessionRecord;
}
```

**Estrutura Visual:**
- Background: `bg-gradient-to-r from-primary-50 to-white`
- Header com avatar e informações básicas
- Seção de dados sensíveis com indicador de privacidade
- Ícones de criptografia para dados protegidos

### VideoSessionCard
Componente para iniciar/gerenciar sessões de telepsicologia.

```typescript
interface VideoSessionCardProps {
  appointment: Appointment;
  sessionStatus: VideoSessionStatus;
  onStartSession: () => void;
  onEndSession: () => void;
  connectionQuality?: ConnectionQuality;
}
```

**Estrutura Visual:**
- Background dinâmico baseado no status da sessão
- Indicadores de qualidade de conexão
- Botões de controle (câmera, microfone, compartilhamento)
- Timer da sessão em tempo real

### Botões

#### Botão Primário
```css
/* Tamanho padrão (médio) */
.btn-primary {
  background: #7c3aed;     /* primary-600 unificado */
  color: white;
  padding: 0.5rem 1rem;    /* px-4 py-2 */
  border-radius: 0.5rem;   /* rounded-lg */
  font-weight: 600;        /* font-semibold */
  font-size: 0.875rem;     /* text-sm */
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-primary:hover {
  background: #6d28d9;     /* primary-700 */
}

.btn-primary:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
}

/* Tamanhos dos botões */
.btn-sm {
  padding: 0.375rem 0.75rem; /* px-3 py-1.5 */
  font-size: 0.75rem;        /* text-xs */
  border-radius: 0.375rem;   /* rounded-md */
}

.btn-md {
  padding: 0.5rem 1rem;      /* px-4 py-2 */
  font-size: 0.875rem;       /* text-sm */
  border-radius: 0.5rem;     /* rounded-lg */
}

.btn-lg {
  padding: 0.75rem 1.5rem;   /* px-6 py-3 */
  font-size: 1rem;           /* text-base */
  border-radius: 0.5rem;     /* rounded-lg */
}
```

#### Botão Secundário
```css
.btn-secondary {
  background: transparent;
  color: #7c3aed;          /* primary-600 */
  padding: 0.5rem 1rem;
  border: 1px solid #7c3aed;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #f5f3ff;     /* primary-50 */
  color: #6d28d9;          /* primary-700 */
  border-color: #6d28d9;
}

.btn-secondary:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
}
```

### Cards e Containers

#### Card Principal
```css
.card {
  background: white;
  padding: 1.5rem;         /* p-6 */
  border-radius: 1rem;     /* rounded-2xl */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);  /* shadow-sm */
}
```

#### Container da Página
```css
.page-container {
  background: #f8fafc;     /* bg-slate-50 */
  padding: 2rem;           /* p-8 */
  min-height: 100vh;
  overflow-y: auto;
}
```

### Formulários

#### Input de Texto
```css
.input-field {
  width: 100%;
  padding: 0.5rem 1rem;    /* px-4 py-2 */
  border: 1px solid #cbd5e1;  /* border-slate-300 */
  border-radius: 0.5rem;   /* rounded-lg */
  outline: none;
  font-size: 0.875rem;     /* text-sm */
  transition: all 0.2s;
}

.input-field:focus {
  border-color: #7c3aed;   /* primary-600 */
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
}

/* Estado de erro */
.input-field.error {
  border-color: #dc2626;   /* border-red-600 */
  box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.1);
}

.input-field.error:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2);
}

/* Mensagem de erro */
.error-message {
  font-size: 0.75rem;      /* text-xs */
  color: #dc2626;          /* text-red-600 */
  margin-top: 0.25rem;     /* mt-1 */
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.error-message::before {
  content: "⚠️";
  font-size: 0.625rem;
}
```

### Status e Estados Específicos

#### Status de Agendamento
```css
/* Agendado */
.status-scheduled {
  background: #dbeafe;     /* bg-blue-100 */
  color: #1d4ed8;          /* text-blue-700 */
  padding: 0.25rem 0.5rem; /* px-2 py-1 */
  border-radius: 9999px;   /* rounded-full */
  font-size: 0.75rem;      /* text-xs */
  font-weight: 600;        /* font-semibold */
}

/* Confirmado */
.status-confirmed {
  background: #dcfce7;     /* bg-green-100 */
  color: #15803d;          /* text-green-700 */
}

/* Em Atendimento */
.status-in-progress {
  background: #fed7aa;     /* bg-orange-100 */
  color: #ea580c;          /* text-orange-700 */
}

/* Realizado */
.status-completed {
  background: #d1fae5;     /* bg-emerald-100 */
  color: #059669;          /* text-emerald-600 */
}

/* Cancelado */
.status-cancelled {
  background: #fee2e2;     /* error-100 */
  color: #dc2626;          /* error-600 */
  border-left-color: #dc2626; /* error-600 para borda lateral */
}

/* Falta */
.status-no-show {
  background: #f3f4f6;     /* neutral-100 */
  color: #6b7280;          /* neutral-600 */
  border-left-color: #6b7280; /* neutral-600 para borda lateral */
}
```

#### Status de Pagamento
```css
/* Pago */
.payment-paid {
  color: #059669;          /* text-emerald-600 */
  font-weight: 600;
}

/* Pendente */
.payment-pending {
  color: #d97706;          /* text-amber-600 */
  font-weight: 600;
}

/* Cancelado */
.payment-cancelled {
  color: #dc2626;          /* error-600 */
  font-weight: 600;
}
```

#### Status de Sessão Online
```css
/* Aguardando */
.video-waiting {
  background: #fef3c7;     /* bg-amber-100 */
  color: #d97706;          /* text-amber-600 */
}

/* Ativo */
.video-active {
  background: #dcfce7;     /* bg-green-100 */
  color: #059669;          /* text-green-600 */
  animation: pulse 2s infinite;
}

/* Finalizado */
.video-ended {
  background: #f3f4f6;     /* bg-gray-100 */
  color: #6b7280;          /* text-gray-600 */
}
```

## Layout e Espaçamento

### Grid System
- Uso de CSS Grid para layouts principais
- Grid responsivo: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Gaps consistentes: `gap-6` (1.5rem)

### Espaçamentos Padrão
```css
/* Pequeno */
.spacing-sm: 0.5rem;    /* space-x-2, space-y-2 */

/* Médio */
.spacing-md: 1rem;      /* space-x-4, space-y-4 */

/* Grande */
.spacing-lg: 1.5rem;    /* space-x-6, space-y-6 */

/* Margens de seção */
.section-margin: 1.5rem; /* mb-6 */

/* Padding de container */
.container-padding: 2rem; /* p-8 */
```

## Navegação

### Sidebar
- Width fixa: `w-64`
- Background: `bg-white`
- Border: `border-r border-slate-200`
- Itens ativos: `bg-purple-600 text-white`
- Hover: `hover:bg-purple-50 hover:text-purple-600`

### Breadcrumbs
- Separador: "/"
- Cor atual: `text-slate-800`
- Cor anterior: `text-slate-500`

## Ícones

### Biblioteca
- **Lucide React** como biblioteca principal
- Tamanho padrão: 20px
- Tamanho pequeno: 16px
- Tamanho grande: 24px

### Uso por Contexto Psicológico
- **Calendar**: Agenda, agendamentos
- **Users**: Pacientes, perfis
- **Video**: Telepsicologia, sessões online
- **FileText**: Prontuário, anotações de sessão
- **Shield**: Privacidade, dados criptografados
- **Heart**: Bem-estar, saúde mental
- **Brain**: Psicologia, processos mentais
- **DollarSign**: Financeiro, pagamentos
- **Clock**: Horários, duração de sessões
- **Phone**: Contato, emergência
- **Mail**: Comunicação, lembretes
- **Lock**: Segurança, confidencialidade
- **Eye**: Visualizar dados sensíveis
- **EyeOff**: Ocultar dados sensíveis
- **MessageCircle**: Chat, comunicação durante sessão
- **Mic**: Áudio em videochamadas
- **MicOff**: Áudio mutado
- **Camera**: Vídeo ativo
- **CameraOff**: Vídeo desligado
- **MonitorSpeaker**: Compartilhamento de tela

## Responsividade

### Breakpoints (Tailwind padrão)
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

### Padrões Responsivos
```css
/* Grid adaptativo */
.responsive-grid {
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .responsive-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .responsive-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

## Elementos Específicos da Plataforma

### Indicadores de Privacidade
```css
/* Elemento para dados criptografados */
.encrypted-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

.encrypted-indicator::before {
  content: "🔒";
  font-size: 0.625rem;
}
```

### Página Pública (Agendamento)
```css
/* Estilo para a página pública do psicólogo */
.public-profile {
  background: linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%);
  min-height: 100vh;
}

.psychologist-bio {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(130, 10, 209, 0.1);
}

.available-slot {
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  transition: all 0.2s;
  cursor: pointer;
}

.available-slot:hover {
  border-color: #820AD1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(130, 10, 209, 0.15);
}

.available-slot.selected {
  border-color: #820AD1;
  background: #f5f3ff;
}
```

### Gráficos Financeiros
```typescript
// Cores específicas para gráficos financeiros
const financialChartColors = {
  income: '#16a34a',      // Verde para receitas (success-600)
  expense: '#dc2626',     // Vermelho para despesas (error-600)
  profit: '#7c3aed',      // Roxo para lucro (primary-600)
  consultation: '#2563eb', // Azul para consultas (info-600)
  grid: '#e5e7eb',
  text: '#6b7280'
};

// Configuração para gráficos de receita
const revenueChartConfig = {
  margin: { top: 20, right: 30, left: 20, bottom: 5 },
  backgroundColor: '#ffffff',
  borderRadius: '0.5rem',
  padding: '1.5rem'
};
```

## Acessibilidade e Usabilidade

### Contrastes para Contexto Terapêutico
- Texto principal sobre branco: ratio mínimo 4.5:1
- Dados sensíveis: Contraste suave para não chamar atenção desnecessária
- Indicadores de status: Cores distintas para daltonismo
- Estados de foco: Claramente visíveis sem serem agressivos

### Navegação Inclusiva
- Suporte completo a teclado (importante para acessibilidade)
- Estados de foco suaves e acolhedores
- Landmarks semânticos (nav, main, aside)
- Labels descritivos para leitores de tela
- Textos alternativos para ícones relacionados à psicologia

### Considerações Especiais
- **Dados Sensíveis**: Possibilidade de ocultar informações rapidamente
- **Modo de Privacidade**: Blur automático quando não em foco
- **Redução de Ansiedade**: Animações suaves, sem movimentos bruscos
- **Linguagem Acolhedora**: Textos e mensagens empáticos

## Implementação com Tailwind CSS v4

### Estrutura do Design System
O CliniFlow utiliza o Tailwind CSS v4 com uma arquitetura moderna baseada em `@layer`. Toda a implementação está centralizada no arquivo `src/index.css`.

### Layers Utilizadas

#### @layer theme
Define as variáveis CSS customizadas (CSS custom properties) para as cores do sistema:

```css
@layer theme {
  :root {
    /* Cores primárias unificadas */
    --primary-600: #7c3aed;  /* Cor principal para botões e interações */
    --brand-accent: #820AD1;  /* Cor especial apenas para logo */
    
    /* Cores funcionais expandidas */
    --success-600: #16a34a;
    --error-600: #dc2626;
    --warning-600: #d97706;
    --info-600: #2563eb;
    --neutral-600: #6b7280;
  }
}
```

#### @layer components
Define os componentes reutilizáveis do sistema usando `@apply`:

```css
@layer components {
  .btn-primary {
    @apply btn bg-purple-600 text-white shadow-sm;
    @apply hover:bg-purple-700 focus:ring-2 focus:ring-purple-600/20;
  }
  
  .card {
    @apply bg-white p-6 rounded-2xl shadow-sm;
  }
  
  .input-field {
    @apply w-full px-4 py-2 text-sm border border-slate-300 rounded-lg;
    @apply focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20;
  }
}
```

### Componentes Base Implementados

#### Sistema de Botões
- `.btn` - Classe base para todos os botões
- `.btn-primary` - Botão principal (roxo)
- `.btn-secondary` - Botão secundário (outline)
- `.btn-sm`, `.btn-md`, `.btn-lg` - Tamanhos diferentes

#### Sistema de Cards
- `.card` - Card base com padding e sombra
- `.appointment-card` - Card especializado para agendamentos
- `.page-container` - Container principal das páginas

#### Sistema de Formulários
- `.input-field` - Input base com estados de foco
- `.input-field.error` - Estado de erro com borda vermelha
- `.error-message` - Mensagem de erro com ícone
- `.label-text` - Labels dos formulários

#### Sistema de Status
- `.status-badge` - Badge base para status
- `.status-*` - Classes específicas para cada status
- `.appointment-card.*` - Cards com bordas coloridas por status

### Convenções de Classes

#### Nomenclatura BEM-like
```css
/* Componente */
.component-name { }

/* Elemento */
.component-name__element { }

/* Modificador */
.component-name--modifier { }
```

#### Utility Classes Customizadas
```css
/* Cores da marca */
.text-brand { @apply text-purple-600; }     /* primary-600 */
.bg-brand { @apply bg-purple-600; }         /* primary-600 */
.border-brand { @apply border-purple-600; } /* primary-600 */

/* Estados funcionais */
.text-success { @apply text-green-600; }    /* success-600 */
.text-error { @apply text-red-600; }        /* error-600 */
.text-warning { @apply text-amber-600; }    /* warning-600 */
.text-info { @apply text-blue-600; }        /* info-600 */
.text-neutral { @apply text-gray-600; }     /* neutral-600 */

/* Tipografia */
.page-title { @apply text-3xl font-bold text-slate-800; }
.section-title { @apply text-xl font-bold text-slate-800; }
.body-text { @apply text-sm text-slate-700; }
.secondary-text { @apply text-xs text-slate-600; }
.tertiary-text { @apply text-xs text-slate-500; }
```

### Benefícios da Implementação

1. **Centralização**: Todo o design system está em um local
2. **Consistência**: Uso de `@apply` garante uniformidade
3. **Manutenibilidade**: Mudanças em um local refletem em todo o sistema
4. **Performance**: Tailwind v4 otimiza automaticamente o CSS final
5. **Acessibilidade**: Estados de foco e erro padronizados
6. **Flexibilidade**: Fácil extensão com novas classes utilitárias

### Como Usar

#### Em Componentes React
```jsx
// Botão principal
<button className="btn-primary btn-md">
  Agendar Consulta
</button>

// Card de agendamento
<div className="appointment-card confirmed">
  <h3 className="section-title">Consulta com João</h3>
  <p className="body-text">14:00 - 15:00</p>
  <span className="status-confirmed">Confirmado</span>
</div>

// Formulário com erro
<div>
  <label className="label-text">Nome do paciente</label>
  <input className="input-field error" />
  <p className="error-message">Nome é obrigatório</p>
</div>
```

#### Combinando com Classes Tailwind
```jsx
// Combinação de classe customizada com utilitários
<div className="card mt-6 lg:mt-8">
  <h2 className="section-title mb-4">Estatísticas</h2>
  <button className="btn-primary btn-sm ml-auto">
    Ver Mais
  </button>
</div>
```

## Melhorias Implementadas (Dezembro 2024)

### 1. Unificação das Cores Primárias
✓ **Antes**: Duas cores concorrentes (`primary-600: #7c3aed` e `brand-primary: #820AD1`)
✓ **Depois**: 
- `primary-600: #7c3aed` como cor principal unificada para todas as interações
- `brand-accent: #820AD1` reservada apenas para logo e elementos gráficos específicos

### 2. Correção da Hierarquia Tipográfica
✓ **Problema**: Contraste inconsistente entre textos secundários e terciários
✓ **Solução**:
- `body-text`: `text-slate-700` (mais escuro, melhor contraste)
- `secondary-text`: `text-slate-600` (intermediário)
- `tertiary-text`: `text-slate-500` (mais claro, hierarquia correta)
- `label-text`: `text-slate-600` (consistência)

### 3. Sistema de Botões Expandido
✓ **Adicionado**: Três tamanhos padronizados
- `btn-sm`: Elementos compactos (px-3 py-1.5, text-xs)
- `btn-md`: Tamanho padrão (px-4 py-2, text-sm)
- `btn-lg`: Botões de destaque (px-6 py-3, text-base)

✓ **Melhorado**: Estados de foco com ring shadow para acessibilidade

### 4. Estados de Erro para Formulários
✓ **Adicionado**: Estados visuais completos
- `.input-field.error`: Borda vermelha com focus ring
- `.error-message`: Mensagem padronizada com ícone de aviso
- Transições suaves para melhor UX

### 5. AppointmentCard Aprimorado
✓ **Melhorado**: Estrutura visual mais definida
- Borda lateral colorida por status (4px)
- Borda interna sutil para separação de conteúdo
- Transições suaves em hover
- Classes específicas por status

### 6. Cores de Status Alinhadas
✓ **Expandido**: Paleta funcional completa
- **Sucesso**: `success-600: #16a34a` (verde)
- **Erro**: `error-600: #dc2626` (vermelho) - novo
- **Atenção**: `warning-600: #d97706` (laranja)
- **Informação**: `info-600: #2563eb` (azul)
- **Neutro**: `neutral-600: #6b7280` (cinza) - novo

✓ **Consistência**: Todas as variações (50, 100, 600, 700) para cada cor

### 7. Implementação Tailwind v4 Moderna
✓ **Estrutura**: Uso de `@layer theme` e `@layer components`
✓ **Centralização**: Todo o sistema em `src/index.css`
✓ **Performance**: Otimização automática do Tailwind v4
✓ **Manutenibilidade**: Fácil edição e extensão

### 8. Utilidades Customizadas Expandidas
✓ **Adicionado**: Classes de utilidade semânticas
- `.text-brand`, `.bg-brand`, `.border-brand`
- `.text-success`, `.text-error`, `.text-warning`, `.text-info`, `.text-neutral`
- Tipografia completa (`.page-title`, `.section-title`, etc.)

### Impacto das Melhorias

#### Consistência Visual
- ✓ Unificação da cor principal elimina confusão
- ✓ Hierarquia tipográfica clara e lógica
- ✓ Paleta de status coesa e expansiva

#### Usabilidade
- ✓ Estados de erro claros e informativos
- ✓ Botões com tamanhos apropriados para contexto
- ✓ Cards com melhor separação visual

#### Acessibilidade
- ✓ Estados de foco visíveis em todos os elementos interativos
- ✓ Contraste melhorado na hierarquia de texto
- ✓ Indicadores visuais claros para estados de erro

#### Desenvolvedores
- ✓ Sistema centralizado e fácil de manter
- ✓ Classes semânticas e intuitivas
- ✓ Documentação completa com exemplos de uso
- ✓ Implementação moderna com Tailwind v4

### Próximos Passos Recomendados

1. **Testes**: Validar a implementação em componentes existentes
2. **Migração**: Atualizar componentes para usar as novas classes
3. **Documentação**: Criar guia de uso para a equipe
4. **Design Tokens**: Considerar extensão para outros elementos (shadows, spacing, etc.)

> **Nota**: Todas as melhorias mantiveram compatibilidade com a estrutura existente, garantindo uma transição suave e sem quebras.
