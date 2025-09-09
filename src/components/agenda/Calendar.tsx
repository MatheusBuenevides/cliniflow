import React, { useState, useEffect } from 'react';
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

export const Calendar: React.FC<CalendarProps> = ({
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

  const navigateDate = (direction: 'prev' | 'next') => {
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
  };

  const goToToday = () => {
    const today = new Date();
    setState(prev => ({ ...prev, currentDate: today, selectedDate: today }));
  };

  const setView = (view: CalendarView) => {
    setState(prev => ({ ...prev, view }));
  };

  const setSelectedDate = (date: Date) => {
    setState(prev => ({ ...prev, selectedDate: date }));
  };

  const formatDateRange = () => {
    const { currentDate, view } = state;
    
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
  };

  const renderView = () => {
    const commonProps = {
      appointments,
      selectedDate: state.selectedDate,
      onAppointmentClick,
      onSlotClick,
      availableSlots,
      blockedSlots
    };

    switch (state.view) {
      case 'day':
        return <DayView {...commonProps} currentDate={state.currentDate} />;
      case 'week':
        return <WeekView {...commonProps} currentDate={state.currentDate} />;
      case 'month':
        return <MonthView {...commonProps} currentDate={state.currentDate} />;
      case 'list':
        return <ListView {...commonProps} currentDate={state.currentDate} />;
      default:
        return <MonthView {...commonProps} currentDate={state.currentDate} />;
    }
  };

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
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-slate-800">
            {formatDateRange()}
          </h2>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
          >
            Hoje
          </button>
        </div>

        {/* Controles de Navegação */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 rounded-md hover:bg-slate-100 transition-colors"
            aria-label="Período anterior"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </button>
          
          <button
            onClick={() => navigateDate('next')}
            className="p-2 rounded-md hover:bg-slate-100 transition-colors"
            aria-label="Próximo período"
          >
            <ChevronRight className="h-5 w-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Seletor de Visualização */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center space-x-1 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setView('day')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              state.view === 'day'
                ? 'bg-purple-600 text-white'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Dia</span>
          </button>
          
          <button
            onClick={() => setView('week')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              state.view === 'week'
                ? 'bg-purple-600 text-white'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Semana</span>
          </button>
          
          <button
            onClick={() => setView('month')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              state.view === 'month'
                ? 'bg-purple-600 text-white'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Grid className="h-4 w-4" />
            <span>Mês</span>
          </button>
          
          <button
            onClick={() => setView('list')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              state.view === 'list'
                ? 'bg-purple-600 text-white'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <List className="h-4 w-4" />
            <span>Lista</span>
          </button>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="flex items-center space-x-4 text-sm text-slate-600">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Realizadas: {appointments.filter(a => a.status === 'completed').length}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Agendadas: {appointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').length}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Canceladas: {appointments.filter(a => a.status === 'cancelled').length}</span>
          </div>
        </div>
      </div>

      {/* Conteúdo da Visualização */}
      <div className="p-6">
        {renderView()}
      </div>
    </div>
  );
};
