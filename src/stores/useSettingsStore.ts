import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SystemSettings, Psychologist, WorkingHours, SessionPrices, NotificationSettings, AppointmentSettings, PaymentSettings, PrivacySettings } from '../types';

interface SettingsState {
  settings: SystemSettings;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  updateProfile: (profile: Partial<Psychologist>) => void;
  updateWorkingHours: (workingHours: WorkingHours) => void;
  updateSessionPrices: (prices: SessionPrices) => void;
  updateNotificationSettings: (settings: NotificationSettings) => void;
  updateAppointmentSettings: (settings: AppointmentSettings) => void;
  updatePaymentSettings: (settings: PaymentSettings) => void;
  updatePrivacySettings: (settings: PrivacySettings) => void;
  resetSettings: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Configurações padrão
const defaultPsychologist: Psychologist = {
  id: 1,
  name: 'Dr. João Silva',
  crp: '06/123456',
  email: 'joao.silva@email.com',
  phone: '(11) 99999-9999',
  bio: 'Psicólogo clínico com mais de 10 anos de experiência em terapia cognitivo-comportamental. Especializado em transtornos de ansiedade e depressão.',
  specialties: ['Terapia Cognitivo-Comportamental', 'Psicologia Clínica'],
  customUrl: 'joao-silva',
  workingHours: {
    monday: { start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
    tuesday: { start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
    wednesday: { start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
    thursday: { start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
    friday: { start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
    saturday: { start: '08:00', end: '12:00' }
  },
  sessionPrices: {
    initial: 150.00,
    followUp: 120.00,
    online: 100.00,
    duration: 60
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const defaultNotificationSettings: NotificationSettings = {
  emailReminders: true,
  whatsappReminders: true,
  reminderHours: 24,
  paymentReminders: true,
  systemNotifications: true
};

const defaultAppointmentSettings: AppointmentSettings = {
  allowOnlineBooking: true,
  bookingAdvanceDays: 30,
  cancellationHours: 24,
  automaticConfirmation: true,
  bufferMinutes: 15
};

const defaultPaymentSettings: PaymentSettings = {
  gatewayProvider: 'stripe',
  autoSendPaymentLinks: true,
  acceptedMethods: ['creditCard', 'pix', 'boleto'],
  installments: {
    enabled: true,
    maxInstallments: 3
  }
};

const defaultPrivacySettings: PrivacySettings = {
  dataRetentionMonths: 12,
  encryptionEnabled: true,
  auditLogEnabled: true,
  backupFrequency: 'weekly'
};

const defaultSettings: SystemSettings = {
  psychologist: defaultPsychologist,
  notifications: defaultNotificationSettings,
  appointment: defaultAppointmentSettings,
  payment: defaultPaymentSettings,
  privacy: defaultPrivacySettings
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      isLoading: false,
      error: null,

      updateProfile: (profileUpdate) => {
        set((state) => ({
          settings: {
            ...state.settings,
            psychologist: {
              ...state.settings.psychologist,
              ...profileUpdate,
              updatedAt: new Date().toISOString()
            }
          }
        }));
      },

      updateWorkingHours: (workingHours) => {
        set((state) => ({
          settings: {
            ...state.settings,
            psychologist: {
              ...state.settings.psychologist,
              workingHours,
              updatedAt: new Date().toISOString()
            }
          }
        }));
      },

      updateSessionPrices: (sessionPrices) => {
        set((state) => ({
          settings: {
            ...state.settings,
            psychologist: {
              ...state.settings.psychologist,
              sessionPrices,
              updatedAt: new Date().toISOString()
            }
          }
        }));
      },

      updateNotificationSettings: (notifications) => {
        set((state) => ({
          settings: {
            ...state.settings,
            notifications
          }
        }));
      },

      updateAppointmentSettings: (appointment) => {
        set((state) => ({
          settings: {
            ...state.settings,
            appointment
          }
        }));
      },

      updatePaymentSettings: (payment) => {
        set((state) => ({
          settings: {
            ...state.settings,
            payment
          }
        }));
      },

      updatePrivacySettings: (privacy) => {
        set((state) => ({
          settings: {
            ...state.settings,
            privacy
          }
        }));
      },

      resetSettings: () => {
        set({
          settings: defaultSettings,
          error: null
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      }
    }),
    {
      name: 'cliniFlow-settings',
      partialize: (state) => ({ settings: state.settings })
    }
  )
);

// Selectors para facilitar o uso
export const useProfile = () => useSettingsStore((state) => state.settings.psychologist);
export const useWorkingHours = () => useSettingsStore((state) => state.settings.psychologist.workingHours);
export const useSessionPrices = () => useSettingsStore((state) => state.settings.psychologist.sessionPrices);
export const useNotificationSettings = () => useSettingsStore((state) => state.settings.notifications);
export const useAppointmentSettings = () => useSettingsStore((state) => state.settings.appointment);
export const usePaymentSettings = () => useSettingsStore((state) => state.settings.payment);
export const usePrivacySettings = () => useSettingsStore((state) => state.settings.privacy);
