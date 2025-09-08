import { create } from 'zustand';
import type { 
  Patient, 
  PatientCreate, 
  PatientUpdate, 
  PatientFilters, 
  PatientStats,
  SavedFilter
} from '../types/patient';
import type { PaginationMeta } from '../types/pagination';
import { patientService } from '../services/patientService';

interface PatientState {
  // Estado
  patients: Patient[];
  currentPatient: Patient | null;
  stats: PatientStats | null;
  savedFilters: SavedFilter[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  isStatsLoading: boolean;
  error: string | null;
  filters: PatientFilters;
  searchTerm: string;

  // Actions
  fetchPatients: (filters?: PatientFilters, page?: number) => Promise<void>;
  fetchStats: () => Promise<void>;
  getPatientById: (id: number) => Patient | null;
  createPatient: (patientData: PatientCreate) => Promise<Patient>;
  updatePatient: (id: number, patientData: PatientUpdate) => Promise<Patient>;
  deletePatient: (id: number) => Promise<void>;
  setCurrentPatient: (patient: Patient | null) => void;
  setFilters: (filters: PatientFilters) => void;
  setSearchTerm: (term: string) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  
  // Filtros salvos
  fetchSavedFilters: () => Promise<void>;
  saveFilter: (name: string, filters: PatientFilters) => Promise<void>;
  deleteSavedFilter: (filterId: string) => Promise<void>;
  loadSavedFilter: (filter: SavedFilter) => void;
  
  // Exportação
  exportPatients: (format?: 'csv' | 'xlsx') => Promise<void>;
  
  // Busca avançada
  advancedSearch: (criteria: any) => Promise<Patient[]>;
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
    avatar: undefined,
    status: 'active',
    lastAppointment: '2024-01-20T14:00:00.000Z',
    totalAppointments: 12,
    nextAppointment: '2024-02-15T10:00:00.000Z',
    paymentStatus: 'paid',
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
    avatar: undefined,
    status: 'active',
    lastAppointment: '2024-01-25T16:00:00.000Z',
    totalAppointments: 3,
    nextAppointment: undefined,
    paymentStatus: 'pending',
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
    avatar: undefined,
    status: 'inactive',
    lastAppointment: '2023-12-15T11:00:00.000Z',
    totalAppointments: 8,
    nextAppointment: undefined,
    paymentStatus: 'paid',
    createdAt: '2024-02-01T09:15:00.000Z',
    updatedAt: '2024-02-01T09:15:00.000Z',
    psychologistId: 1,
  },
];

// Mock stats para desenvolvimento
const mockStats: PatientStats = {
  total: 3,
  active: 2,
  newThisMonth: 1,
  lastAppointment: {
    patientId: 1,
    patientName: 'Maria Santos',
    date: '2024-01-25T16:00:00.000Z'
  }
};

// Mock saved filters para desenvolvimento
const mockSavedFilters: SavedFilter[] = [
  {
    id: '1',
    name: 'Pacientes Ativos',
    filters: { status: 'active' },
    createdAt: '2024-01-15T10:00:00.000Z'
  },
  {
    id: '2',
    name: 'Pagamentos Pendentes',
    filters: { paymentStatus: 'pending' },
    createdAt: '2024-01-20T14:00:00.000Z'
  }
];

export const usePatientStore = create<PatientState>((set, get) => ({
  // Estado inicial
  patients: mockPatients,
  currentPatient: null,
  stats: mockStats,
  savedFilters: mockSavedFilters,
  pagination: null,
  isLoading: false,
  isStatsLoading: false,
  error: null,
  filters: {},
  searchTerm: '',

  // Actions
  fetchPatients: async (filters?: PatientFilters, page: number = 1) => {
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

      if (filters?.status && filters.status !== 'all') {
        filteredPatients = filteredPatients.filter(patient => patient.status === filters.status);
      }

      if (filters?.paymentStatus) {
        filteredPatients = filteredPatients.filter(patient => patient.paymentStatus === filters.paymentStatus);
      }

      if (filters?.period?.start && filters?.period?.end) {
        filteredPatients = filteredPatients.filter(patient => {
          if (!patient.lastAppointment) return false;
          const appointmentDate = new Date(patient.lastAppointment);
          const startDate = new Date(filters.period!.start);
          const endDate = new Date(filters.period!.end);
          return appointmentDate >= startDate && appointmentDate <= endDate;
        });
      }
      
      // Aplicar ordenação
      if (filters?.sortBy) {
        filteredPatients.sort((a, b) => {
          let aValue: any = a[filters.sortBy!];
          let bValue: any = b[filters.sortBy!];
          
          // Tratar datas
          if (filters.sortBy === 'lastAppointment') {
            aValue = aValue ? new Date(aValue).getTime() : 0;
            bValue = bValue ? new Date(bValue).getTime() : 0;
          }
          
          if (filters.sortOrder === 'desc') {
            return aValue < bValue ? 1 : -1;
          }
          return aValue > bValue ? 1 : -1;
        });
      }

      // Simular paginação
      const limit = 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPatients = filteredPatients.slice(startIndex, endIndex);

      const pagination: PaginationMeta = {
        page,
        limit,
        total: filteredPatients.length,
        totalPages: Math.ceil(filteredPatients.length / limit),
        hasNext: endIndex < filteredPatients.length,
        hasPrev: page > 1
      };
      
      set({
        patients: paginatedPatients,
        pagination,
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

  fetchStats: async () => {
    set({ isStatsLoading: true, error: null });
    
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({
        stats: mockStats,
        isStatsLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isStatsLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar estatísticas',
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

  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
  },

  // Filtros salvos
  fetchSavedFilters: async () => {
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set({
        savedFilters: mockSavedFilters,
        error: null,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao carregar filtros salvos',
      });
    }
  },

  saveFilter: async (name: string, filters: PatientFilters) => {
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newFilter: SavedFilter = {
        id: Date.now().toString(),
        name,
        filters,
        createdAt: new Date().toISOString()
      };
      
      set(state => ({
        savedFilters: [...state.savedFilters, newFilter],
        error: null,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao salvar filtro',
      });
    }
  },

  deleteSavedFilter: async (filterId: string) => {
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => ({
        savedFilters: state.savedFilters.filter(filter => filter.id !== filterId),
        error: null,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao excluir filtro',
      });
    }
  },

  loadSavedFilter: (filter: SavedFilter) => {
    set({
      filters: filter.filters,
      searchTerm: filter.filters.search || '',
    });
  },

  // Exportação
  exportPatients: async (format: 'csv' | 'xlsx' = 'csv') => {
    try {
      set({ isLoading: true, error: null });
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular download
      const { patients, filters } = get();
      const data = patients.map(patient => ({
        Nome: patient.name,
        Email: patient.email,
        Telefone: patient.phone,
        Status: patient.status === 'active' ? 'Ativo' : 'Inativo',
        'Última Consulta': patient.lastAppointment 
          ? new Date(patient.lastAppointment).toLocaleDateString('pt-BR')
          : 'Nunca',
        'Total Consultas': patient.totalAppointments,
        'Status Pagamento': patient.paymentStatus === 'paid' ? 'Pago' : 
                           patient.paymentStatus === 'pending' ? 'Pendente' : 'Não informado'
      }));
      
      const csvContent = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `pacientes_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      set({ isLoading: false, error: null });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao exportar pacientes',
      });
    }
  },

  // Busca avançada
  advancedSearch: async (criteria: any) => {
    try {
      set({ isLoading: true, error: null });
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredPatients = [...mockPatients];
      
      if (criteria.name) {
        filteredPatients = filteredPatients.filter(patient =>
          patient.name.toLowerCase().includes(criteria.name.toLowerCase())
        );
      }
      
      if (criteria.email) {
        filteredPatients = filteredPatients.filter(patient =>
          patient.email.toLowerCase().includes(criteria.email.toLowerCase())
        );
      }
      
      if (criteria.phone) {
        filteredPatients = filteredPatients.filter(patient =>
          patient.phone.includes(criteria.phone)
        );
      }
      
      if (criteria.status) {
        filteredPatients = filteredPatients.filter(patient => patient.status === criteria.status);
      }
      
      if (criteria.paymentStatus) {
        filteredPatients = filteredPatients.filter(patient => patient.paymentStatus === criteria.paymentStatus);
      }
      
      set({
        patients: filteredPatients,
        isLoading: false,
        error: null,
      });
      
      return filteredPatients;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro na busca avançada',
      });
      return [];
    }
  },
}));
