import { create } from 'zustand';
import type { 
  Appointment, 
  AppointmentCreate, 
  AppointmentUpdate, 
  AppointmentFilters,
  AppointmentStatus,
  SessionModality,
  PaymentStatus 
} from '../types/index';

interface AppointmentState {
  // Estado
  appointments: Appointment[];
  currentAppointment: Appointment | null;
  isLoading: boolean;
  error: string | null;
  filters: AppointmentFilters;

  // Actions
  fetchAppointments: (filters?: AppointmentFilters) => Promise<void>;
  getAppointmentById: (id: number) => Appointment | null;
  createAppointment: (appointmentData: AppointmentCreate) => Promise<Appointment>;
  updateAppointment: (id: number, appointmentData: AppointmentUpdate) => Promise<Appointment>;
  cancelAppointment: (id: number, reason?: string) => Promise<void>;
  confirmAppointment: (id: number) => Promise<void>;
  completeAppointment: (id: number) => Promise<void>;
  setCurrentAppointment: (appointment: Appointment | null) => void;
  setFilters: (filters: AppointmentFilters) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// Mock data temporário para desenvolvimento
const mockAppointments: Appointment[] = [
  {
    id: 1,
    patientId: 1,
    patient: {
      id: 1,
      name: 'Maria Santos',
      phone: '(11) 99999-8888',
      email: 'maria.santos@email.com',
    },
    psychologistId: 1,
    date: '2025-09-25',
    time: '14:00',
    duration: 50,
    type: 'followUp',
    modality: 'inPerson',
    status: 'scheduled',
    price: 120,
    notes: 'Paciente relatando melhora na ansiedade',
    paymentStatus: 'paid',
    paymentId: 'pay_123456',
    createdAt: '2024-01-20T10:00:00.000Z',
    updatedAt: '2024-01-20T10:00:00.000Z',
  },
  {
    id: 2,
    patientId: 2,
    patient: {
      id: 2,
      name: 'João Oliveira',
      phone: '(11) 99999-6666',
      email: 'joao.oliveira@email.com',
    },
    psychologistId: 1,
    date: '2025-09-25',
    time: '16:00',
    duration: 50,
    type: 'initial',
    modality: 'online',
    status: 'confirmed',
    price: 150,
    notes: 'Primeira consulta - ansiedade no trabalho',
    paymentStatus: 'pending',
    videoRoomId: 'room_789',
    createdAt: '2024-01-22T14:30:00.000Z',
    updatedAt: '2024-01-22T14:30:00.000Z',
  },
  {
    id: 3,
    patientId: 3,
    patient: {
      id: 3,
      name: 'Ana Costa',
      phone: '(11) 99999-4444',
      email: 'ana.costa@email.com',
    },
    psychologistId: 1,
    date: '2025-09-26',
    time: '10:00',
    duration: 50,
    type: 'followUp',
    modality: 'inPerson',
    status: 'completed',
    price: 120,
    notes: 'Sessão produtiva, paciente mais confiante',
    paymentStatus: 'paid',
    paymentId: 'pay_789012',
    createdAt: '2024-01-15T09:00:00.000Z',
    updatedAt: '2024-01-26T11:00:00.000Z',
  },
  {
    id: 4,
    patientId: 1,
    patient: {
      id: 1,
      name: 'Maria Santos',
      phone: '(11) 99999-8888',
      email: 'maria.santos@email.com',
    },
    psychologistId: 1,
    date: '2025-09-27',
    time: '15:30',
    duration: 50,
    type: 'followUp',
    modality: 'online',
    status: 'scheduled',
    price: 100,
    notes: 'Sessão online - continuidade do tratamento',
    paymentStatus: 'pending',
    videoRoomId: 'room_456',
    createdAt: '2024-01-23T16:00:00.000Z',
    updatedAt: '2024-01-23T16:00:00.000Z',
  },
  {
    id: 5,
    patientId: 2,
    patient: {
      id: 2,
      name: 'João Oliveira',
      phone: '(11) 99999-6666',
      email: 'joao.oliveira@email.com',
    },
    psychologistId: 1,
    date: '2025-09-15',
    time: '09:00',
    duration: 50,
    type: 'followUp',
    modality: 'inPerson',
    status: 'confirmed',
    price: 120,
    notes: 'Retorno - ansiedade controlada',
    paymentStatus: 'paid',
    paymentId: 'pay_456789',
    createdAt: '2024-09-10T10:00:00.000Z',
    updatedAt: '2024-09-10T10:00:00.000Z',
  },
  {
    id: 6,
    patientId: 3,
    patient: {
      id: 3,
      name: 'Ana Costa',
      phone: '(11) 99999-4444',
      email: 'ana.costa@email.com',
    },
    psychologistId: 1,
    date: '2025-09-20',
    time: '14:30',
    duration: 50,
    type: 'initial',
    modality: 'online',
    status: 'scheduled',
    price: 150,
    notes: 'Primeira consulta online',
    paymentStatus: 'pending',
    videoRoomId: 'room_123',
    createdAt: '2024-09-15T14:00:00.000Z',
    updatedAt: '2024-09-15T14:00:00.000Z',
  },
];

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  // Estado inicial
  appointments: mockAppointments,
  currentAppointment: null,
  isLoading: false,
  error: null,
  filters: {},

  // Actions
  fetchAppointments: async (filters?: AppointmentFilters) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredAppointments = [...mockAppointments];
      
      // Aplicar filtros
      if (filters?.startDate) {
        filteredAppointments = filteredAppointments.filter(appointment =>
          appointment.date >= filters.startDate!
        );
      }
      
      if (filters?.endDate) {
        filteredAppointments = filteredAppointments.filter(appointment =>
          appointment.date <= filters.endDate!
        );
      }
      
      if (filters?.status && filters.status.length > 0) {
        filteredAppointments = filteredAppointments.filter(appointment =>
          filters.status!.includes(appointment.status)
        );
      }
      
      if (filters?.modality) {
        filteredAppointments = filteredAppointments.filter(appointment =>
          appointment.modality === filters.modality
        );
      }
      
      if (filters?.paymentStatus) {
        filteredAppointments = filteredAppointments.filter(appointment =>
          appointment.paymentStatus === filters.paymentStatus
        );
      }
      
      if (filters?.patientId) {
        filteredAppointments = filteredAppointments.filter(appointment =>
          appointment.patientId === filters.patientId
        );
      }
      
      // Ordenar por data e hora
      filteredAppointments.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });
      
      set({
        appointments: filteredAppointments,
        isLoading: false,
        error: null,
        filters: filters || {},
      });
    } catch (error) {
      set({
        appointments: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar agendamentos',
      });
    }
  },

  getAppointmentById: (id: number) => {
    const { appointments } = get();
    return appointments.find(appointment => appointment.id === id) || null;
  },

  createAppointment: async (appointmentData: AppointmentCreate) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newAppointment: Appointment = {
        ...appointmentData,
        id: Date.now(), // ID temporário
        patient: {
          id: appointmentData.patientId,
          name: 'Nome do Paciente', // Seria buscado da API
          phone: '(11) 99999-9999',
          email: 'paciente@email.com',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      set(state => ({
        appointments: [...state.appointments, newAppointment],
        isLoading: false,
        error: null,
      }));
      
      return newAppointment;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao criar agendamento',
      });
      throw error;
    }
  },

  updateAppointment: async (id: number, appointmentData: AppointmentUpdate) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedAppointment: Appointment = {
        ...get().appointments.find(a => a.id === id)!,
        ...appointmentData,
        updatedAt: new Date().toISOString(),
      };
      
      set(state => ({
        appointments: state.appointments.map(appointment =>
          appointment.id === id ? updatedAppointment : appointment
        ),
        currentAppointment: state.currentAppointment?.id === id ? updatedAppointment : state.currentAppointment,
        isLoading: false,
        error: null,
      }));
      
      return updatedAppointment;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao atualizar agendamento',
      });
      throw error;
    }
  },

  cancelAppointment: async (id: number, reason?: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const updatedAppointment: Appointment = {
        ...get().appointments.find(a => a.id === id)!,
        status: 'cancelled',
        notes: reason ? `${get().appointments.find(a => a.id === id)?.notes || ''}\n\nCancelado: ${reason}` : get().appointments.find(a => a.id === id)?.notes,
        updatedAt: new Date().toISOString(),
      };
      
      set(state => ({
        appointments: state.appointments.map(appointment =>
          appointment.id === id ? updatedAppointment : appointment
        ),
        currentAppointment: state.currentAppointment?.id === id ? updatedAppointment : state.currentAppointment,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao cancelar agendamento',
      });
    }
  },

  confirmAppointment: async (id: number) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedAppointment: Appointment = {
        ...get().appointments.find(a => a.id === id)!,
        status: 'confirmed',
        updatedAt: new Date().toISOString(),
      };
      
      set(state => ({
        appointments: state.appointments.map(appointment =>
          appointment.id === id ? updatedAppointment : appointment
        ),
        currentAppointment: state.currentAppointment?.id === id ? updatedAppointment : state.currentAppointment,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao confirmar agendamento',
      });
    }
  },

  completeAppointment: async (id: number) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedAppointment: Appointment = {
        ...get().appointments.find(a => a.id === id)!,
        status: 'completed',
        updatedAt: new Date().toISOString(),
      };
      
      set(state => ({
        appointments: state.appointments.map(appointment =>
          appointment.id === id ? updatedAppointment : appointment
        ),
        currentAppointment: state.currentAppointment?.id === id ? updatedAppointment : state.currentAppointment,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao finalizar agendamento',
      });
    }
  },

  setCurrentAppointment: (appointment: Appointment | null) => {
    set({ currentAppointment: appointment });
  },

  setFilters: (filters: AppointmentFilters) => {
    set({ filters });
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
