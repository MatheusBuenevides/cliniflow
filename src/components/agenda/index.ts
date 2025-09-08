// Componentes do sistema de agendamento online
export { default as AppointmentForm } from './AppointmentForm';
export { default as AvailabilityCalendar } from './AvailabilityCalendar';
export { default as TimeSlotGrid } from './TimeSlotGrid';
export { default as PatientDataForm } from './PatientDataForm';
export { default as BookingConfirmation } from './BookingConfirmation';

// Re-exportar tipos relacionados
export type {
  TimeSlot,
  CalendarDay,
  BookingStep,
  BookingState,
  AvailabilitySettings,
  AppointmentBookingForm
} from '../../types/booking';
