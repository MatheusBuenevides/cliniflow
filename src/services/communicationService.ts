import { apiClient } from './api';

// Interfaces para comunicação
export interface CommunicationMessage {
  id: string;
  type: 'email' | 'sms' | 'whatsapp';
  recipient: {
    name: string;
    email?: string;
    phone?: string;
  };
  subject?: string;
  content: string;
  status: 'scheduled' | 'sent' | 'delivered' | 'read' | 'failed' | 'bounced';
  scheduledFor: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  failedAt?: string;
  errorMessage?: string;
  bounceReason?: string;
  retryCount?: number;
  nextRetryAt?: string;
  providerResponse?: any;
  trackingId?: string;
  openCount?: number;
  clickCount?: number;
  unsubscribeCount?: number;
  trigger?: {
    type: string;
    appointmentId?: number;
    hoursBefore?: number;
  };
  createdAt: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'whatsapp';
  event: string;
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
  isDefault: boolean;
  psychologistId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommunicationConfig {
  emailProvider: 'sendgrid' | 'mailgun' | 'ses';
  smsProvider: 'twilio' | 'aws_sns';
  whatsappProvider: 'whatsapp_business' | 'twilio_whatsapp';
  defaultFromEmail: string;
  defaultFromName: string;
  replyToEmail: string;
  webhookUrl?: string;
  retryAttempts: number;
  retryDelay: number; // em minutos
  enableTracking: boolean;
  enableUnsubscribe: boolean;
  complianceSettings: {
    gdprCompliant: boolean;
    canadaAntiSpam: boolean;
    brazilLGPD: boolean;
  };
}

export interface DeliveryAnalytics {
  period: {
    start: string;
    end: string;
  };
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  totalFailed: number;
  totalBounced: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  byType: {
    email: {
      sent: number;
      delivered: number;
      opened: number;
      clicked: number;
      bounced: number;
    };
    sms: {
      sent: number;
      delivered: number;
      failed: number;
    };
    whatsapp: {
      sent: number;
      delivered: number;
      read: number;
      failed: number;
    };
  };
  byDay: Array<{
    date: string;
    sent: number;
    delivered: number;
    failed: number;
  }>;
}

// Serviço de Comunicação
export class CommunicationService {
  private baseUrl = '/communication';

  // ===== TEMPLATES =====

  // Buscar templates
  async getTemplates(filters?: {
    type?: 'email' | 'sms' | 'whatsapp';
    event?: string;
    isActive?: boolean;
  }): Promise<MessageTemplate[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.event) params.append('event', filters.event);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());

    const response = await apiClient.get<MessageTemplate[]>(
      `${this.baseUrl}/templates?${params.toString()}`
    );
    return response.data;
  }

  // Criar template
  async createTemplate(template: Omit<MessageTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<MessageTemplate> {
    const response = await apiClient.post<MessageTemplate>(`${this.baseUrl}/templates`, template);
    return response.data;
  }

  // Atualizar template
  async updateTemplate(id: string, updates: Partial<MessageTemplate>): Promise<MessageTemplate> {
    const response = await apiClient.put<MessageTemplate>(`${this.baseUrl}/templates/${id}`, updates);
    return response.data;
  }

  // Excluir template
  async deleteTemplate(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/templates/${id}`);
  }

  // Duplicar template
  async duplicateTemplate(id: string, newName: string): Promise<MessageTemplate> {
    const response = await apiClient.post<MessageTemplate>(`${this.baseUrl}/templates/${id}/duplicate`, {
      name: newName
    });
    return response.data;
  }

  // ===== MENSAGENS =====

  // Enviar mensagem imediata
  async sendMessage(message: {
    type: 'email' | 'sms' | 'whatsapp';
    recipient: {
      name: string;
      email?: string;
      phone?: string;
    };
    subject?: string;
    content: string;
    templateId?: string;
    variables?: Record<string, string>;
    attachments?: File[];
  }): Promise<CommunicationMessage> {
    const formData = new FormData();
    formData.append('type', message.type);
    formData.append('recipient', JSON.stringify(message.recipient));
    if (message.subject) formData.append('subject', message.subject);
    formData.append('content', message.content);
    if (message.templateId) formData.append('templateId', message.templateId);
    if (message.variables) formData.append('variables', JSON.stringify(message.variables));
    
    if (message.attachments) {
      message.attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });
    }

    const response = await apiClient.post<CommunicationMessage>(`${this.baseUrl}/send`, formData);
    return response.data;
  }

  // Agendar mensagem
  async scheduleMessage(message: {
    type: 'email' | 'sms' | 'whatsapp';
    recipient: {
      name: string;
      email?: string;
      phone?: string;
    };
    subject?: string;
    content: string;
    scheduledFor: string;
    templateId?: string;
    variables?: Record<string, string>;
    trigger?: {
      type: string;
      appointmentId?: number;
      hoursBefore?: number;
    };
    recurrence?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      interval: number;
      endDate?: string;
    };
  }): Promise<CommunicationMessage> {
    const response = await apiClient.post<CommunicationMessage>(`${this.baseUrl}/schedule`, message);
    return response.data;
  }

  // Buscar mensagens
  async getMessages(filters?: {
    type?: 'email' | 'sms' | 'whatsapp';
    status?: string;
    startDate?: string;
    endDate?: string;
    recipient?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    messages: CommunicationMessage[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.recipient) params.append('recipient', filters.recipient);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await apiClient.get<{
      messages: CommunicationMessage[];
      total: number;
      page: number;
      totalPages: number;
    }>(`${this.baseUrl}/messages?${params.toString()}`);
    return response.data;
  }

  // Cancelar mensagem agendada
  async cancelMessage(messageId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/messages/${messageId}`);
  }

  // Tentar reenviar mensagem
  async retryMessage(messageId: string): Promise<CommunicationMessage> {
    const response = await apiClient.post<CommunicationMessage>(`${this.baseUrl}/messages/${messageId}/retry`);
    return response.data;
  }

  // ===== AUTOMAÇÕES =====

  // Configurar automação de lembrete de consulta
  async setupAppointmentReminder(appointmentId: number, config: {
    emailReminder: boolean;
    smsReminder: boolean;
    whatsappReminder: boolean;
    reminderHours: number[];
    templateIds?: {
      email?: string;
      sms?: string;
      whatsapp?: string;
    };
  }): Promise<void> {
    await apiClient.post(`${this.baseUrl}/automations/appointment-reminder`, {
      appointmentId,
      config
    });
  }

  // Configurar automação de lembrete de pagamento
  async setupPaymentReminder(paymentId: string, config: {
    emailReminder: boolean;
    smsReminder: boolean;
    whatsappReminder: boolean;
    reminderHours: number[];
    templateIds?: {
      email?: string;
      sms?: string;
      whatsapp?: string;
    };
  }): Promise<void> {
    await apiClient.post(`${this.baseUrl}/automations/payment-reminder`, {
      paymentId,
      config
    });
  }

  // Configurar automação de follow-up
  async setupFollowUp(appointmentId: number, config: {
    emailFollowUp: boolean;
    smsFollowUp: boolean;
    whatsappFollowUp: boolean;
    followUpDays: number;
    templateIds?: {
      email?: string;
      sms?: string;
      whatsapp?: string;
    };
  }): Promise<void> {
    await apiClient.post(`${this.baseUrl}/automations/follow-up`, {
      appointmentId,
      config
    });
  }

  // ===== CONFIGURAÇÕES =====

  // Obter configurações de comunicação
  async getSettings(): Promise<CommunicationConfig> {
    const response = await apiClient.get<CommunicationConfig>(`${this.baseUrl}/settings`);
    return response.data;
  }

  // Atualizar configurações de comunicação
  async updateSettings(settings: Partial<CommunicationConfig>): Promise<CommunicationConfig> {
    const response = await apiClient.put<CommunicationConfig>(`${this.baseUrl}/settings`, settings);
    return response.data;
  }

  // Testar configurações
  async testSettings(settings: Partial<CommunicationConfig>): Promise<{
    email: { success: boolean; message: string };
    sms: { success: boolean; message: string };
    whatsapp: { success: boolean; message: string };
  }> {
    const response = await apiClient.post<{
      email: { success: boolean; message: string };
      sms: { success: boolean; message: string };
      whatsapp: { success: boolean; message: string };
    }>(`${this.baseUrl}/settings/test`, settings);
    return response.data;
  }

  // ===== ANALYTICS =====

  // Obter analytics de entrega
  async getDeliveryAnalytics(period: {
    start: string;
    end: string;
  }): Promise<DeliveryAnalytics> {
    const params = new URLSearchParams();
    params.append('start', period.start);
    params.append('end', period.end);

    const response = await apiClient.get<DeliveryAnalytics>(
      `${this.baseUrl}/analytics/delivery?${params.toString()}`
    );
    return response.data;
  }

  // Obter estatísticas de templates
  async getTemplateStats(templateId: string, period: {
    start: string;
    end: string;
  }): Promise<{
    totalSent: number;
    totalDelivered: number;
    totalOpened: number;
    totalClicked: number;
    totalBounced: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
  }> {
    const params = new URLSearchParams();
    params.append('start', period.start);
    params.append('end', period.end);

    const response = await apiClient.get<{
      totalSent: number;
      totalDelivered: number;
      totalOpened: number;
      totalClicked: number;
      totalBounced: number;
      deliveryRate: number;
      openRate: number;
      clickRate: number;
      bounceRate: number;
    }>(`${this.baseUrl}/templates/${templateId}/stats?${params.toString()}`);
    return response.data;
  }

  // ===== WEBHOOKS =====

  // Configurar webhook
  async setupWebhook(config: {
    url: string;
    events: string[];
    secret?: string;
    isActive: boolean;
  }): Promise<{
    id: string;
    url: string;
    events: string[];
    isActive: boolean;
    createdAt: string;
  }> {
    const response = await apiClient.post<{
      id: string;
      url: string;
      events: string[];
      isActive: boolean;
      createdAt: string;
    }>(`${this.baseUrl}/webhooks`, config);
    return response.data;
  }

  // Listar webhooks
  async getWebhooks(): Promise<Array<{
    id: string;
    url: string;
    events: string[];
    isActive: boolean;
    createdAt: string;
    lastTriggered?: string;
  }>> {
    const response = await apiClient.get<Array<{
      id: string;
      url: string;
      events: string[];
      isActive: boolean;
      createdAt: string;
      lastTriggered?: string;
    }>>(`${this.baseUrl}/webhooks`);
    return response.data;
  }

  // Atualizar webhook
  async updateWebhook(webhookId: string, updates: {
    url?: string;
    events?: string[];
    secret?: string;
    isActive?: boolean;
  }): Promise<{
    id: string;
    url: string;
    events: string[];
    isActive: boolean;
    createdAt: string;
  }> {
    const response = await apiClient.put<{
      id: string;
      url: string;
      events: string[];
      isActive: boolean;
      createdAt: string;
    }>(`${this.baseUrl}/webhooks/${webhookId}`, updates);
    return response.data;
  }

  // Excluir webhook
  async deleteWebhook(webhookId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/webhooks/${webhookId}`);
  }

  // ===== COMPLIANCE =====

  // Obter lista de unsubscribe
  async getUnsubscribeList(): Promise<Array<{
    email: string;
    phone?: string;
    unsubscribedAt: string;
    reason?: string;
  }>> {
    const response = await apiClient.get<Array<{
      email: string;
      phone?: string;
      unsubscribedAt: string;
      reason?: string;
    }>>(`${this.baseUrl}/compliance/unsubscribe`);
    return response.data;
  }

  // Adicionar à lista de unsubscribe
  async addToUnsubscribeList(contact: {
    email?: string;
    phone?: string;
    reason?: string;
  }): Promise<void> {
    await apiClient.post(`${this.baseUrl}/compliance/unsubscribe`, contact);
  }

  // Remover da lista de unsubscribe
  async removeFromUnsubscribeList(_contact: {
    email?: string;
    phone?: string;
  }): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/compliance/unsubscribe`);
  }

  // ===== MÉTODOS AUXILIARES =====

  // Processar template com variáveis
  processTemplate(template: string, variables: Record<string, string>): string {
    let processedTemplate = template;
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processedTemplate = processedTemplate.replace(regex, value);
    });
    
    return processedTemplate;
  }

  // Validar número de telefone
  validatePhoneNumber(phone: string): boolean {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 15;
  }

  // Validar email
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Formatar telefone para WhatsApp
  formatPhoneForWhatsApp(phone: string): string {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('55')) {
      return cleanPhone;
    } else if (cleanPhone.startsWith('0')) {
      return '55' + cleanPhone.substring(1);
    } else {
      return '55' + cleanPhone;
    }
  }

  // Obter variáveis disponíveis para templates
  getAvailableVariables(): Array<{
    key: string;
    description: string;
    example: string;
  }> {
    return [
      { key: 'patientName', description: 'Nome do paciente', example: 'João Silva' },
      { key: 'patientEmail', description: 'Email do paciente', example: 'joao@email.com' },
      { key: 'patientPhone', description: 'Telefone do paciente', example: '(11) 99999-9999' },
      { key: 'appointmentDate', description: 'Data da consulta', example: '15/03/2024' },
      { key: 'appointmentTime', description: 'Horário da consulta', example: '14:30' },
      { key: 'psychologistName', description: 'Nome do psicólogo', example: 'Dr. Ana Silva' },
      { key: 'psychologistPhone', description: 'Telefone do psicólogo', example: '(11) 3333-3333' },
      { key: 'confirmationCode', description: 'Código de confirmação', example: 'ABC123' },
      { key: 'price', description: 'Valor da consulta', example: 'R$ 150,00' },
      { key: 'paymentUrl', description: 'Link de pagamento', example: 'https://pagamento.com/abc123' },
      { key: 'videoRoomUrl', description: 'Link da videoconferência', example: 'https://meet.cliniflow.com/room123' },
      { key: 'cancellationPolicy', description: 'Política de cancelamento', example: 'Cancelar até 24h antes' },
      { key: 'reschedulingPolicy', description: 'Política de reagendamento', example: 'Reagendar até 2h antes' }
    ];
  }
}

// Instância do serviço
export const communicationService = new CommunicationService();
