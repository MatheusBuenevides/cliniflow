// Exportar todas as stores do Zustand
export { useAuthStore } from './useAuthStore';
export { usePatientStore } from './usePatientStore';
export { useAppointmentStore } from './useAppointmentStore';
export { useFinancialStore } from './useFinancialStore';
export { useVideoStore } from './useVideoStore';
export { useSessionStore } from './useSessionStore';

// Manter compatibilidade com o store antigo (será removido futuramente)
export { AppProvider, useAppStore } from './AppStore';
