import { apiClient } from './api';
import type { 
  Appointment, 
  AppointmentCreate, 
  AppointmentUpdate, 
  AppointmentFilters,
  AvailableSlot
} from '../types';
import type {
  TimeSlot,
  AppointmentBookingForm,
  AvailabilitySettings
} from '../types/booking';

// Serviço para gerenciar agendamentos
export class AppointmentService {
  // Buscar agendamentos com filtros
  async getAppointments(filters?: AppointmentFilters) {
    const queryParams = new URLSearchParams();
    
    if (filters?.startDate) queryParams.append('startDate', filters.startDate);
    if (filters?.endDate) queryParams.append('endDate', filters.endDate);
    if (filters?.status) queryParams.append('status', filters.status.join(','));
    if (filters?.modality) queryParams.append('modality', filters.modality);
    if (filters?.patientId) queryParams.append('patientId', filters.patientId.toString());

    const endpoint = `/appointments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<Appointment[]>(endpoint);
  }

  // Buscar agendamento por ID
  async getAppointmentById(id: number) {
    return apiClient.get<Appointment>(`/appointments/${id}`);
  }

  // Criar novo agendamento
  async createAppointment(data: AppointmentCreate) {
    return apiClient.post<Appointment>('/appointments', data);
  }

  // Atualizar agendamento
  async updateAppointment(id: number, data: AppointmentUpdate) {
    return apiClient.put<Appointment>(`/appointments/${id}`, data);
  }

  // Cancelar agendamento
  async cancelAppointment(id: number, reason?: string) {
    return apiClient.put<Appointment>(`/appointments/${id}/cancel`, { reason });
  }

  // Confirmar agendamento
  async confirmAppointment(id: number) {
    return apiClient.put<Appointment>(`/appointments/${id}/confirm`);
  }

  // Buscar agendamentos de hoje
  async getTodayAppointments() {
    const today = new Date().toISOString().split('T')[0];
    return this.getAppointments({ startDate: today, endDate: today });
  }

  // ===== SISTEMA DE AGENDAMENTO ONLINE =====

  // Buscar horários disponíveis para um psicólogo
  async getAvailableSlots(psychologistId: number, startDate: string, endDate: string) {
    const queryParams = new URLSearchParams({
      psychologistId: psychologistId.toString(),
      startDate,
      endDate
    });
    
    return apiClient.get<AvailableSlot[]>(`/appointments/available-slots?${queryParams.toString()}`);
  }

  // Verificar disponibilidade de um horário específico
  async checkSlotAvailability(psychologistId: number, date: string, time: string) {
    return apiClient.get<{ isAvailable: boolean; reason?: string }>(
      `/appointments/check-availability/${psychologistId}/${date}/${time}`
    );
  }

  // Criar agendamento a partir do formulário de booking
  async createBookingAppointment(bookingData: AppointmentBookingForm, psychologistId: number) {
    const appointmentData: AppointmentCreate = {
      patientId: 0, // Será criado automaticamente
      psychologistId,
      date: bookingData.selectedSlot.date,
      time: bookingData.selectedSlot.time,
      duration: bookingData.selectedSlot.duration,
      type: bookingData.isFirstTime ? 'initial' : 'followUp',
      modality: bookingData.selectedSlot.modality,
      status: 'scheduled',
      price: bookingData.selectedSlot.price,
      notes: bookingData.notes,
      paymentStatus: 'pending'
    };

    return apiClient.post<Appointment>('/appointments/booking', {
      appointment: appointmentData,
      patient: {
        name: bookingData.patientName,
        email: bookingData.patientEmail,
        phone: bookingData.patientPhone,
        birthDate: bookingData.birthDate
      }
    });
  }

  // Buscar configurações de disponibilidade do psicólogo
  async getAvailabilitySettings(psychologistId: number) {
    return apiClient.get<AvailabilitySettings>(`/psychologists/${psychologistId}/availability-settings`);
  }

  // Atualizar configurações de disponibilidade
  async updateAvailabilitySettings(psychologistId: number, settings: AvailabilitySettings) {
    return apiClient.put<AvailabilitySettings>(`/psychologists/${psychologistId}/availability-settings`, settings);
  }

  // Gerar slots de tempo baseado nas configurações
  async generateTimeSlots(psychologistId: number, date: string) {
    return apiClient.get<TimeSlot[]>(`/appointments/generate-slots/${psychologistId}/${date}`);
  }

  // Bloquear horários específicos
  async blockTimeSlots(psychologistId: number, slots: { date: string; time: string; reason: string }[]) {
    return apiClient.post(`/appointments/block-slots/${psychologistId}`, { slots });
  }

  // Desbloquear horários
  async unblockTimeSlots(psychologistId: number, slotIds: string[]) {
    return apiClient.delete(`/appointments/unblock-slots/${psychologistId}`, slotIds);
  }

  // Buscar agendamentos públicos (para página pública)
  async getPublicAppointments(psychologistId: number, startDate: string, endDate: string) {
    const queryParams = new URLSearchParams({ startDate, endDate });
    return apiClient.get<AvailableSlot[]>(`/public/psychologists/${psychologistId}/available-slots?${queryParams.toString()}`);
  }

  // Criar agendamento público (sem autenticação)
  async createPublicAppointment(psychologistId: number, bookingData: AppointmentBookingForm) {
    return apiClient.post<Appointment>('/public/appointments', {
      psychologistId,
      bookingData
    });
  }

  // Enviar confirmação de agendamento
  async sendAppointmentConfirmation(appointmentId: number) {
    return apiClient.post(`/appointments/${appointmentId}/send-confirmation`);
  }

  // Gerar link de pagamento
  async generatePaymentLink(appointmentId: number) {
    return apiClient.post<{ url: string; expiresAt: string }>(`/appointments/${appointmentId}/payment-link`);
  }

  // Verificar status do pagamento
  async checkPaymentStatus(appointmentId: number) {
    return apiClient.get<{ status: string; paidAt?: string }>(`/appointments/${appointmentId}/payment-status`);
  }
}

// Instância do serviço
export const appointmentService = new AppointmentService();
