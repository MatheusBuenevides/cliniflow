import { apiClient } from './api';
import { Appointment, AppointmentCreate, AppointmentUpdate, AppointmentFilters } from '../types';

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
}

// Instância do serviço
export const appointmentService = new AppointmentService();
