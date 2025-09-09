import { useState, useCallback, useMemo, useEffect } from 'react';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import type { Appointment, AppointmentFilters } from '../types';

export type CalendarView = 'day' | 'week' | 'month' | 'list';

interface CalendarState {
  currentDate: Date;
  selectedDate: Date;
  view: CalendarView;
  filters: AppointmentFilters;
}

interface UseCalendarReturn {
  // Estado
  state: CalendarState;
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  
  // Ações de navegação
  navigateDate: (direction: 'prev' | 'next') => void;
  goToToday: () => void;
  setView: (view: CalendarView) => void;
  setSelectedDate: (date: Date) => void;
  
  // Ações de filtro
  setFilters: (filters: AppointmentFilters) => void;
  clearFilters: () => void;
  
  // Ações de agendamento
  refreshAppointments: () => Promise<void>;
  
  // Dados computados
  filteredAppointments: Appointment[];
  dateRange: { start: Date; end: Date };
  stats: {
    total: number;
    completed: number;
    scheduled: number;
    cancelled: number;
    revenue: number;
  };
}

export const useCalendar = (initialView: CalendarView = 'month'): UseCalendarReturn => {
  const [state, setState] = useState<CalendarState>({
    currentDate: new Date(),
    selectedDate: new Date(),
    view: initialView,
    filters: {}
  });

  const { 
    appointments, 
    isLoading, 
    error, 
    fetchAppointments, 
    clearError 
  } = useAppointmentStore();

  // Calcular range de datas baseado na view atual
  const dateRange = useMemo(() => {
    const { currentDate, view } = state;
    
    switch (view) {
      case 'day':
        return {
          start: new Date(currentDate),
          end: new Date(currentDate)
        };
      case 'week':
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return { start: startOfWeek, end: endOfWeek };
      case 'month':
        return {
          start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
          end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
        };
      case 'list':
        const start = new Date();
        const end = new Date();
        end.setDate(start.getDate() + 30);
        return { start, end };
      default:
        return { start: new Date(), end: new Date() };
    }
  }, [state.currentDate, state.view]);

  // Filtrar agendamentos baseado no range de datas e filtros
  const filteredAppointments = useMemo(() => {
    let filtered = [...appointments];

    // Filtrar por range de datas
    filtered = filtered.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= dateRange.start && appointmentDate <= dateRange.end;
    });

    // Aplicar filtros adicionais
    if (state.filters.status && state.filters.status.length > 0) {
      filtered = filtered.filter(appointment =>
        state.filters.status!.includes(appointment.status)
      );
    }

    if (state.filters.modality) {
      filtered = filtered.filter(appointment =>
        appointment.modality === state.filters.modality
      );
    }

    if (state.filters.paymentStatus) {
      filtered = filtered.filter(appointment =>
        appointment.paymentStatus === state.filters.paymentStatus
      );
    }

    if (state.filters.patientId) {
      filtered = filtered.filter(appointment =>
        appointment.patientId === state.filters.patientId
      );
    }

    // Ordenar por data e hora
    return filtered.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
  }, [appointments, dateRange, state.filters]);

  // Calcular estatísticas
  const stats = useMemo(() => {
    const completed = filteredAppointments.filter(a => a.status === 'completed').length;
    const scheduled = filteredAppointments.filter(a => 
      a.status === 'scheduled' || a.status === 'confirmed'
    ).length;
    const cancelled = filteredAppointments.filter(a => a.status === 'cancelled').length;
    const revenue = filteredAppointments
      .filter(a => a.status === 'completed')
      .reduce((sum, a) => sum + a.price, 0);

    return {
      total: filteredAppointments.length,
      completed,
      scheduled,
      cancelled,
      revenue
    };
  }, [filteredAppointments]);

  // Navegação de datas
  const navigateDate = useCallback((direction: 'prev' | 'next') => {
    const newDate = new Date(state.currentDate);
    
    switch (state.view) {
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'list':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
    }
    
    setState(prev => ({ ...prev, currentDate: newDate }));
  }, [state.currentDate, state.view]);

  const goToToday = useCallback(() => {
    const today = new Date();
    setState(prev => ({ ...prev, currentDate: today, selectedDate: today }));
  }, []);

  const setView = useCallback((view: CalendarView) => {
    setState(prev => ({ ...prev, view }));
  }, []);

  const setSelectedDate = useCallback((date: Date) => {
    setState(prev => ({ ...prev, selectedDate: date }));
  }, []);

  // Gerenciamento de filtros
  const setFilters = useCallback((filters: AppointmentFilters) => {
    setState(prev => ({ ...prev, filters }));
  }, []);

  const clearFilters = useCallback(() => {
    setState(prev => ({ ...prev, filters: {} }));
  }, []);

  // Refresh de agendamentos
  const refreshAppointments = useCallback(async () => {
    const filters = {
      startDate: dateRange.start.toISOString().split('T')[0],
      endDate: dateRange.end.toISOString().split('T')[0],
      ...state.filters
    };

    await fetchAppointments(filters);
  }, [dateRange, state.filters, fetchAppointments]);

  // Carregar agendamentos quando o range de datas ou filtros mudarem
  useEffect(() => {
    refreshAppointments();
  }, [refreshAppointments]);

  return {
    // Estado
    state,
    appointments: filteredAppointments,
    isLoading,
    error,
    
    // Ações de navegação
    navigateDate,
    goToToday,
    setView,
    setSelectedDate,
    
    // Ações de filtro
    setFilters,
    clearFilters,
    
    // Ações de agendamento
    refreshAppointments,
    
    // Dados computados
    filteredAppointments,
    dateRange,
    stats
  };
};
