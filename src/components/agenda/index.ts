// Componentes do sistema de agendamento online
export { default as AppointmentForm } from './AppointmentForm';
export { default as AvailabilityCalendar } from './AvailabilityCalendar';
export { default as TimeSlotGrid } from './TimeSlotGrid';
export { default as PatientDataForm } from './PatientDataForm';
export { default as BookingConfirmation } from './BookingConfirmation';

// Componentes do sistema de pagamento e confirmação
export { PaymentMethodSelector } from './PaymentMethodSelector';
export { PIXQRCode } from './PIXQRCode';
export { default as PaymentStatusComponent } from './PaymentStatus';
export { BookingInstructions } from './BookingInstructions';

// Re-exportar tipos relacionados
export type {
  TimeSlot,
  CalendarDay,
  BookingStep,
  BookingState,
  AvailabilitySettings,
  AppointmentBookingForm
} from '../../types/booking';
