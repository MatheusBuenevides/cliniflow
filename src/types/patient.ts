// Tipos relacionados a pacientes

export type PaymentStatus = 'pending' | 'paid' | 'cancelled' | 'refunded';

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface MedicalHistory {
  medications?: string[];
  psychiatricHistory?: string;
  allergies?: string[];
  otherTreatments?: string;
  observations?: string;
}

export interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthDate?: string;
  cpf?: string;
  rg?: string;
  address?: Address;
  maritalStatus?: string;
  profession?: string;
  emergencyContact?: EmergencyContact;
  medicalHistory?: MedicalHistory;
  avatar?: string;
  status: 'active' | 'inactive';
  lastAppointment?: string;
  totalAppointments: number;
  nextAppointment?: string;
  paymentStatus?: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  psychologistId: number;
}

export type PatientCreate = Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>;
export type PatientUpdate = Partial<Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>>;

export interface PatientFilters {
  search?: string;
  sortBy?: 'name' | 'createdAt' | 'lastAppointment';
  sortOrder?: 'asc' | 'desc';
  status?: 'active' | 'inactive' | 'all';
  period?: {
    start: string;
    end: string;
  };
  paymentStatus?: PaymentStatus;
}

export interface PatientStats {
  total: number;
  active: number;
  newThisMonth: number;
  lastAppointment: {
    patientId: number;
    patientName: string;
    date: string;
  } | null;
}

export type PatientViewMode = 'list' | 'cards';

export interface SavedFilter {
  id: string;
  name: string;
  filters: PatientFilters;
  createdAt: string;
}