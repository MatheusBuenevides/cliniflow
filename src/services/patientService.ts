import { apiClient } from './api';
import { Patient, PatientCreate, PatientUpdate, PatientFilters } from '../types';

// Serviço para gerenciar pacientes
export class PatientService {
  // Buscar pacientes com filtros
  async getPatients(filters?: PatientFilters) {
    const queryParams = new URLSearchParams();
    
    if (filters?.search) queryParams.append('search', filters.search);
    if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

    const endpoint = `/patients${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<Patient[]>(endpoint);
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
}

// Instância do serviço
export const patientService = new PatientService();
