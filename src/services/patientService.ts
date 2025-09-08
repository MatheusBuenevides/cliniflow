import { apiClient } from './api';
import type { 
  Patient, 
  PatientCreate, 
  PatientUpdate, 
  PatientFilters, 
  PatientStats,
  SavedFilter
} from '../types/patient';
import type { PaginationMeta } from '../types/pagination';

// Serviço para gerenciar pacientes
export class PatientService {
  // Buscar pacientes com filtros e paginação
  async getPatients(filters?: PatientFilters, page: number = 1, limit: number = 20) {
    const queryParams = new URLSearchParams();
    
    if (filters?.search) queryParams.append('search', filters.search);
    if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.paymentStatus) queryParams.append('paymentStatus', filters.paymentStatus);
    if (filters?.period?.start) queryParams.append('periodStart', filters.period.start);
    if (filters?.period?.end) queryParams.append('periodEnd', filters.period.end);
    
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    const endpoint = `/patients${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<{ data: Patient[]; meta: PaginationMeta }>(endpoint);
  }

  // Buscar paciente por ID
  async getPatientById(id: number) {
    return apiClient.get<Patient>(`/patients/${id}`);
  }

  // Criar novo paciente
  async createPatient(data: PatientCreate) {
    return apiClient.post<Patient>('/patients', data);
  }

  // Atualizar paciente
  async updatePatient(id: number, data: PatientUpdate) {
    return apiClient.put<Patient>(`/patients/${id}`, data);
  }

  // Deletar paciente
  async deletePatient(id: number) {
    return apiClient.delete(`/patients/${id}`);
  }

  // Buscar histórico de consultas do paciente
  async getPatientAppointments(patientId: number) {
    return apiClient.get(`/patients/${patientId}/appointments`);
  }

  // Buscar prontuário do paciente
  async getPatientRecords(patientId: number) {
    return apiClient.get(`/patients/${patientId}/records`);
  }

  // Buscar estatísticas de pacientes
  async getPatientStats() {
    return apiClient.get<PatientStats>('/patients/stats');
  }

  // Exportar lista de pacientes
  async exportPatients(filters?: PatientFilters, format: 'csv' | 'xlsx' = 'csv') {
    const queryParams = new URLSearchParams();
    
    if (filters?.search) queryParams.append('search', filters.search);
    if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.paymentStatus) queryParams.append('paymentStatus', filters.paymentStatus);
    if (filters?.period?.start) queryParams.append('periodStart', filters.period.start);
    if (filters?.period?.end) queryParams.append('periodEnd', filters.period.end);
    
    queryParams.append('format', format);

    const endpoint = `/patients/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get(endpoint);
  }

  // Gerenciar filtros salvos
  async getSavedFilters() {
    return apiClient.get<SavedFilter[]>('/patients/filters/saved');
  }

  async saveFilter(name: string, filters: PatientFilters) {
    return apiClient.post<SavedFilter>('/patients/filters/saved', { name, filters });
  }

  async deleteSavedFilter(filterId: string) {
    return apiClient.delete(`/patients/filters/saved/${filterId}`);
  }

  // Busca avançada com múltiplos critérios
  async advancedSearch(criteria: {
    name?: string;
    email?: string;
    phone?: string;
    cpf?: string;
    status?: 'active' | 'inactive';
    hasAppointments?: boolean;
    paymentStatus?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  }) {
    return apiClient.post<Patient[]>('/patients/search/advanced', criteria);
  }

  // Buscar pacientes com consultas próximas
  async getPatientsWithUpcomingAppointments(days: number = 7) {
    return apiClient.get<Patient[]>(`/patients/upcoming-appointments?days=${days}`);
  }

  // Buscar pacientes inativos (sem consultas recentes)
  async getInactivePatients(days: number = 90) {
    return apiClient.get<Patient[]>(`/patients/inactive?days=${days}`);
  }

  // Atualizar status do paciente
  async updatePatientStatus(id: number, status: 'active' | 'inactive') {
    return apiClient.put<Patient>(`/patients/${id}/status`, { status });
  }

  // Buscar pacientes por status de pagamento
  async getPatientsByPaymentStatus(status: string) {
    return apiClient.get<Patient[]>(`/patients/payment-status/${status}`);
  }
}

// Instância do serviço
export const patientService = new PatientService();
