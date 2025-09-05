# Arquitetura do CliniFlow

## Visão Geral

O CliniFlow é uma plataforma completa para psicólogos, desenvolvida com React 19, TypeScript e Tailwind CSS v4. O sistema oferece agendamento online, prontuário eletrônico, sessões de telepsicologia e gestão financeira, tudo em uma interface moderna e intuitiva.

## Stack Tecnológica

### Frontend
- **React 19** - Framework principal para UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS v4** - Framework CSS utility-first (sem config)
- **Lucide React** - Biblioteca de ícones
- **Recharts** - Visualização de dados financeiros
- **WebRTC** - Videoconferência para telepsicologia

### Backend (Planejado)
- **Node.js** - Runtime do servidor
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados principal
- **Socket.io** - Comunicação em tempo real
- **JWT** - Autenticação
- **Stripe/PagSeguro** - Gateway de pagamento

### Estrutura de Pastas

```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas do sistema
├── hooks/         # Custom hooks
├── services/      # Serviços de API e integrações
├── stores/        # Gerenciamento de estado
├── types/         # Definições de tipos TypeScript
├── utils/         # Utilitários e helpers
├── assets/        # Imagens, ícones, etc.
├── App.tsx        # Componente principal
├── main.tsx       # Entry point
└── index.css      # Estilos globais com Tailwind
```

## Padrões Arquiteturais

### 1. Component-Based Architecture
- Cada funcionalidade principal é um componente isolado
- Componentes reutilizáveis na pasta `components/`
- Páginas específicas na pasta `pages/`

### 2. Estado da Aplicação
- Estado local com useState para componentes simples
- Context API ou Zustand para estado global
- Dados mockados temporariamente (migração para API real planejada)

### 3. Tipagem
- Interfaces TypeScript para todos os dados
- Props components tipadas
- Tipos centralizados na pasta `types/`

## Módulos Principais

### 1. Agendamento Online e Gestão de Agenda
- **Propósito**: Portal público e gestão de agenda do psicólogo
- **Página Pública**: URL personalizada (clinicflow.com/nomedopsicologo)
- **Funcionalidades**: Agenda em tempo real, agendamento automático, bloqueio de horários
- **Notificações**: Lembretes automáticos por e-mail/WhatsApp

### 2. Prontuário Eletrônico e Fichas de Pacientes
- **Propósito**: Gestão segura dos registros clínicos
- **Funcionalidades**: Ficha automática via agendamento, anotações criptografadas, anexos
- **Segurança**: Criptografia end-to-end, tags para categorização
- **Dados**: Informações pessoais, histórico, contato de emergência

### 3. Sessões Online (Telepsicologia)
- **Propósito**: Plataforma integrada para atendimento remoto
- **Funcionalidades**: Videoconferência segura, chat em tempo real, compartilhamento de tela
- **Segurança**: Salas virtuais únicas, criptografia ponta a ponta
- **Acesso**: Links únicos por sessão, sem instalação de apps

### 4. Módulo Financeiro e Pagamentos
- **Propósito**: Controle completo das finanças do psicólogo
- **Funcionalidades**: Controle de receitas/despesas, relatórios fiscais, gateway de pagamento
- **Pagamentos**: Cartão, PIX, boleto com links automáticos
- **Relatórios**: Fluxo de caixa, declaração de IR

## Integração com Backend

### Estrutura de API Planejada
- **Node.js/Express** como backend
- **PostgreSQL** para dados estruturados
- **Redis** para cache e sessões
- **Socket.io** para tempo real (agenda, videochamadas)
- Integração via services na pasta `services/`
- Endpoints RESTful para cada módulo

### Dados Principais do Sistema
- **Psicólogo**: Perfil, especialidades, horários de trabalho
- **Pacientes**: Dados pessoais, histórico, fichas
- **Agendamentos**: Horários, status, tipos de sessão
- **Sessões**: Anotações criptografadas, anexos
- **Financeiro**: Transações, relatórios, configurações de pagamento

## Design System

### Paleta de Cores Principal
- **Primária**: Purple (#820AD1, #7C3AED)
- **Secundária**: Slate (#64748B, #475569)
- **Sucesso**: Green (#059669)
- **Aviso**: Yellow/Orange (#D97706)
- **Neutros**: Slate (50, 100, 200, 300, etc.)

### Componentes Base
- **InfoCard**: Cards informativos com ícone, título e valor
- **Sidebar**: Navegação lateral fixa
- **Header**: Cabeçalho com ações principais

### Responsividade
- Design mobile-first
- Breakpoints padrão do Tailwind
- Grid layouts adaptativos

## Performance e Otimizações

### Vite Configuration
- Build otimizado para produção
- Hot Module Replacement (HMR) em desenvolvimento
- Lazy loading planejado para componentes de página

### React Otimizations
- useState para estado local simples
- Memo para componentes custosos (quando necessário)
- Keys adequadas em listas

## Segurança e Autenticação

### Planejado
- Sistema de autenticação com JWT
- Proteção de rotas
- Validação de permissões por tipo de usuário

## Arquitetura de Segurança

### Criptografia e Privacidade
- **Dados Sensíveis**: Anotações de sessão criptografadas end-to-end
- **Comunicação**: HTTPS obrigatório, certificados SSL
- **Videoconferência**: WebRTC com criptografia nativa
- **Armazenamento**: Dados pessoais em conformidade com LGPD

### Autenticação e Autorização
- **JWT**: Tokens com expiração automática
- **2FA**: Autenticação de dois fatores opcional
- **Sessões**: Controle de sessões ativas
- **Logs**: Auditoria de acessos e modificações

## Próximos Passos

1. **Desenvolvimento da Página Pública**
   - Criação da URL personalizada por psicólogo
   - Interface de agendamento para pacientes
   - Integração com agenda em tempo real

2. **Sistema de Videoconferência**
   - Implementação WebRTC
   - Salas virtuais seguras
   - Chat em tempo real durante sessões

3. **Gateway de Pagamentos**
   - Integração com Stripe/PagSeguro
   - Processamento automático de pagamentos
   - Links de pagamento personalizados

## Convenções de Desenvolvimento

### Nomenclatura
- **Componentes**: PascalCase (Ex: `AppointmentCard`, `VideoRoom`)
- **Hooks**: camelCase com prefixo use (Ex: `useAppointments`, `useVideoCall`)
- **Types**: PascalCase (Ex: `Patient`, `Appointment`, `VideoSession`)
- **Services**: camelCase (Ex: `appointmentService`, `paymentService`)

### Estrutura de Arquivos
- Um componente por arquivo
- Co-localização de arquivos relacionados
- Barrel exports (index.ts) quando apropriado
