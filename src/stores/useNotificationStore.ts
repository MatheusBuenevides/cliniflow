import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Notification, NotificationType } from '../types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

interface NotificationActions {
  // Getters
  getNotifications: () => Notification[];
  getUnreadNotifications: () => Notification[];
  getNotificationsByType: (type: NotificationType) => Notification[];
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  
  // Simulação de notificações automáticas
  simulateAppointmentReminder: (appointmentId: number, patientName: string, appointmentTime: string) => void;
  simulatePaymentReceived: (amount: number, patientName: string) => void;
  simulateSystemUpdate: (message: string) => void;
  
  // Utilitários
  updateUnreadCount: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type NotificationStore = NotificationState & NotificationActions;

// Dados mockados para demonstração
const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: 1,
    type: 'appointment_reminder',
    title: 'Lembrete de Consulta',
    message: 'Consulta com Maria Silva em 30 minutos (14:00)',
    data: { appointmentId: 1, patientName: 'Maria Silva', appointmentTime: '14:00' },
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min atrás
  },
  {
    id: '2',
    userId: 1,
    type: 'payment_received',
    title: 'Pagamento Recebido',
    message: 'R$ 150,00 recebido de João Santos',
    data: { amount: 150, patientName: 'João Santos', paymentId: 'pay_123' },
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2h atrás
  },
  {
    id: '3',
    userId: 1,
    type: 'system_update',
    title: 'Atualização do Sistema',
    message: 'Nova funcionalidade: Relatórios financeiros aprimorados disponível',
    data: { version: '1.2.0', feature: 'financial_reports' },
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 dia atrás
  },
  {
    id: '4',
    userId: 1,
    type: 'appointment_cancelled',
    title: 'Consulta Cancelada',
    message: 'Ana Costa cancelou a consulta de amanhã às 10:00',
    data: { appointmentId: 2, patientName: 'Ana Costa', appointmentTime: '10:00' },
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4h atrás
  },
  {
    id: '5',
    userId: 1,
    type: 'payment_overdue',
    title: 'Pagamento em Atraso',
    message: 'Pedro Oliveira tem pagamento pendente há 3 dias',
    data: { amount: 200, patientName: 'Pedro Oliveira', daysOverdue: 3 },
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6h atrás
  },
];

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      notifications: mockNotifications,
      unreadCount: 0,
      isLoading: false,
      error: null,

      // Getters
      getNotifications: () => {
        const { notifications } = get();
        return notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getUnreadNotifications: () => {
        const { notifications } = get();
        return notifications.filter(n => !n.isRead);
      },

      getNotificationsByType: (type: NotificationType) => {
        const { notifications } = get();
        return notifications.filter(n => n.type === type);
      },

      // Actions
      addNotification: (notificationData) => {
        const newNotification: Notification = {
          ...notificationData,
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },

      markAsRead: (notificationId) => {
        set((state) => {
          const updatedNotifications = state.notifications.map(notification =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification
          );

          const unreadCount = updatedNotifications.filter(n => !n.isRead).length;

          return {
            notifications: updatedNotifications,
            unreadCount,
          };
        });
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(notification => ({
            ...notification,
            isRead: true,
          })),
          unreadCount: 0,
        }));
      },

      removeNotification: (notificationId) => {
        set((state) => {
          const notification = state.notifications.find(n => n.id === notificationId);
          const wasUnread = notification && !notification.isRead;
          
          return {
            notifications: state.notifications.filter(n => n.id !== notificationId),
            unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount,
          };
        });
      },

      clearAllNotifications: () => {
        set({
          notifications: [],
          unreadCount: 0,
        });
      },

      // Simulações de notificações automáticas
      simulateAppointmentReminder: (appointmentId, patientName, appointmentTime) => {
        const { addNotification } = get();
        addNotification({
          userId: 1,
          type: 'appointment_reminder',
          title: 'Lembrete de Consulta',
          message: `Consulta com ${patientName} em 30 minutos (${appointmentTime})`,
          data: { appointmentId, patientName, appointmentTime },
          isRead: false,
        });
      },

      simulatePaymentReceived: (amount, patientName) => {
        const { addNotification } = get();
        addNotification({
          userId: 1,
          type: 'payment_received',
          title: 'Pagamento Recebido',
          message: `R$ ${amount.toFixed(2).replace('.', ',')} recebido de ${patientName}`,
          data: { amount, patientName, paymentId: `pay_${Date.now()}` },
          isRead: false,
        });
      },

      simulateSystemUpdate: (message) => {
        const { addNotification } = get();
        addNotification({
          userId: 1,
          type: 'system_update',
          title: 'Atualização do Sistema',
          message,
          data: { version: '1.2.0', timestamp: Date.now() },
          isRead: false,
        });
      },

      // Utilitários
      updateUnreadCount: () => {
        const { notifications } = get();
        const unreadCount = notifications.filter(n => !n.isRead).length;
        set({ unreadCount });
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'cliniFlow-notifications',
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    }
  )
);

// Hook para facilitar o uso
export const useNotifications = () => {
  const store = useNotificationStore();
  
  return {
    // Estado
    notifications: store.getNotifications(),
    unreadNotifications: store.getUnreadNotifications(),
    unreadCount: store.unreadCount,
    isLoading: store.isLoading,
    error: store.error,
    
    // Actions
    addNotification: store.addNotification,
    markAsRead: store.markAsRead,
    markAllAsRead: store.markAllAsRead,
    removeNotification: store.removeNotification,
    clearAllNotifications: store.clearAllNotifications,
    
    // Simulações
    simulateAppointmentReminder: store.simulateAppointmentReminder,
    simulatePaymentReceived: store.simulatePaymentReceived,
    simulateSystemUpdate: store.simulateSystemUpdate,
    
    // Utilitários
    getNotificationsByType: store.getNotificationsByType,
  };
};
