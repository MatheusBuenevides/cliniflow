import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, List, Grid, Clock } from 'lucide-react';
import { useAppointmentStore } from '../../stores/useAppointmentStore';
import type { Appointment, CalendarProps } from '../../types';
import { DayView } from './DayView';
import { WeekView } from './WeekView';
import { MonthView } from './MonthView';
import { ListView } from './ListView';

export type CalendarView = 'day' | 'week' | 'month' | 'list';

interface CalendarState {
  currentDate: Date;
  selectedDate: Date;
  view: CalendarView;
}

// Componente memoizado para otimizar re-renders
const CalendarHeader = memo<{
  currentDate: Date;
  view: CalendarView;
  onNavigate: (direction: 'prev' | 'next') => void;
  onGoToToday: () => void;
}>(({ currentDate, view, onNavigate, onGoToToday }) => {
  const formatDateRange = useCallback(() => {
    switch (view) {
      case 'day':
        return currentDate.toLocaleDateString('pt-BR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'week':
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        return `${startOfWeek.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} - ${endOfWeek.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
      case 'month':
        return currentDate.toLocaleDateString('pt-BR', {
          year: 'numeric',
          month: 'long'
        });
      case 'list':
        return 'Próximos Agendamentos';
      default:
        return '';
    }
  }, [currentDate, view]);

  return (
    <div className="flex items-center justify-between p-6 border-b border-slate-200">
      <div className="flex items-center space-x-4">
        <h2 className="text-2xl font-bold text-slate-800">
          {formatDateRange()}
        </h2>
        <button
          onClick={onGoToToday}
          className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
        >
          Hoje
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onNavigate('prev')}
          className="p-2 rounded-md hover:bg-slate-100 transition-colors"
          aria-label="Período anterior"
        >
          <ChevronLeft className="h-5 w-5 text-slate-600" />
        </button>
        
        <button
          onClick={() => onNavigate('next')}
          className="p-2 rounded-md hover:bg-slate-100 transition-colors"
          aria-label="Próximo período"
        >
          <ChevronRight className="h-5 w-5 text-slate-600" />
        </button>
      </div>
    </div>
  );
});

CalendarHeader.displayName = 'CalendarHeader';

// Componente memoizado para o seletor de visualização
const ViewSelector = memo<{
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
}>(({ currentView, onViewChange }) => {
  const views = [
    { id: 'day', label: 'Dia', icon: Clock },
    { id: 'week', label: 'Semana', icon: Calendar },
    { id: 'month', label: 'Mês', icon: Grid },
    { id: 'list', label: 'Lista', icon: List }
  ] as const;

  return (
    <div className="flex items-center space-x-1 bg-white rounded-lg p-1 shadow-sm">
      {views.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onViewChange(id)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            currentView === id
              ? 'bg-purple-600 text-white'
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
});

ViewSelector.displayName = 'ViewSelector';

// Componente memoizado para estatísticas rápidas
const QuickStats = memo<{
  appointments: Appointment[];
}>(({ appointments }) => {
  const stats = useMemo(() => {
    const completed = appointments.filter(a => a.status === 'completed').length;
    const scheduled = appointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').length;
    const cancelled = appointments.filter(a => a.status === 'cancelled').length;

    return { completed, scheduled, cancelled };
  }, [appointments]);

  return (
    <div className="flex items-center space-x-4 text-sm text-slate-600">
      <div className="flex items-center space-x-1">
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span>Realizadas: {stats.completed}</span>
      </div>
      <div className="flex items-center space-x-1">
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        <span>Agendadas: {stats.scheduled}</span>
      </div>
      <div className="flex items-center space-x-1">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <span>Canceladas: {stats.cancelled}</span>
      </div>
    </div>
  );
});

QuickStats.displayName = 'QuickStats';

// Componente principal otimizado
export const CalendarOptimized: React.FC<CalendarProps> = ({
  appointments,
  onSlotClick,
  onAppointmentClick,
  availableSlots = [],
  blockedSlots = []
}) => {
  const [state, setState] = useState<CalendarState>({
    currentDate: new Date(),
    selectedDate: new Date(),
    view: 'month'
  });

  const { isLoading } = useAppointmentStore();

  // Memoizar a navegação para evitar re-renders desnecessários
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

  // Memoizar props comuns para evitar re-renders
  const commonProps = useMemo(() => ({
    appointments,
    selectedDate: state.selectedDate,
    onAppointmentClick,
    onSlotClick,
    availableSlots,
    blockedSlots
  }), [appointments, state.selectedDate, onAppointmentClick, onSlotClick, availableSlots, blockedSlots]);

  // Renderizar view com lazy loading
  const renderView = useMemo(() => {
    const props = { ...commonProps, currentDate: state.currentDate };

    switch (state.view) {
      case 'day':
        return <DayView {...props} />;
      case 'week':
        return <WeekView {...props} />;
      case 'month':
        return <MonthView {...props} />;
      case 'list':
        return <ListView {...props} />;
      default:
        return <MonthView {...props} />;
    }
  }, [state.view, state.currentDate, commonProps]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-slate-600">Carregando agenda...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
      {/* Header do Calendário */}
      <CalendarHeader
        currentDate={state.currentDate}
        view={state.view}
        onNavigate={navigateDate}
        onGoToToday={goToToday}
      />

      {/* Seletor de Visualização */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
        <ViewSelector
          currentView={state.view}
          onViewChange={setView}
        />

        <QuickStats appointments={appointments} />
      </div>

      {/* Conteúdo da Visualização */}
      <div className="p-6">
        {renderView}
      </div>
    </div>
  );
};

// Componente de loading para lazy loading
export const CalendarLoading = memo(() => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
    <div className="p-6">
      <div className="animate-pulse">
        <div className="h-8 bg-slate-200 rounded mb-4"></div>
        <div className="h-64 bg-slate-200 rounded"></div>
      </div>
    </div>
  </div>
));

CalendarLoading.displayName = 'CalendarLoading';
