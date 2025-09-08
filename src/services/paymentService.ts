import { apiClient } from './api';
import type { 
  PaymentLink, 
  PaymentMethod, 
  PaymentStatus,
  BookingConfirmation,
  NotificationTemplate
} from '../types';

// Serviço para gerenciar pagamentos e confirmações
export class PaymentService {
  // Gerar link de pagamento
  async generatePaymentLink(appointmentId: number, amount: number, method: PaymentMethod) {
    const paymentData = {
      appointmentId,
      amount,
      method,
      description: `Consulta psicológica - Agendamento #${appointmentId}`,
      expiresIn: 24 * 60 * 60 * 1000 // 24 horas em millisegundos
    };

    return apiClient.post<PaymentLink>('/payments/generate-link', paymentData);
  }

  // Verificar status do pagamento
  async checkPaymentStatus(paymentId: string) {
    return apiClient.get<{ status: PaymentStatus; paidAt?: string }>(`/payments/${paymentId}/status`);
  }

  // Processar pagamento PIX
  async processPixPayment(paymentId: string, pixCode: string) {
    return apiClient.post<{ status: PaymentStatus; transactionId?: string }>('/payments/pix', {
      paymentId,
      pixCode
    });
  }

  // Processar pagamento com cartão
  async processCardPayment(paymentId: string, cardData: any) {
    return apiClient.post<{ status: PaymentStatus; transactionId?: string }>('/payments/card', {
      paymentId,
      cardData
    });
  }

  // Gerar boleto bancário
  async generateBoleto(paymentId: string) {
    return apiClient.post<{ boletoUrl: string; barcode: string }>('/payments/boleto', {
      paymentId
    });
  }

  // Cancelar pagamento
  async cancelPayment(paymentId: string, reason?: string) {
    return apiClient.post<{ status: PaymentStatus }>('/payments/cancel', {
      paymentId,
      reason
    });
  }

  // Estornar pagamento
  async refundPayment(paymentId: string, amount?: number) {
    return apiClient.post<{ status: PaymentStatus; refundId: string }>('/payments/refund', {
      paymentId,
      amount
    });
  }

  // ===== SISTEMA DE CONFIRMAÇÃO =====

  // Criar confirmação de agendamento
  async createBookingConfirmation(appointmentData: any) {
    return apiClient.post<BookingConfirmation>('/bookings/confirmation', appointmentData);
  }

  // Buscar confirmação por código
  async getConfirmationByCode(confirmationCode: string) {
    return apiClient.get<BookingConfirmation>(`/bookings/confirmation/${confirmationCode}`);
  }

  // Atualizar status da confirmação
  async updateConfirmationStatus(confirmationId: string, status: string) {
    return apiClient.put<BookingConfirmation>(`/bookings/confirmation/${confirmationId}/status`, {
      status
    });
  }

  // ===== SISTEMA DE NOTIFICAÇÕES =====

  // Enviar confirmação por email
  async sendEmailConfirmation(confirmationId: string) {
    return apiClient.post('/notifications/email/confirmation', { confirmationId });
  }

  // Enviar lembrete de pagamento
  async sendPaymentReminder(paymentId: string) {
    return apiClient.post('/notifications/email/payment-reminder', { paymentId });
  }

  // Enviar lembrete de consulta
  async sendAppointmentReminder(appointmentId: number) {
    return apiClient.post('/notifications/email/appointment-reminder', { appointmentId });
  }

  // Enviar notificação por WhatsApp
  async sendWhatsAppNotification(phone: string, message: string) {
    return apiClient.post('/notifications/whatsapp', { phone, message });
  }

  // Enviar SMS
  async sendSMS(phone: string, message: string) {
    return apiClient.post('/notifications/sms', { phone, message });
  }

  // ===== TEMPLATES DE NOTIFICAÇÃO =====

  // Buscar templates de notificação
  async getNotificationTemplates() {
    return apiClient.get<NotificationTemplate[]>('/notifications/templates');
  }

  // Atualizar template de notificação
  async updateNotificationTemplate(templateId: string, template: Partial<NotificationTemplate>) {
    return apiClient.put<NotificationTemplate>(`/notifications/templates/${templateId}`, template);
  }

  // ===== RELATÓRIOS E ESTATÍSTICAS =====

  // Buscar estatísticas de pagamento
  async getPaymentStats(period: { start: string; end: string }) {
    return apiClient.get('/payments/stats', { params: period });
  }

  // Buscar relatório de confirmações
  async getConfirmationReport(period: { start: string; end: string }) {
    return apiClient.get('/bookings/confirmation-report', { params: period });
  }
}

// ===== IMPLEMENTAÇÃO SIMULADA =====

// Simulação de gateway de pagamento
export class MockPaymentGateway {
  private static instance: MockPaymentGateway;
  private payments: Map<string, any> = new Map();
  private confirmations: Map<string, BookingConfirmation> = new Map();

  static getInstance(): MockPaymentGateway {
    if (!MockPaymentGateway.instance) {
      MockPaymentGateway.instance = new MockPaymentGateway();
    }
    return MockPaymentGateway.instance;
  }

  // Simular geração de link de pagamento
  generatePaymentLink(appointmentId: number, amount: number, method: PaymentMethod): PaymentLink {
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    const paymentLink: PaymentLink = {
      id: paymentId,
      appointmentId,
      amount,
      description: `Consulta psicológica - Agendamento #${appointmentId}`,
      url: `https://pagamento.exemplo.com/pay/${paymentId}`,
      expiresAt: expiresAt.toISOString(),
      status: 'active',
      createdAt: new Date().toISOString(),
      paymentMethod: method,
      pixCode: method === 'pix' ? this.generatePixCode(amount) : undefined,
      qrCode: method === 'pix' ? this.generateQRCode(paymentId) : undefined,
      boletoUrl: method === 'boleto' ? `https://boleto.exemplo.com/${paymentId}` : undefined
    };

    this.payments.set(paymentId, {
      ...paymentLink,
      status: 'pending',
      createdAt: new Date()
    });

    return paymentLink;
  }

  // Simular verificação de status
  checkPaymentStatus(paymentId: string): { status: PaymentStatus; paidAt?: string } {
    const payment = this.payments.get(paymentId);
    if (!payment) {
      throw new Error('Pagamento não encontrado');
    }

    return {
      status: payment.status,
      paidAt: payment.paidAt
    };
  }

  // Simular processamento de pagamento
  async processPayment(paymentId: string, method: PaymentMethod): Promise<{ status: PaymentStatus; transactionId?: string }> {
    const payment = this.payments.get(paymentId);
    if (!payment) {
      throw new Error('Pagamento não encontrado');
    }

    if (payment.status !== 'pending') {
      throw new Error('Pagamento já processado');
    }

    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simular 90% de sucesso
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      payment.status = 'paid';
      payment.paidAt = new Date().toISOString();
      payment.transactionId = `txn_${Date.now()}`;
      
      this.payments.set(paymentId, payment);
      
      return {
        status: 'paid',
        transactionId: payment.transactionId
      };
    } else {
      payment.status = 'cancelled';
      this.payments.set(paymentId, payment);
      
      return {
        status: 'cancelled'
      };
    }
  }

  // Simular cancelamento
  cancelPayment(paymentId: string, reason?: string): { status: PaymentStatus } {
    const payment = this.payments.get(paymentId);
    if (!payment) {
      throw new Error('Pagamento não encontrado');
    }

    payment.status = 'cancelled';
    payment.cancelledAt = new Date().toISOString();
    payment.cancelReason = reason;
    
    this.payments.set(paymentId, payment);

    return { status: 'cancelled' };
  }

  // Simular estorno
  refundPayment(paymentId: string, amount?: number): { status: PaymentStatus; refundId: string } {
    const payment = this.payments.get(paymentId);
    if (!payment) {
      throw new Error('Pagamento não encontrado');
    }

    if (payment.status !== 'paid') {
      throw new Error('Apenas pagamentos confirmados podem ser estornados');
    }

    payment.status = 'refunded';
    payment.refundedAt = new Date().toISOString();
    payment.refundAmount = amount || payment.amount;
    payment.refundId = `ref_${Date.now()}`;
    
    this.payments.set(paymentId, payment);

    return {
      status: 'refunded',
      refundId: payment.refundId
    };
  }

  // Gerar código PIX simulado
  private generatePixCode(amount: number): string {
    const pixKey = '12345678901'; // Chave PIX simulada
    const merchantName = 'PSICOLOGO LTDA';
    const city = 'SAO PAULO';
    
    // Código PIX simplificado (formato real seria mais complexo)
    return `00020126580014br.gov.bcb.pix0136${pixKey}5204000053039865405${amount.toFixed(2)}5802BR5913${merchantName}6008${city}62070503***6304`;
  }

  // Gerar QR Code simulado (base64 de uma imagem simples)
  private generateQRCode(paymentId: string): string {
    // QR Code simulado em base64
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  }

  // Simular criação de confirmação
  createBookingConfirmation(appointmentData: any): BookingConfirmation {
    const confirmationId = `conf_${Date.now()}`;
    const confirmationCode = `CF${Date.now().toString().slice(-6)}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

    const confirmation: BookingConfirmation = {
      id: confirmationId,
      appointmentId: appointmentData.appointmentId,
      confirmationCode,
      patientName: appointmentData.patientName,
      patientEmail: appointmentData.patientEmail,
      patientPhone: appointmentData.patientPhone,
      appointmentDate: appointmentData.appointmentDate,
      appointmentTime: appointmentData.appointmentTime,
      modality: appointmentData.modality,
      price: appointmentData.price,
      paymentStatus: 'pending',
      instructions: appointmentData.instructions,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString()
    };

    this.confirmations.set(confirmationId, confirmation);
    return confirmation;
  }

  // Buscar confirmação por código
  getConfirmationByCode(confirmationCode: string): BookingConfirmation | null {
    for (const confirmation of this.confirmations.values()) {
      if (confirmation.confirmationCode === confirmationCode) {
        return confirmation;
      }
    }
    return null;
  }

  // Simular envio de notificações
  async sendNotification(type: 'email' | 'sms' | 'whatsapp', recipient: string, message: string): Promise<boolean> {
    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`[MOCK] Enviando ${type} para ${recipient}: ${message}`);
    
    // Simular 95% de sucesso
    return Math.random() > 0.05;
  }
}

// Instâncias dos serviços
export const paymentService = new PaymentService();
export const mockPaymentGateway = MockPaymentGateway.getInstance();
