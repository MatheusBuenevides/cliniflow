// Tipos principais do sistema CliniFlow - Plataforma para Psicólogos

// ===== PSICÓLOGO =====
export interface Psychologist {
  id: number;
  name: string;
  crp: string; // Registro no Conselho Regional de Psicologia
  email: string;
  phone: string;
  avatar?: string;
  bio: string; // Descrição da abordagem e especialidades
  specialties: string[]; // Lista de especialidades
  customUrl: string; // URL personalizada (ex: "ana-silva")
  workingHours: WorkingHours;
  sessionPrices: SessionPrices;
  createdAt: string;
  updatedAt: string;
}

export interface WorkingHours {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule | null;
}

export interface DaySchedule {
  start: string; // Formato: "08:00"
  end: string; // Formato: "18:00"
  lunchStart?: string; // Formato: "12:00"
  lunchEnd?: string; // Formato: "13:00"
}

export interface SessionPrices {
  initial: number; // Primeira consulta
  followUp: number; // Consulta de retorno
  online: number; // Telepsicologia
  duration: number; // Duração em minutos (30, 45, 60)
}

// ===== PACIENTE =====
export interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthDate?: string; // ISO date string
  cpf?: string;
  rg?: string;
  address?: Address;
  maritalStatus?: string;
  profession?: string;
  emergencyContact?: EmergencyContact;
  medicalHistory?: MedicalHistory;
  createdAt: string;
  updatedAt: string;
  psychologistId: number;
}

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

// Tipos para criação e atualização de pacientes
export type PatientCreate = Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>;
export type PatientUpdate = Partial<Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>>;

// ===== AGENDAMENTOS =====
export interface Appointment {
  id: number;
  patientId: number;
  patient: Pick<Patient, 'id' | 'name' | 'phone' | 'email'>;
  psychologistId: number;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // Formato: "HH:MM"
  duration: number; // Duração em minutos
  type: AppointmentType;
  modality: SessionModality;
  status: AppointmentStatus;
  price: number;
  notes?: string;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  videoRoomId?: string; // Para sessões online
  createdAt: string;
  updatedAt: string;
}

export type AppointmentType = 'initial' | 'followUp' | 'emergency' | 'supervision';
export type SessionModality = 'inPerson' | 'online';
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'inProgress' | 'completed' | 'cancelled' | 'noShow';
export type PaymentStatus = 'pending' | 'paid' | 'cancelled' | 'refunded';

// Tipos para criação e atualização de agendamentos
export type AppointmentCreate = Omit<Appointment, 'id' | 'patient' | 'createdAt' | 'updatedAt'>;
export type AppointmentUpdate = Partial<Omit<Appointment, 'id' | 'patient' | 'createdAt' | 'updatedAt'>>;

// ===== PRONTUÁRIO E SESSÕES =====
export interface SessionRecord {
  id: number;
  appointmentId: number;
  patientId: number;
  psychologistId: number;
  sessionNumber: number; // Número sequencial da sessão
  date: string; // ISO date string
  duration: number; // Duração real em minutos
  mainComplaint?: string;
  clinicalObservations: string; // Criptografado
  therapeuticPlan?: string; // Criptografado
  evolution?: string; // Criptografado
  homeworkAssigned?: string; // Criptografado
  tags: string[]; // Para categorização
  attachments?: SessionAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface SessionAttachment {
  id: number;
  sessionId: number;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  description?: string;
  uploadedAt: string;
}

export interface SessionTag {
  id: number;
  name: string;
  color?: string;
  psychologistId: number;
}

// ===== TELEPSICOLOGIA =====
export interface VideoSession {
  id: string;
  appointmentId: number;
  roomId: string;
  startTime?: string;
  endTime?: string;
  participantIds: number[];
  status: VideoSessionStatus;
  recordingEnabled: boolean;
  chatMessages?: ChatMessage[];
  connectionQuality?: ConnectionQuality;
}

export type VideoSessionStatus = 'waiting' | 'active' | 'ended' | 'cancelled';

export interface ChatMessage {
  id: string;
  senderId: number;
  senderName: string;
  message: string;
  timestamp: string;
  type: 'text' | 'link' | 'file';
}

export interface ConnectionQuality {
  video: 'excellent' | 'good' | 'fair' | 'poor';
  audio: 'excellent' | 'good' | 'fair' | 'poor';
  latency: number; // em ms
  bandwidth: number; // em kbps
}

// ===== FINANCEIRO =====
export interface Transaction {
  id: number;
  appointmentId?: number;
  psychologistId: number;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  amount: number;
  date: string; // ISO date string
  paymentMethod?: PaymentMethod;
  paymentId?: string; // ID do gateway de pagamento
  status: TransactionStatus;
  receipt?: string; // URL do comprovante
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = 'income' | 'expense';
export type TransactionCategory = 
  // Receitas
  | 'consultation' | 'supervision' | 'workshop' | 'other_income'
  // Despesas
  | 'rent' | 'supervision_cost' | 'education' | 'materials' | 'marketing' | 'taxes' | 'other_expense';

export type PaymentMethod = 'creditCard' | 'debitCard' | 'pix' | 'boleto' | 'cash' | 'transfer';
export type TransactionStatus = 'pending' | 'completed' | 'cancelled' | 'refunded';

export interface PaymentLink {
  id: string;
  appointmentId: number;
  amount: number;
  description: string;
  url: string;
  expiresAt: string;
  status: 'active' | 'paid' | 'expired' | 'cancelled';
  createdAt: string;
  paymentMethod?: PaymentMethod;
  pixCode?: string;
  qrCode?: string;
  boletoUrl?: string;
}

// ===== SISTEMA DE CONFIRMAÇÃO E PAGAMENTO =====
export interface BookingConfirmation {
  id: string;
  appointmentId: number;
  confirmationCode: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  modality: SessionModality;
  price: number;
  paymentStatus: PaymentStatus;
  paymentLink?: PaymentLink;
  instructions: BookingInstructions;
  emergencyContact?: EmergencyContact;
  createdAt: string;
  expiresAt: string;
}

export interface BookingInstructions {
  generalInstructions: string;
  onlineInstructions?: string;
  inPersonInstructions?: string;
  preparationNotes?: string;
  cancellationPolicy: string;
  reschedulingPolicy: string;
  contactInfo: {
    phone: string;
    email: string;
    whatsapp?: string;
  };
}

export interface PaymentMethodInfo {
  id: string;
  name: string;
  type: PaymentMethod;
  icon: string;
  description: string;
  processingTime: string;
  fees?: number;
  isAvailable: boolean;
}

export interface PaymentStatusInfo {
  status: PaymentStatus;
  message: string;
  icon: string;
  color: string;
  nextSteps?: string[];
  canRetry: boolean;
  canCancel: boolean;
}

export interface NotificationTemplate {
  id: string;
  type: 'email' | 'sms' | 'whatsapp';
  event: 'booking_confirmation' | 'payment_reminder' | 'appointment_reminder' | 'payment_received';
  subject?: string;
  template: string;
  variables: string[];
  isActive: boolean;
}

// ===== RELATÓRIOS FINANCEIROS =====
export interface FinancialReport {
  period: {
    start: string;
    end: string;
  };
  income: {
    total: number;
    byCategory: Record<TransactionCategory, number>;
    byMonth: MonthlyRevenue[];
  };
  expenses: {
    total: number;
    byCategory: Record<TransactionCategory, number>;
    byMonth: MonthlyExpense[];
  };
  netProfit: number;
  consultationStats: {
    total: number;
    completed: number;
    cancelled: number;
    noShow: number;
    averageValue: number;
  };
}

export interface MonthlyRevenue {
  month: string; // YYYY-MM
  amount: number;
  consultations: number;
}

export interface MonthlyExpense {
  month: string; // YYYY-MM
  amount: number;
}

// ===== CONFIGURAÇÕES =====
export interface SystemSettings {
  psychologist: Psychologist;
  notifications: NotificationSettings;
  appointment: AppointmentSettings;
  payment: PaymentSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  emailReminders: boolean;
  whatsappReminders: boolean;
  reminderHours: number; // Horas antes da consulta
  paymentReminders: boolean;
  systemNotifications: boolean;
}

export interface AppointmentSettings {
  allowOnlineBooking: boolean;
  bookingAdvanceDays: number; // Quantos dias à frente podem agendar
  cancellationHours: number; // Horas mínimas para cancelar
  automaticConfirmation: boolean;
  bufferMinutes: number; // Intervalo entre consultas
}

export interface PaymentSettings {
  gatewayProvider: 'stripe' | 'pagseguro' | 'mercadopago';
  autoSendPaymentLinks: boolean;
  acceptedMethods: PaymentMethod[];
  installments: {
    enabled: boolean;
    maxInstallments: number;
  };
}

export interface PrivacySettings {
  dataRetentionMonths: number;
  encryptionEnabled: boolean;
  auditLogEnabled: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
}

// ===== NOTIFICAÇÕES =====
export interface Notification {
  id: string;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
}

export type NotificationType = 
  | 'appointment_reminder'
  | 'payment_received'
  | 'payment_overdue'
  | 'appointment_cancelled'
  | 'system_update'
  | 'backup_completed';

// ===== PÁGINA PÚBLICA =====
export interface PublicProfile {
  psychologistId: number;
  customUrl: string;
  name: string;
  crp: string;
  avatar?: string;
  bio: string;
  specialties: string[];
  sessionPrices: SessionPrices;
  availableSlots: AvailableSlot[];
  testimonials?: Testimonial[];
}

export interface AvailableSlot {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number;
  modality: SessionModality;
  price: number;
}

export interface Testimonial {
  id: number;
  initials: string; // Ex: "A.S."
  text: string;
  rating: number; // 1-5
  date: string;
}

// ===== API E ESTADOS =====
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// ===== HOOKS =====
export interface UseAsyncReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// ===== FORMULÁRIOS =====
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

// ===== SISTEMA DE AGENDAMENTO ONLINE =====
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

export interface SessionNotesForm {
  mainComplaint?: string;
  clinicalObservations: string;
  therapeuticPlan?: string;
  evolution?: string;
  homeworkAssigned?: string;
  tags: string[];
}

// ===== VALIDAÇÃO =====
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message: string;
}

export interface ValidationErrors {
  [field: string]: string;
}

// ===== EVENTOS DO SISTEMA =====
export interface SystemEvent {
  id: string;
  type: EventType;
  data: any;
  timestamp: string;
  userId: number;
}

export type EventType = 
  | 'appointment_created'
  | 'appointment_updated'
  | 'appointment_cancelled'
  | 'patient_created'
  | 'patient_updated'
  | 'session_completed'
  | 'payment_received'
  | 'video_session_started'
  | 'video_session_ended';

// ===== UTILITÁRIOS =====
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// ===== FILTROS E BUSCA =====
export interface AppointmentFilters {
  startDate?: string;
  endDate?: string;
  status?: AppointmentStatus[];
  modality?: SessionModality;
  paymentStatus?: PaymentStatus;
  patientId?: number;
}

export interface PatientFilters {
  search?: string;
  sortBy?: 'name' | 'createdAt' | 'lastAppointment';
  sortOrder?: 'asc' | 'desc';
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  type?: TransactionType;
  category?: TransactionCategory;
  status?: TransactionStatus;
}

// ===== COMPONENTES UI =====
export interface CalendarProps {
  appointments: Appointment[];
  onSlotClick: (date: string, time: string) => void;
  onAppointmentClick: (appointment: Appointment) => void;
  availableSlots?: AvailableSlot[];
  blockedSlots?: string[];
}

export interface VideoRoomProps {
  sessionId: string;
  participantType: 'psychologist' | 'patient';
  onSessionEnd: () => void;
}

// ===== TIPOS DE CONTEXTO =====
export interface AuthContext {
  user: Psychologist | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface AppointmentContext {
  appointments: Appointment[];
  currentAppointment: Appointment | null;
  fetchAppointments: (filters?: AppointmentFilters) => Promise<void>;
  createAppointment: (data: AppointmentCreate) => Promise<Appointment>;
  updateAppointment: (id: number, data: AppointmentUpdate) => Promise<Appointment>;
  cancelAppointment: (id: number, reason?: string) => Promise<void>;
}

export interface VideoContext {
  currentSession: VideoSession | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'failed';
  startSession: (appointmentId: number) => Promise<void>;
  endSession: () => Promise<void>;
  sendChatMessage: (message: string) => void;
  toggleVideo: () => void;
  toggleAudio: () => void;
}

// ===== RE-EXPORTS PARA COMPATIBILIDADE =====
// Os tipos de agendamento foram movidos para types/booking.ts