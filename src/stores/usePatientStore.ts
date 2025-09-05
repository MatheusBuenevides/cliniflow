import { create } from 'zustand';
import type { Patient, PatientCreate, PatientUpdate, PatientFilters } from '../types/index';

interface PatientState {
  // Estado
  patients: Patient[];
  currentPatient: Patient | null;
  isLoading: boolean;
  error: string | null;
  filters: PatientFilters;

  // Actions
  fetchPatients: (filters?: PatientFilters) => Promise<void>;
  getPatientById: (id: number) => Patient | null;
  createPatient: (patientData: PatientCreate) => Promise<Patient>;
  updatePatient: (id: number, patientData: PatientUpdate) => Promise<Patient>;
  deletePatient: (id: number) => Promise<void>;
  setCurrentPatient: (patient: Patient | null) => void;
  setFilters: (filters: PatientFilters) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// Mock data temporário para desenvolvimento
const mockPatients: Patient[] = [
  {
    id: 1,
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '(11) 99999-8888',
    birthDate: '1990-05-15',
    cpf: '123.456.789-00',
    rg: '12.345.678-9',
    address: {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
    },
    maritalStatus: 'Solteira',
    profession: 'Engenheira',
    emergencyContact: {
      name: 'João Santos',
      relationship: 'Pai',
      phone: '(11) 99999-7777',
      email: 'joao.santos@email.com',
    },
    medicalHistory: {
      medications: ['Fluoxetina 20mg'],
      psychiatricHistory: 'Episódio depressivo em 2020',
      allergies: ['Penicilina'],
      otherTreatments: 'Psicoterapia desde 2021',
      observations: 'Paciente responsiva ao tratamento',
    },
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
    psychologistId: 1,
  },
  {
    id: 2,
    name: 'João Oliveira',
    email: 'joao.oliveira@email.com',
    phone: '(11) 99999-6666',
    birthDate: '1985-12-03',
    cpf: '987.654.321-00',
    rg: '98.765.432-1',
    address: {
      street: 'Av. Paulista',
      number: '1000',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
    },
    maritalStatus: 'Casado',
    profession: 'Advogado',
    emergencyContact: {
      name: 'Maria Oliveira',
      relationship: 'Esposa',
      phone: '(11) 99999-5555',
    },
    medicalHistory: {
      medications: [],
      psychiatricHistory: 'Primeira consulta',
      allergies: [],
      otherTreatments: '',
      observations: 'Paciente ansioso, primeira experiência com psicoterapia',
    },
    createdAt: '2024-01-20T14:30:00.000Z',
    updatedAt: '2024-01-20T14:30:00.000Z',
    psychologistId: 1,
  },
  {
    id: 3,
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    phone: '(11) 99999-4444',
    birthDate: '1995-08-22',
    cpf: '456.789.123-00',
    rg: '45.678.912-3',
    address: {
      street: 'Rua Augusta',
      number: '500',
      complement: 'Sala 10',
      neighborhood: 'Consolação',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01305-000',
    },
    maritalStatus: 'Solteira',
    profession: 'Designer',
    emergencyContact: {
      name: 'Carlos Costa',
      relationship: 'Irmão',
      phone: '(11) 99999-3333',
    },
    medicalHistory: {
      medications: ['Sertralina 50mg'],
      psychiatricHistory: 'Transtorno de ansiedade generalizada',
      allergies: [],
      otherTreatments: 'Psicoterapia há 6 meses',
      observations: 'Boa aderência ao tratamento, evolução positiva',
    },
    createdAt: '2024-02-01T09:15:00.000Z',
    updatedAt: '2024-02-01T09:15:00.000Z',
    psychologistId: 1,
  },
];

export const usePatientStore = create<PatientState>((set, get) => ({
  // Estado inicial
  patients: mockPatients,
  currentPatient: null,
  isLoading: false,
  error: null,
  filters: {},

  // Actions
  fetchPatients: async (filters?: PatientFilters) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredPatients = [...mockPatients];
      
      // Aplicar filtros
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredPatients = filteredPatients.filter(patient =>
          patient.name.toLowerCase().includes(searchTerm) ||
          patient.email.toLowerCase().includes(searchTerm) ||
          patient.phone.includes(searchTerm)
        );
      }
      
      // Aplicar ordenação
      if (filters?.sortBy) {
        filteredPatients.sort((a, b) => {
          const aValue = a[filters.sortBy!];
          const bValue = b[filters.sortBy!];
          
          if (filters.sortOrder === 'desc') {
            return aValue < bValue ? 1 : -1;
          }
          return aValue > bValue ? 1 : -1;
        });
      }
      
      set({
        patients: filteredPatients,
        isLoading: false,
        error: null,
        filters: filters || {},
      });
    } catch (error) {
      set({
        patients: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar pacientes',
      });
    }
  },

  getPatientById: (id: number) => {
    const { patients } = get();
    return patients.find(patient => patient.id === id) || null;
  },

  createPatient: async (patientData: PatientCreate) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPatient: Patient = {
        ...patientData,
        id: Date.now(), // ID temporário
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      set(state => ({
        patients: [...state.patients, newPatient],
        isLoading: false,
        error: null,
      }));
      
      return newPatient;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao criar paciente',
      });
      throw error;
    }
  },

  updatePatient: async (id: number, patientData: PatientUpdate) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedPatient: Patient = {
        ...get().patients.find(p => p.id === id)!,
        ...patientData,
        updatedAt: new Date().toISOString(),
      };
      
      set(state => ({
        patients: state.patients.map(patient =>
          patient.id === id ? updatedPatient : patient
        ),
        currentPatient: state.currentPatient?.id === id ? updatedPatient : state.currentPatient,
        isLoading: false,
        error: null,
      }));
      
      return updatedPatient;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao atualizar paciente',
      });
      throw error;
    }
  },

  deletePatient: async (id: number) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 600));
      
      set(state => ({
        patients: state.patients.filter(patient => patient.id !== id),
        currentPatient: state.currentPatient?.id === id ? null : state.currentPatient,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao excluir paciente',
      });
    }
  },

  setCurrentPatient: (patient: Patient | null) => {
    set({ currentPatient: patient });
  },

  setFilters: (filters: PatientFilters) => {
    set({ filters });
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
