// Tipos específicos para o sistema de agendamento online
import type { SessionModality, WorkingHours } from './index';

export interface TimeSlot {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // em minutos
  modality: SessionModality;
  price: number;
  isAvailable: boolean;
  isBlocked?: boolean;
  reason?: string; // motivo do bloqueio
}

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  hasAvailableSlots: boolean;
  slots: TimeSlot[];
}

export interface BookingStep {
  step: 'calendar' | 'time' | 'form' | 'confirmation';
  data?: Partial<AppointmentBookingForm>;
}

export interface BookingState {
  currentStep: BookingStep['step'];
  selectedDate?: string;
  selectedSlot?: TimeSlot;
  formData: Partial<AppointmentBookingForm>;
  isLoading: boolean;
  error?: string;
}

export interface AvailabilitySettings {
  workingHours: WorkingHours;
  sessionDuration: number; // duração padrão em minutos
  bufferTime: number; // intervalo entre consultas em minutos
  advanceBookingDays: number; // quantos dias à frente podem agendar
  cancellationHours: number; // horas mínimas para cancelar
  allowOnlineBooking: boolean;
  allowInPersonBooking: boolean;
  blockedDates: string[]; // datas bloqueadas (YYYY-MM-DD)
  blockedTimes: { date: string; times: string[] }[]; // horários específicos bloqueados
}

export interface AppointmentBookingForm {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  birthDate?: string;
  selectedSlot: {
    date: string;
    time: string;
    duration: number;
    modality: SessionModality;
    price: number;
  };
  isFirstTime: boolean;
  notes?: string;
  termsAccepted: boolean;
}
