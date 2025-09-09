import React from 'react';
import { Clock, MapPin, Video, User, Plus } from 'lucide-react';
import type { Appointment, AvailableSlot } from '../../types';

interface WeekViewProps {
  appointments: Appointment[];
  currentDate: Date;
  selectedDate: Date;
  onAppointmentClick: (appointment: Appointment) => void;
  onSlotClick: (date: string, time: string) => void;
  availableSlots?: AvailableSlot[];
  blockedSlots?: string[];
}

export const WeekView: React.FC<WeekViewProps> = ({
  appointments,
  currentDate,
  selectedDate,
  onAppointmentClick,
  onSlotClick,
  availableSlots = [],
  blockedSlots = []
}) => {
  // Calcular início da semana (domingo)
  const getWeekStart = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    return start;
  };

  const weekStart = getWeekStart(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    return day;
  });

  const getDayAppointments = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return appointments
      .filter(apt => apt.date === dateString)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 border-green-300 text-green-800';
      case 'confirmed': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'scheduled': return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'cancelled': return 'bg-red-100 border-red-300 text-red-800';
      case 'inProgress': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default: return 'bg-slate-100 border-slate-300 text-slate-800';
    }
  };

  const getModalityIcon = (modality: string) => {
    return modality === 'online' ? Video : MapPin;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isWeekend = (date: Date) => {
    return date.getDay() === 0 || date.getDay() === 6;
  };

  return (
    <div className="space-y-4">
      {/* Header da Semana */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">
            Semana de {weekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} a{' '}
            {weekDays[6].toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </h3>
          <p className="text-slate-600">
            {appointments.filter(apt => {
              const aptDate = new Date(apt.date);
              return aptDate >= weekStart && aptDate <= weekDays[6];
            }).length} agendamentos na semana
          </p>
        </div>
      </div>

      {/* Grid da Semana */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {/* Cabeçalho dos Dias */}
        <div className="grid grid-cols-7 border-b border-slate-200">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={`p-4 text-center border-r border-slate-200 last:border-r-0 ${
                isToday(day) ? 'bg-purple-50' : isWeekend(day) ? 'bg-slate-50' : 'bg-white'
              }`}
            >
              <div className={`text-sm font-medium ${
                isToday(day) ? 'text-purple-600' : isWeekend(day) ? 'text-slate-500' : 'text-slate-700'
              }`}>
                {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
              </div>
              <div className={`text-lg font-bold mt-1 ${
                isToday(day) ? 'text-purple-600' : isWeekend(day) ? 'text-slate-500' : 'text-slate-800'
              }`}>
                {day.getDate()}
              </div>
              <div className={`text-xs mt-1 ${
                isToday(day) ? 'text-purple-500' : 'text-slate-500'
              }`}>
                {day.toLocaleDateString('pt-BR', { month: 'short' })}
              </div>
            </div>
          ))}
        </div>

        {/* Conteúdo dos Dias */}
        <div className="grid grid-cols-7 min-h-[400px]">
          {weekDays.map((day, dayIndex) => {
            const dayAppointments = getDayAppointments(day);
            const dateString = day.toISOString().split('T')[0];
            
            return (
              <div
                key={dayIndex}
                className={`border-r border-slate-200 last:border-r-0 p-2 ${
                  isToday(day) ? 'bg-purple-50' : isWeekend(day) ? 'bg-slate-50' : 'bg-white'
                }`}
              >
                {/* Botão para adicionar agendamento */}
                <button
                  onClick={() => onSlotClick(dateString, '09:00')}
                  className={`w-full p-2 mb-2 rounded-md text-xs font-medium transition-colors ${
                    isWeekend(day)
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                  disabled={isWeekend(day)}
                >
                  <Plus className="h-3 w-3 mx-auto mb-1" />
                  Novo
                </button>

                {/* Lista de Agendamentos */}
                <div className="space-y-1">
                  {dayAppointments.map((appointment) => {
                    const ModalityIcon = getModalityIcon(appointment.modality);
                    
                    return (
                      <div
                        key={appointment.id}
                        onClick={() => onAppointmentClick(appointment)}
                        className={`p-2 rounded-md text-xs cursor-pointer transition-all duration-200 hover:shadow-sm ${getStatusColor(appointment.status)}`}
                      >
                        <div className="flex items-center space-x-1 mb-1">
                          <Clock className="h-3 w-3" />
                          <span className="font-medium">{appointment.time}</span>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="font-medium truncate">
                            {appointment.patient.name.split(' ')[0]}
                          </p>
                          
                          <div className="flex items-center space-x-1">
                            <ModalityIcon className="h-3 w-3" />
                            <span className="text-xs opacity-75">
                              {appointment.modality === 'online' ? 'Online' : 'Presencial'}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">
                              R$ {appointment.price}
                            </span>
                            <span className={`px-1 py-0.5 text-xs rounded ${
                              appointment.status === 'completed' ? 'bg-green-200 text-green-800' :
                              appointment.status === 'confirmed' ? 'bg-blue-200 text-blue-800' :
                              appointment.status === 'scheduled' ? 'bg-purple-200 text-purple-800' :
                              appointment.status === 'cancelled' ? 'bg-red-200 text-red-800' :
                              'bg-yellow-200 text-yellow-800'
                            }`}>
                              {appointment.status === 'completed' ? '✓' :
                               appointment.status === 'confirmed' ? '✓' :
                               appointment.status === 'scheduled' ? '○' :
                               appointment.status === 'cancelled' ? '✗' :
                               '●'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Indicador de mais agendamentos */}
                {dayAppointments.length > 3 && (
                  <div className="mt-2 text-center">
                    <span className="text-xs text-slate-500">
                      +{dayAppointments.length - 3} mais
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Resumo da Semana */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 mb-3">Resumo da Semana</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {appointments.filter(apt => {
                const aptDate = new Date(apt.date);
                return aptDate >= weekStart && aptDate <= weekDays[6] && apt.status === 'completed';
              }).length}
            </p>
            <p className="text-sm text-slate-600">Realizadas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {appointments.filter(apt => {
                const aptDate = new Date(apt.date);
                return aptDate >= weekStart && aptDate <= weekDays[6] && 
                       (apt.status === 'confirmed' || apt.status === 'scheduled');
              }).length}
            </p>
            <p className="text-sm text-slate-600">Agendadas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              R$ {appointments
                .filter(apt => {
                  const aptDate = new Date(apt.date);
                  return aptDate >= weekStart && aptDate <= weekDays[6];
                })
                .reduce((sum, apt) => sum + apt.price, 0)}
            </p>
            <p className="text-sm text-slate-600">Receita</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-600">
              {Math.round(appointments
                .filter(apt => {
                  const aptDate = new Date(apt.date);
                  return aptDate >= weekStart && aptDate <= weekDays[6];
                })
                .reduce((sum, apt) => sum + apt.duration, 0) / 60)}h
            </p>
            <p className="text-sm text-slate-600">Tempo Total</p>
          </div>
        </div>
      </div>
    </div>
  );
};
