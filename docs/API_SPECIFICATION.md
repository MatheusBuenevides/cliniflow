# Especificação da API - CliniFlow

## Visão Geral

Esta especificação define a API RESTful para o CliniFlow, uma plataforma completa para psicólogos. A API oferece endpoints para agendamento online, prontuário eletrônico, telepsicologia e gestão financeira.

### Base URL
```
Produção: https://api.cliniflow.com/v1
Desenvolvimento: http://localhost:3000/api/v1
```

### Autenticação
A API utiliza autenticação baseada em JWT (JSON Web Tokens).

```http
Authorization: Bearer <token>
```

## Convenções Gerais

### Formato de Resposta
```typescript
// Sucesso
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Erro
interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### Códigos de Status HTTP
- `200` - OK (sucesso)
- `201` - Created (criado)
- `204` - No Content (sem conteúdo, para DELETE)
- `400` - Bad Request (dados inválidos)
- `401` - Unauthorized (não autenticado)
- `403` - Forbidden (sem permissão)
- `404` - Not Found (não encontrado)
- `409` - Conflict (conflito, ex: horário já ocupado)
- `422` - Unprocessable Entity (validação falhou)
- `500` - Internal Server Error (erro interno)

## Autenticação

### POST /auth/login
Login do psicólogo

**Request:**
```json
{
  "email": "ana.silva@email.com",
  "password": "senha123",
  "rememberMe": true
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Ana Silva",
      "email": "ana.silva@email.com",
      "crp": "CRP 06/123456",
      "customUrl": "ana-silva",
      "avatar": "https://api.cliniflow.com/uploads/avatars/1.jpg"
    },
    "expiresIn": 86400
  }
}
```

### POST /auth/register
Registro de novo psicólogo

**Request:**
```json
{
  "name": "João Santos",
  "email": "joao@email.com",
  "password": "senha123",
  "crp": "CRP 06/654321",
  "phone": "(11) 99999-9999",
  "customUrl": "joao-santos"
}
```

### POST /auth/refresh
Renovar token

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "new_access_token",
    "expiresIn": 86400
  }
}
```

## Página Pública de Agendamento

### GET /public/:customUrl
Obter perfil público do psicólogo

**Response (200):**
```json
{
  "success": true,
  "data": {
    "psychologistId": 1,
    "customUrl": "ana-silva",
    "name": "Ana Silva",
    "crp": "CRP 06/123456",
    "avatar": "https://api.cliniflow.com/uploads/avatars/1.jpg",
    "bio": "Psicóloga clínica com abordagem cognitivo-comportamental...",
    "specialties": ["Ansiedade", "Depressão", "Relacionamentos"],
    "sessionPrices": {
      "initial": 200.00,
      "followUp": 180.00,
      "online": 160.00,
      "duration": 50
    }
  }
}
```

### GET /public/:customUrl/availability
Verificar disponibilidade de horários

**Query Parameters:**
- `startDate` (string): Data inicial (YYYY-MM-DD)
- `endDate` (string): Data final (YYYY-MM-DD)
- `modality` (string): online | inPerson

**Response (200):**
```json
{
  "success": true,
  "data": {
    "availableSlots": [
      {
        "date": "2024-07-25",
        "time": "09:00",
        "duration": 50,
        "modality": "inPerson",
        "price": 200.00
      },
      {
        "date": "2024-07-25",
        "time": "10:00",
        "duration": 50,
        "modality": "online",
        "price": 160.00
      }
    ]
  }
}
```

### POST /public/:customUrl/appointments
Agendar consulta (acesso público)

**Request:**
```json
{
  "patientName": "Maria Santos",
  "patientEmail": "maria@email.com",
  "patientPhone": "(11) 98765-4321",
  "birthDate": "1990-05-15",
  "selectedSlot": {
    "date": "2024-07-25",
    "time": "09:00",
    "duration": 50,
    "modality": "inPerson",
    "price": 200.00
  },
  "isFirstTime": true,
  "notes": "Primeira consulta para ansiedade"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "appointmentId": 123,
    "confirmationCode": "ABC123",
    "paymentLink": "https://pay.cliniflow.com/link/xyz789"
  },
  "message": "Agendamento realizado com sucesso. Verifique seu e-mail para confirmação."
}
```

## Pacientes

### GET /patients
Listar pacientes do psicólogo

**Query Parameters:**
- `page`, `limit`: Paginação
- `search`: Busca por nome, email ou telefone
- `sortBy`: name | createdAt | lastAppointment
- `sortOrder`: asc | desc

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Maria Santos",
      "email": "maria@email.com",
      "phone": "(11) 98765-4321",
      "birthDate": "1990-05-15",
      "lastAppointment": "2024-07-20T09:00:00Z",
      "totalSessions": 8,
      "status": "active",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### GET /patients/:id
Obter detalhes do paciente

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Maria Santos",
    "email": "maria@email.com",
    "phone": "(11) 98765-4321",
    "birthDate": "1990-05-15",
    "cpf": "123.456.789-00",
    "address": {
      "street": "Rua das Flores, 123",
      "neighborhood": "Centro",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01234-567"
    },
    "maritalStatus": "Solteira",
    "profession": "Engenheira",
    "emergencyContact": {
      "name": "João Santos",
      "relationship": "Irmão",
      "phone": "(11) 99999-8888"
    },
    "medicalHistory": {
      "medications": ["Sertralina 50mg"],
      "psychiatricHistory": "Episódio depressivo em 2020",
      "allergies": ["Dipirona"],
      "observations": "Histórico familiar de ansiedade"
    },
    "totalSessions": 8,
    "lastAppointment": "2024-07-20T09:00:00Z",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

### PUT /patients/:id
Atualizar dados do paciente

### DELETE /patients/:id
Remover paciente (soft delete)

## Agendamentos

### GET /appointments
Listar agendamentos do psicólogo

**Query Parameters:**
- `startDate`, `endDate`: Período
- `status`: scheduled | confirmed | inProgress | completed | cancelled | noShow
- `modality`: inPerson | online
- `paymentStatus`: pending | paid | cancelled | refunded
- `patientId`: Filtrar por paciente

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "patientId": 1,
      "patient": {
        "id": 1,
        "name": "Maria Santos",
        "phone": "(11) 98765-4321",
        "email": "maria@email.com"
      },
      "date": "2024-07-25",
      "time": "09:00",
      "duration": 50,
      "type": "followUp",
      "modality": "inPerson",
      "status": "confirmed",
      "price": 180.00,
      "paymentStatus": "paid",
      "notes": "Retorno para acompanhamento",
      "createdAt": "2024-07-20T15:30:00Z"
    }
  ]
}
```

### POST /appointments
Criar agendamento manual

**Request:**
```json
{
  "patientId": 1,
  "date": "2024-07-26",
  "time": "10:00",
  "duration": 50,
  "type": "followUp",
  "modality": "online",
  "price": 160.00,
  "notes": "Sessão online"
}
```

### PUT /appointments/:id
Atualizar agendamento

### PUT /appointments/:id/status
Atualizar status do agendamento

**Request:**
```json
{
  "status": "completed",
  "notes": "Sessão realizada com sucesso"
}
```

### DELETE /appointments/:id
Cancelar agendamento

### GET /appointments/calendar
Obter agenda em formato de calendário

**Query Parameters:**
- `year`, `month`: Período específico
- `view`: day | week | month

**Response (200):**
```json
{
  "success": true,
  "data": {
    "2024-07-25": [
      {
        "id": 1,
        "time": "09:00",
        "duration": 50,
        "patient": "Maria S.",
        "type": "followUp",
        "status": "confirmed",
        "modality": "inPerson"
      }
    ]
  }
}
```

## Prontuário e Sessões

### GET /patients/:patientId/sessions
Obter histórico de sessões do paciente

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "appointmentId": 1,
      "sessionNumber": 8,
      "date": "2024-07-20",
      "duration": 50,
      "mainComplaint": "Ansiedade relacionada ao trabalho",
      "tags": ["ansiedade", "trabalho", "TCC"],
      "hasAttachments": true,
      "createdAt": "2024-07-20T10:00:00Z"
    }
  ]
}
```

### GET /sessions/:id
Obter detalhes da sessão (dados criptografados)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "appointmentId": 1,
    "patientId": 1,
    "sessionNumber": 8,
    "date": "2024-07-20",
    "duration": 50,
    "mainComplaint": "Ansiedade relacionada ao trabalho",
    "clinicalObservations": "[ENCRYPTED_DATA]",
    "therapeuticPlan": "[ENCRYPTED_DATA]",
    "evolution": "[ENCRYPTED_DATA]",
    "homeworkAssigned": "[ENCRYPTED_DATA]",
    "tags": ["ansiedade", "trabalho", "TCC"],
    "attachments": [
      {
        "id": 1,
        "fileName": "teste_beck.pdf",
        "fileSize": 1024000,
        "uploadedAt": "2024-07-20T10:30:00Z"
      }
    ]
  }
}
```

### POST /sessions
Criar registro de sessão

**Request:**
```json
{
  "appointmentId": 1,
  "mainComplaint": "Ansiedade relacionada ao trabalho",
  "clinicalObservations": "Paciente apresentou melhora...",
  "therapeuticPlan": "Continuar com técnicas de relaxamento...",
  "evolution": "Progresso significativo na gestão da ansiedade",
  "homeworkAssigned": "Praticar respiração diafragmática",
  "tags": ["ansiedade", "trabalho", "TCC"]
}
```

### PUT /sessions/:id
Atualizar registro de sessão

### POST /sessions/:id/attachments
Upload de anexo na sessão

**Request:** multipart/form-data
- `file`: Arquivo (PDF, imagem, documento)
- `description`: Descrição do arquivo

### GET /sessions/tags
Obter tags utilizadas pelo psicólogo

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "ansiedade",
      "color": "#ff6b6b",
      "usage": 15
    },
    {
      "id": 2,
      "name": "depressão",
      "color": "#4ecdc4",
      "usage": 8
    }
  ]
}
```

## Telepsicologia

### POST /video-sessions
Criar sala de videochamada

**Request:**
```json
{
  "appointmentId": 1,
  "recordingEnabled": false
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "sessionId": "vs_abc123",
    "roomId": "room_xyz789",
    "psychologistLink": "https://video.cliniflow.com/room/xyz789?token=psy_token",
    "patientLink": "https://video.cliniflow.com/room/xyz789?token=pat_token",
    "expiresAt": "2024-07-25T10:00:00Z"
  }
}
```

### GET /video-sessions/:sessionId
Obter detalhes da sessão de vídeo

### PUT /video-sessions/:sessionId/status
Atualizar status da sessão

**Request:**
```json
{
  "status": "active",
  "startTime": "2024-07-25T09:00:00Z"
}
```

### GET /video-sessions/:sessionId/chat
Obter mensagens do chat

### POST /video-sessions/:sessionId/chat
Enviar mensagem no chat

**Request:**
```json
{
  "message": "Link para exercício: https://example.com/exercise",
  "type": "link"
}
```

## Financeiro

### GET /financial/dashboard
Dashboard financeiro

**Query Parameters:**
- `startDate`, `endDate`: Período
- `groupBy`: day | week | month | year

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2024-07-01",
      "end": "2024-07-31"
    },
    "income": {
      "total": 5400.00,
      "consultations": 30,
      "averagePerConsultation": 180.00
    },
    "expenses": {
      "total": 1200.00
    },
    "netProfit": 4200.00,
    "monthlyRevenue": [
      {
        "month": "2024-07",
        "amount": 5400.00,
        "consultations": 30
      }
    ],
    "paymentStatus": {
      "paid": 28,
      "pending": 2,
      "overdue": 0
    }
  }
}
```

### GET /financial/transactions
Listar transações

**Query Parameters:**
- `startDate`, `endDate`: Período
- `type`: income | expense
- `category`: consultation | supervision | rent | etc.
- `status`: pending | completed | cancelled

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "appointmentId": 1,
      "type": "income",
      "category": "consultation",
      "description": "Consulta - Maria Santos",
      "amount": 180.00,
      "date": "2024-07-25",
      "paymentMethod": "pix",
      "status": "completed",
      "receipt": "https://api.cliniflow.com/receipts/1.pdf"
    }
  ]
}
```

### POST /financial/transactions
Criar transação manual

**Request:**
```json
{
  "type": "expense",
  "category": "rent",
  "description": "Aluguel do consultório - Julho",
  "amount": 800.00,
  "date": "2024-07-01",
  "paymentMethod": "transfer"
}
```

### PUT /financial/transactions/:id
Atualizar transação

### DELETE /financial/transactions/:id
Remover transação

## Pagamentos

### POST /payments/links
Criar link de pagamento

**Request:**
```json
{
  "appointmentId": 1,
  "amount": 180.00,
  "description": "Consulta de retorno - Maria Santos",
  "dueDate": "2024-07-25",
  "methods": ["creditCard", "pix", "boleto"]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "linkId": "link_abc123",
    "url": "https://pay.cliniflow.com/link/abc123",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "expiresAt": "2024-07-25T23:59:59Z"
  }
}
```

### GET /payments/links/:linkId
Obter status do link de pagamento

### POST /payments/process
Processar pagamento

**Request:**
```json
{
  "linkId": "link_abc123",
  "method": "pix",
  "amount": 180.00
}
```

### GET /payments/history
Histórico de pagamentos

## Configurações

### GET /settings
Obter configurações do psicólogo

**Response (200):**
```json
{
  "success": true,
  "data": {
    "psychologist": {
      "id": 1,
      "name": "Ana Silva",
      "crp": "CRP 06/123456",
      "customUrl": "ana-silva",
      "bio": "Psicóloga especializada em TCC...",
      "specialties": ["Ansiedade", "Depressão"]
    },
    "workingHours": {
      "monday": { "start": "08:00", "end": "18:00" },
      "tuesday": { "start": "08:00", "end": "18:00" },
      "wednesday": null,
      "thursday": { "start": "08:00", "end": "18:00" },
      "friday": { "start": "08:00", "end": "16:00" },
      "saturday": null,
      "sunday": null
    },
    "sessionPrices": {
      "initial": 200.00,
      "followUp": 180.00,
      "online": 160.00,
      "duration": 50
    },
    "notifications": {
      "emailReminders": true,
      "whatsappReminders": false,
      "reminderHours": 24
    },
    "appointment": {
      "allowOnlineBooking": true,
      "bookingAdvanceDays": 30,
      "cancellationHours": 24,
      "bufferMinutes": 15
    }
  }
}
```

### PUT /settings
Atualizar configurações

### POST /settings/working-hours/block
Bloquear horários específicos

**Request:**
```json
{
  "startDate": "2024-08-01",
  "endDate": "2024-08-15",
  "reason": "Férias de verão",
  "type": "vacation"
}
```

## Relatórios

### GET /reports/appointments
Relatório de agendamentos

**Query Parameters:**
- `startDate`, `endDate`: Período
- `format`: json | pdf | excel

### GET /reports/financial
Relatório financeiro detalhado

### GET /reports/patients
Relatório de pacientes

## Notificações

### GET /notifications
Listar notificações

### PUT /notifications/:id/read
Marcar como lida

### POST /notifications/send
Enviar notificação personalizada

**Request:**
```json
{
  "type": "appointment_reminder",
  "appointmentId": 1,
  "channel": "email",
  "customMessage": "Lembrete personalizado da consulta"
}
```

## Uploads

### POST /uploads/avatar
Upload de avatar

### POST /uploads/documents
Upload de documentos do paciente

## Webhooks

### Eventos Disponíveis
- `appointment.created`
- `appointment.cancelled`
- `payment.completed`
- `video_session.started`
- `video_session.ended`

### Configuração
```json
{
  "url": "https://myapp.com/webhooks",
  "events": ["payment.completed"],
  "secret": "webhook_secret"
}
```

## Rate Limiting

- **Geral**: 1000 requests/hour
- **Agendamento público**: 100 requests/hour por IP
- **Upload**: 20 uploads/hour

## Códigos de Erro

### Negócio
- `APPOINTMENT_001`: Horário não disponível
- `APPOINTMENT_002`: Fora do horário de funcionamento
- `PAYMENT_001`: Pagamento já processado
- `VIDEO_001`: Sessão não encontrada
- `PATIENT_001`: Paciente não pertence ao psicólogo

### Validação
- `VAL_001`: CRP inválido
- `VAL_002`: URL personalizada já existe
- `VAL_003`: Horário inválido
- `VAL_004`: Email já cadastrado