import { apiClient } from './api';
import { communicationService } from './communicationService';
import type { 
  NotificationTemplate, 
  BookingConfirmation, 
  PaymentLink,
  Appointment
} from '../types';

// Serviço para gerenciar notificações
export class NotificationService {
  // ===== NOTIFICAÇÕES DE EMAIL =====

  // Enviar confirmação de agendamento por email
  async sendBookingConfirmationEmail(confirmation: BookingConfirmation) {
    const template = await this.getEmailTemplate('booking_confirmation');
    const emailData = {
      to: confirmation.patientEmail,
      subject: template.subject || 'Confirmação de Agendamento',
      template: template.template,
      variables: {
        patientName: confirmation.patientName,
        appointmentDate: new Date(confirmation.appointmentDate).toLocaleDateString('pt-BR'),
        appointmentTime: confirmation.appointmentTime,
        modality: confirmation.modality === 'online' ? 'Online' : 'Presencial',
        confirmationCode: confirmation.confirmationCode,
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(confirmation.price),
        contactPhone: confirmation.instructions.contactInfo.phone,
        contactEmail: confirmation.instructions.contactInfo.email
      }
    };

    return apiClient.post('/notifications/email/send', emailData);
  }

  // Enviar lembrete de pagamento por email
  async sendPaymentReminderEmail(paymentLink: PaymentLink, patientEmail: string) {
    const template = await this.getEmailTemplate('payment_reminder');
    const emailData = {
      to: patientEmail,
      subject: template.subject || 'Lembrete de Pagamento',
      template: template.template,
      variables: {
        amount: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(paymentLink.amount),
        paymentUrl: paymentLink.url,
        expiresAt: new Date(paymentLink.expiresAt).toLocaleDateString('pt-BR'),
        description: paymentLink.description
      }
    };

    return apiClient.post('/notifications/email/send', emailData);
  }

  // Enviar confirmação de pagamento por email
  async sendPaymentConfirmationEmail(paymentLink: PaymentLink, patientEmail: string) {
    const template = await this.getEmailTemplate('payment_received');
    const emailData = {
      to: patientEmail,
      subject: template.subject || 'Pagamento Confirmado',
      template: template.template,
      variables: {
        amount: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(paymentLink.amount),
        paymentMethod: this.getPaymentMethodName(paymentLink.paymentMethod),
        paidAt: new Date().toLocaleDateString('pt-BR'),
        description: paymentLink.description
      }
    };

    return apiClient.post('/notifications/email/send', emailData);
  }

  // Enviar lembrete de consulta por email
  async sendAppointmentReminderEmail(appointment: Appointment) {
    const template = await this.getEmailTemplate('appointment_reminder');
    const emailData = {
      to: appointment.patient.email,
      subject: template.subject || 'Lembrete de Consulta',
      template: template.template,
      variables: {
        patientName: appointment.patient.name,
        appointmentDate: new Date(appointment.date).toLocaleDateString('pt-BR'),
        appointmentTime: appointment.time,
        modality: appointment.modality === 'online' ? 'Online' : 'Presencial',
        duration: appointment.duration,
        videoRoomId: appointment.videoRoomId
      }
    };

    return apiClient.post('/notifications/email/send', emailData);
  }

  // ===== NOTIFICAÇÕES POR WHATSAPP =====

  // Enviar confirmação de agendamento por WhatsApp
  async sendBookingConfirmationWhatsApp(confirmation: BookingConfirmation) {
    const message = this.buildBookingConfirmationWhatsAppMessage(confirmation);
    return this.sendWhatsAppMessage(confirmation.patientPhone, message);
  }

  // Enviar lembrete de pagamento por WhatsApp
  async sendPaymentReminderWhatsApp(paymentLink: PaymentLink, phone: string) {
    const message = this.buildPaymentReminderWhatsAppMessage(paymentLink);
    return this.sendWhatsAppMessage(phone, message);
  }

  // Enviar lembrete de consulta por WhatsApp
  async sendAppointmentReminderWhatsApp(appointment: Appointment) {
    const message = this.buildAppointmentReminderWhatsAppMessage(appointment);
    return this.sendWhatsAppMessage(appointment.patient.phone, message);
  }

  // ===== NOTIFICAÇÕES POR SMS =====

  // Enviar confirmação de agendamento por SMS
  async sendBookingConfirmationSMS(confirmation: BookingConfirmation) {
    const message = this.buildBookingConfirmationSMSMessage(confirmation);
    return this.sendSMS(confirmation.patientPhone, message);
  }

  // Enviar lembrete de pagamento por SMS
  async sendPaymentReminderSMS(paymentLink: PaymentLink, phone: string) {
    const message = this.buildPaymentReminderSMSMessage(paymentLink);
    return this.sendSMS(phone, message);
  }

  // ===== MÉTODOS AUXILIARES =====

  // Enviar mensagem por WhatsApp
  private async sendWhatsAppMessage(phone: string, message: string) {
    const cleanPhone = phone.replace(/\D/g, '');
    return apiClient.post('/notifications/whatsapp/send', {
      phone: cleanPhone,
      message
    });
  }

  // Enviar SMS
  private async sendSMS(phone: string, message: string) {
    const cleanPhone = phone.replace(/\D/g, '');
    return apiClient.post('/notifications/sms/send', {
      phone: cleanPhone,
      message
    });
  }

  // Buscar template de email
  private async getEmailTemplate(event: string): Promise<NotificationTemplate> {
    try {
      const response = await apiClient.get<NotificationTemplate[]>(`/notifications/templates?type=email&event=${event}`);
      return response.data[0] || this.getDefaultEmailTemplate(event);
    } catch (error) {
      return this.getDefaultEmailTemplate(event);
    }
  }

  // Template padrão de email
  private getDefaultEmailTemplate(event: string): NotificationTemplate {
    const templates = {
      booking_confirmation: {
        id: 'default_booking_confirmation',
        type: 'email' as const,
        event: 'booking_confirmation' as const,
        subject: 'Confirmação de Agendamento - CliniFlow',
        template: `
          <h2>Olá {{patientName}}!</h2>
          <p>Seu agendamento foi confirmado com sucesso.</p>
          <p><strong>Data:</strong> {{appointmentDate}}</p>
          <p><strong>Horário:</strong> {{appointmentTime}}</p>
          <p><strong>Modalidade:</strong> {{modality}}</p>
          <p><strong>Código de confirmação:</strong> {{confirmationCode}}</p>
          <p><strong>Valor:</strong> {{price}}</p>
          <p>Para dúvidas, entre em contato: {{contactPhone}} ou {{contactEmail}}</p>
        `,
        variables: ['patientName', 'appointmentDate', 'appointmentTime', 'modality', 'confirmationCode', 'price', 'contactPhone', 'contactEmail'],
        isActive: true
      },
      payment_reminder: {
        id: 'default_payment_reminder',
        type: 'email' as const,
        event: 'payment_reminder' as const,
        subject: 'Lembrete de Pagamento - CliniFlow',
        template: `
          <h2>Lembrete de Pagamento</h2>
          <p>Você tem um pagamento pendente no valor de {{amount}}.</p>
          <p><strong>Descrição:</strong> {{description}}</p>
          <p><strong>Expira em:</strong> {{expiresAt}}</p>
          <p><a href="{{paymentUrl}}">Clique aqui para pagar</a></p>
        `,
        variables: ['amount', 'description', 'expiresAt', 'paymentUrl'],
        isActive: true
      },
      payment_received: {
        id: 'default_payment_received',
        type: 'email' as const,
        event: 'payment_received' as const,
        subject: 'Pagamento Confirmado - CliniFlow',
        template: `
          <h2>Pagamento Confirmado!</h2>
          <p>Seu pagamento foi processado com sucesso.</p>
          <p><strong>Valor:</strong> {{amount}}</p>
          <p><strong>Método:</strong> {{paymentMethod}}</p>
          <p><strong>Data:</strong> {{paidAt}}</p>
          <p><strong>Descrição:</strong> {{description}}</p>
        `,
        variables: ['amount', 'paymentMethod', 'paidAt', 'description'],
        isActive: true
      },
      appointment_reminder: {
        id: 'default_appointment_reminder',
        type: 'email' as const,
        event: 'appointment_reminder' as const,
        subject: 'Lembrete de Consulta - CliniFlow',
        template: `
          <h2>Lembrete de Consulta</h2>
          <p>Olá {{patientName}}!</p>
          <p>Você tem uma consulta agendada para:</p>
          <p><strong>Data:</strong> {{appointmentDate}}</p>
          <p><strong>Horário:</strong> {{appointmentTime}}</p>
          <p><strong>Modalidade:</strong> {{modality}}</p>
          <p><strong>Duração:</strong> {{duration}} minutos</p>
          {{#if videoRoomId}}
          <p><strong>Link da videoconferência:</strong> <a href="https://meet.cliniflow.com/{{videoRoomId}}">Entrar na consulta</a></p>
          {{/if}}
        `,
        variables: ['patientName', 'appointmentDate', 'appointmentTime', 'modality', 'duration', 'videoRoomId'],
        isActive: true
      }
    };

    return templates[event as keyof typeof templates] || templates.booking_confirmation;
  }

  // Construir mensagem de confirmação para WhatsApp
  private buildBookingConfirmationWhatsAppMessage(confirmation: BookingConfirmation): string {
    return `🎉 *Agendamento Confirmado!*

Olá ${confirmation.patientName}!

Seu agendamento foi confirmado com sucesso:

📅 *Data:* ${new Date(confirmation.appointmentDate).toLocaleDateString('pt-BR')}
🕐 *Horário:* ${confirmation.appointmentTime}
💻 *Modalidade:* ${confirmation.modality === 'online' ? 'Online' : 'Presencial'}
🔢 *Código:* ${confirmation.confirmationCode}
💰 *Valor:* ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(confirmation.price)}

Para dúvidas: ${confirmation.instructions.contactInfo.phone}`;
  }

  // Construir mensagem de lembrete de pagamento para WhatsApp
  private buildPaymentReminderWhatsAppMessage(paymentLink: PaymentLink): string {
    return `💳 *Lembrete de Pagamento*

Você tem um pagamento pendente:

💰 *Valor:* ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(paymentLink.amount)}
📝 *Descrição:* ${paymentLink.description}
⏰ *Expira em:* ${new Date(paymentLink.expiresAt).toLocaleDateString('pt-BR')}

🔗 Pagar: ${paymentLink.url}`;
  }

  // Construir mensagem de lembrete de consulta para WhatsApp
  private buildAppointmentReminderWhatsAppMessage(appointment: Appointment): string {
    return `⏰ *Lembrete de Consulta*

Olá ${appointment.patient.name}!

Você tem uma consulta agendada para:

📅 *Data:* ${new Date(appointment.date).toLocaleDateString('pt-BR')}
🕐 *Horário:* ${appointment.time}
💻 *Modalidade:* ${appointment.modality === 'online' ? 'Online' : 'Presencial'}
⏱️ *Duração:* ${appointment.duration} minutos

${appointment.videoRoomId ? `🔗 Link: https://meet.cliniflow.com/${appointment.videoRoomId}` : ''}

Nos vemos em breve! 😊`;
  }

  // Construir mensagem de confirmação para SMS
  private buildBookingConfirmationSMSMessage(confirmation: BookingConfirmation): string {
    return `Agendamento confirmado! ${new Date(confirmation.appointmentDate).toLocaleDateString('pt-BR')} às ${confirmation.appointmentTime}. Código: ${confirmation.confirmationCode}. CliniFlow`;
  }

  // Construir mensagem de lembrete de pagamento para SMS
  private buildPaymentReminderSMSMessage(paymentLink: PaymentLink): string {
    return `Pagamento pendente: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(paymentLink.amount)}. Expira em ${new Date(paymentLink.expiresAt).toLocaleDateString('pt-BR')}. CliniFlow`;
  }

  // Obter nome do método de pagamento
  private getPaymentMethodName(method?: string): string {
    const methods = {
      'pix': 'PIX',
      'creditCard': 'Cartão de Crédito',
      'debitCard': 'Cartão de Débito',
      'boleto': 'Boleto Bancário',
      'cash': 'Dinheiro',
      'transfer': 'Transferência'
    };
    return methods[method as keyof typeof methods] || 'Pagamento';
  }

  // ===== AGENDAMENTO DE NOTIFICAÇÕES =====

  // Agendar lembrete de consulta
  async scheduleAppointmentReminder(appointmentId: number, reminderHours: number = 24) {
    const reminderTime = new Date();
    reminderTime.setHours(reminderTime.getHours() + reminderHours);

    return apiClient.post('/notifications/schedule', {
      appointmentId,
      type: 'appointment_reminder',
      scheduledFor: reminderTime.toISOString()
    });
  }

  // Agendar lembrete de pagamento
  async schedulePaymentReminder(paymentId: string, reminderHours: number = 12) {
    const reminderTime = new Date();
    reminderTime.setHours(reminderTime.getHours() + reminderHours);

    return apiClient.post('/notifications/schedule', {
      paymentId,
      type: 'payment_reminder',
      scheduledFor: reminderTime.toISOString()
    });
  }

  // Cancelar notificação agendada
  async cancelScheduledNotification(notificationId: string) {
    return apiClient.delete(`/notifications/schedule/${notificationId}`);
  }

  // ===== INTEGRAÇÃO COM SISTEMA DE COMUNICAÇÃO =====

  // Enviar confirmação de agendamento usando novo sistema
  async sendBookingConfirmationAdvanced(confirmation: BookingConfirmation, channels: {
    email?: boolean;
    sms?: boolean;
    whatsapp?: boolean;
  }) {
    const promises: Promise<any>[] = [];

    if (channels.email) {
      promises.push(
        communicationService.sendMessage({
          type: 'email',
          recipient: {
            name: confirmation.patientName,
            email: confirmation.patientEmail
          },
          subject: 'Confirmação de Agendamento - CliniFlow',
          content: this.buildBookingConfirmationEmailContent(confirmation),
          templateId: 'booking_confirmation'
        })
      );
    }

    if (channels.sms) {
      promises.push(
        communicationService.sendMessage({
          type: 'sms',
          recipient: {
            name: confirmation.patientName,
            phone: confirmation.patientPhone
          },
          content: this.buildBookingConfirmationSMSMessage(confirmation)
        })
      );
    }

    if (channels.whatsapp) {
      promises.push(
        communicationService.sendMessage({
          type: 'whatsapp',
          recipient: {
            name: confirmation.patientName,
            phone: confirmation.patientPhone
          },
          content: this.buildBookingConfirmationWhatsAppMessage(confirmation)
        })
      );
    }

    return Promise.all(promises);
  }

  // Agendar lembrete de consulta usando novo sistema
  async scheduleAppointmentReminderAdvanced(appointment: Appointment, config: {
    emailReminder: boolean;
    smsReminder: boolean;
    whatsappReminder: boolean;
    reminderHours: number[];
  }) {
    const promises: Promise<any>[] = [];

    config.reminderHours.forEach(hours => {
      const reminderTime = new Date(appointment.date + 'T' + appointment.time);
      reminderTime.setHours(reminderTime.getHours() - hours);

      if (config.emailReminder) {
        promises.push(
          communicationService.scheduleMessage({
            type: 'email',
            recipient: {
              name: appointment.patient.name,
              email: appointment.patient.email
            },
            subject: 'Lembrete de Consulta - CliniFlow',
            content: this.buildAppointmentReminderEmailContent(appointment),
            scheduledFor: reminderTime.toISOString(),
            trigger: {
              type: 'appointment_reminder',
              appointmentId: appointment.id,
              hoursBefore: hours
            }
          })
        );
      }

      if (config.smsReminder) {
        promises.push(
          communicationService.scheduleMessage({
            type: 'sms',
            recipient: {
              name: appointment.patient.name,
              phone: appointment.patient.phone
            },
            content: this.buildAppointmentReminderSMSMessage(appointment),
            scheduledFor: reminderTime.toISOString(),
            trigger: {
              type: 'appointment_reminder',
              appointmentId: appointment.id,
              hoursBefore: hours
            }
          })
        );
      }

      if (config.whatsappReminder) {
        promises.push(
          communicationService.scheduleMessage({
            type: 'whatsapp',
            recipient: {
              name: appointment.patient.name,
              phone: appointment.patient.phone
            },
            content: this.buildAppointmentReminderWhatsAppMessage(appointment),
            scheduledFor: reminderTime.toISOString(),
            trigger: {
              type: 'appointment_reminder',
              appointmentId: appointment.id,
              hoursBefore: hours
            }
          })
        );
      }
    });

    return Promise.all(promises);
  }

  // Métodos auxiliares para construir conteúdo
  private buildBookingConfirmationEmailContent(confirmation: BookingConfirmation): string {
    return `
      <h2>Olá ${confirmation.patientName}!</h2>
      <p>Seu agendamento foi confirmado com sucesso.</p>
      <p><strong>Data:</strong> ${new Date(confirmation.appointmentDate).toLocaleDateString('pt-BR')}</p>
      <p><strong>Horário:</strong> ${confirmation.appointmentTime}</p>
      <p><strong>Modalidade:</strong> ${confirmation.modality === 'online' ? 'Online' : 'Presencial'}</p>
      <p><strong>Código de confirmação:</strong> ${confirmation.confirmationCode}</p>
      <p><strong>Valor:</strong> ${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(confirmation.price)}</p>
      <p>Para dúvidas, entre em contato: ${confirmation.instructions.contactInfo.phone} ou ${confirmation.instructions.contactInfo.email}</p>
    `;
  }

  private buildAppointmentReminderEmailContent(appointment: Appointment): string {
    return `
      <h2>Lembrete de Consulta</h2>
      <p>Olá ${appointment.patient.name}!</p>
      <p>Você tem uma consulta agendada para:</p>
      <p><strong>Data:</strong> ${new Date(appointment.date).toLocaleDateString('pt-BR')}</p>
      <p><strong>Horário:</strong> ${appointment.time}</p>
      <p><strong>Modalidade:</strong> ${appointment.modality === 'online' ? 'Online' : 'Presencial'}</p>
      <p><strong>Duração:</strong> ${appointment.duration} minutos</p>
      ${appointment.videoRoomId ? `<p><strong>Link da videoconferência:</strong> <a href="https://meet.cliniflow.com/${appointment.videoRoomId}">Entrar na consulta</a></p>` : ''}
    `;
  }

  private buildAppointmentReminderSMSMessage(appointment: Appointment): string {
    return `Lembrete: Consulta agendada para ${new Date(appointment.date).toLocaleDateString('pt-BR')} às ${appointment.time}. ${appointment.videoRoomId ? `Link: https://meet.cliniflow.com/${appointment.videoRoomId}` : ''} - CliniFlow`;
  }
}

// Instância do serviço
export const notificationService = new NotificationService();
