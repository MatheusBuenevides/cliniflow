import React from 'react';
import { Clock, MapPin, Video, Plus } from 'lucide-react';
import type { Appointment, AvailableSlot } from '../../types';

interface MonthViewProps {
  appointments: Appointment[];
  currentDate: Date;
  selectedDate: Date;
  onAppointmentClick: (appointment: Appointment) => void;
  onSlotClick: (date: string, time: string) => void;
  availableSlots?: AvailableSlot[];
  blockedSlots?: string[];
}

export const MonthView: React.FC<MonthViewProps> = ({
  appointments,
  currentDate,
  selectedDate,
  onAppointmentClick,
  onSlotClick,
  availableSlots = [],
  blockedSlots = []
}) => {
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();

  // Gerar dias do mês
  const daysInMonth = [];
  for (let i = 1; i <= endOfMonth.getDate(); i++) {
    daysInMonth.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  const getDayAppointments = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return appointments
      .filter(apt => apt.date === dateString)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'confirmed': return 'bg-blue-500';
      case 'scheduled': return 'bg-purple-500';
      case 'cancelled': return 'bg-red-500';
      case 'inProgress': return 'bg-yellow-500';
      default: return 'bg-slate-500';
    }
  };

  const getModalityIcon = (modality: string) => {
    return modality === 'online' ? Video : MapPin;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const isWeekend = (date: Date) => {
    return date.getDay() === 0 || date.getDay() === 6;
  };

  const getAppointmentDensity = (appointments: Appointment[]) => {
    if (appointments.length === 0) return 'opacity-0';
    if (appointments.length <= 2) return 'opacity-30';
    if (appointments.length <= 4) return 'opacity-60';
    return 'opacity-100';
  };

  return (
    <div className="space-y-4">
      {/* Header do Mês */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">
            {currentDate.toLocaleDateString('pt-BR', {
              year: 'numeric',
              month: 'long'
            })}
          </h3>
          <p className="text-slate-600">
            {appointments.filter(apt => {
              const aptDate = new Date(apt.date);
              return aptDate >= startOfMonth && aptDate <= endOfMonth;
            }).length} agendamentos no mês
          </p>
        </div>
      </div>

      {/* Calendário Mensal */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {/* Cabeçalho dos Dias da Semana */}
        <div className="grid grid-cols-7 border-b border-slate-200">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
            <div
              key={day}
              className={`p-3 text-center font-medium text-sm ${
                index === 0 || index === 6 ? 'text-slate-500' : 'text-slate-700'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid do Calendário */}
        <div className="grid grid-cols-7">
          {/* Dias vazios do início do mês */}
          {Array(startDay).fill(null).map((_, i) => (
            <div key={`empty-${i}`} className="h-32 border-r border-b border-slate-200 bg-slate-50"></div>
          ))}

          {/* Dias do mês */}
          {daysInMonth.map((day) => {
            const dayAppointments = getDayAppointments(day);
            const dateString = day.toISOString().split('T')[0];
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            
            return (
              <div
                key={day.toString()}
                className={`h-32 border-r border-b border-slate-200 p-2 flex flex-col ${
                  isToday(day) ? 'bg-purple-50 border-purple-300' :
                  isSelected(day) ? 'bg-blue-50 border-blue-300' :
                  isWeekend(day) ? 'bg-slate-50' : 'bg-white'
                } ${!isCurrentMonth ? 'opacity-50' : ''}`}
              >
                {/* Número do dia */}
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${
                    isToday(day) ? 'text-purple-600' :
                    isSelected(day) ? 'text-blue-600' :
                    isWeekend(day) ? 'text-slate-500' : 'text-slate-700'
                  }`}>
                    {day.getDate()}
                  </span>
                  
                  {/* Indicador de densidade */}
                  {dayAppointments.length > 0 && (
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(dayAppointments[0].status)} ${getAppointmentDensity(dayAppointments)}`}></div>
                  )}
                </div>

                {/* Lista de agendamentos */}
                <div className="flex-1 space-y-1 overflow-hidden">
                  {dayAppointments.slice(0, 3).map((appointment) => {
                    const ModalityIcon = getModalityIcon(appointment.modality);
                    
                    return (
                      <div
                        key={appointment.id}
                        onClick={() => onAppointmentClick(appointment)}
                        className={`p-1 rounded text-xs cursor-pointer transition-all duration-200 hover:shadow-sm ${
                          appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          appointment.status === 'scheduled' ? 'bg-purple-100 text-purple-800' :
                          appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        <div className="flex items-center space-x-1">
                          <Clock className="h-2 w-2" />
                          <span className="font-medium">{appointment.time}</span>
                        </div>
                        <div className="flex items-center space-x-1 mt-0.5">
                          <ModalityIcon className="h-2 w-2" />
                          <span className="truncate">
                            {appointment.patient.name.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Indicador de mais agendamentos */}
                  {dayAppointments.length > 3 && (
                    <div className="text-xs text-slate-500 text-center">
                      +{dayAppointments.length - 3} mais
                    </div>
                  )}
                </div>

                {/* Botão para adicionar agendamento */}
                {isCurrentMonth && !isWeekend(day) && (
                  <button
                    onClick={() => onSlotClick(dateString, '09:00')}
                    className="mt-1 p-1 rounded text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors opacity-0 hover:opacity-100"
                  >
                    <Plus className="h-3 w-3 mx-auto" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Resumo do Mês */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 mb-3">Resumo do Mês</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {appointments.filter(apt => {
                const aptDate = new Date(apt.date);
                return aptDate >= startOfMonth && aptDate <= endOfMonth && apt.status === 'completed';
              }).length}
            </p>
            <p className="text-sm text-slate-600">Realizadas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {appointments.filter(apt => {
                const aptDate = new Date(apt.date);
                return aptDate >= startOfMonth && aptDate <= endOfMonth && 
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
                  return aptDate >= startOfMonth && aptDate <= endOfMonth;
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
                  return aptDate >= startOfMonth && aptDate <= endOfMonth;
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
