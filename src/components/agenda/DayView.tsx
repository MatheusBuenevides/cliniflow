import React from 'react';
import { Clock, MapPin, Video, User, Plus } from 'lucide-react';
import type { Appointment, AvailableSlot } from '../../types';

interface DayViewProps {
  appointments: Appointment[];
  currentDate: Date;
  selectedDate: Date;
  onAppointmentClick: (appointment: Appointment) => void;
  onSlotClick: (date: string, time: string) => void;
  availableSlots?: AvailableSlot[];
  blockedSlots?: string[];
}

export const DayView: React.FC<DayViewProps> = ({
  appointments,
  currentDate,
  selectedDate,
  onAppointmentClick,
  onSlotClick,
  availableSlots = [],
  blockedSlots = []
}) => {
  const dateString = currentDate.toISOString().split('T')[0];
  const dayAppointments = appointments.filter(apt => apt.date === dateString);
  
  // Ordenar agendamentos por horário
  dayAppointments.sort((a, b) => a.time.localeCompare(b.time));

  // Gerar slots de tempo para o dia (8h às 18h)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const slotId = `${dateString}-${time}`;
        const isBlocked = blockedSlots.includes(slotId);
        const isAvailable = availableSlots.some(slot => slot.date === dateString && slot.time === time);
        const hasAppointment = dayAppointments.some(apt => apt.time === time);
        
        slots.push({
          time,
          isBlocked,
          isAvailable,
          hasAppointment,
          appointment: dayAppointments.find(apt => apt.time === time)
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

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

  const formatTime = (time: string) => {
    return time;
  };

  return (
    <div className="space-y-4">
      {/* Header do Dia */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">
            {currentDate.toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </h3>
          <p className="text-slate-600">
            {dayAppointments.length} agendamento{dayAppointments.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <button
          onClick={() => onSlotClick(dateString, '09:00')}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Agendamento</span>
        </button>
      </div>

      {/* Timeline do Dia */}
      <div className="bg-slate-50 rounded-lg p-4">
        <div className="space-y-2">
          {timeSlots.map((slot) => {
            const ModalityIcon = slot.appointment ? getModalityIcon(slot.appointment.modality) : Clock;
            
            return (
              <div
                key={slot.time}
                className={`flex items-center p-3 rounded-lg border transition-all duration-200 ${
                  slot.hasAppointment
                    ? `${getStatusColor(slot.appointment!.status)} cursor-pointer hover:shadow-md`
                    : slot.isAvailable
                    ? 'bg-white border-slate-200 hover:border-purple-300 hover:bg-purple-50 cursor-pointer'
                    : slot.isBlocked
                    ? 'bg-slate-100 border-slate-200 text-slate-400'
                    : 'bg-slate-50 border-slate-100 text-slate-400'
                }`}
                onClick={() => {
                  if (slot.hasAppointment) {
                    onAppointmentClick(slot.appointment!);
                  } else if (slot.isAvailable) {
                    onSlotClick(dateString, slot.time);
                  }
                }}
              >
                {/* Horário */}
                <div className="flex items-center space-x-3 min-w-[80px]">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span className="font-medium text-slate-700">
                    {formatTime(slot.time)}
                  </span>
                </div>

                {/* Conteúdo do Slot */}
                <div className="flex-1 ml-4">
                  {slot.hasAppointment ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <ModalityIcon className="h-4 w-4" />
                        <div>
                          <p className="font-medium">
                            {slot.appointment!.patient.name}
                          </p>
                          <p className="text-sm opacity-75">
                            {slot.appointment!.type === 'initial' ? 'Primeira consulta' : 'Retorno'} • 
                            {slot.appointment!.duration}min • 
                            R$ {slot.appointment!.price}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          slot.appointment!.status === 'completed' ? 'bg-green-200 text-green-800' :
                          slot.appointment!.status === 'confirmed' ? 'bg-blue-200 text-blue-800' :
                          slot.appointment!.status === 'scheduled' ? 'bg-purple-200 text-purple-800' :
                          slot.appointment!.status === 'cancelled' ? 'bg-red-200 text-red-800' :
                          'bg-yellow-200 text-yellow-800'
                        }`}>
                          {slot.appointment!.status === 'completed' ? 'Realizada' :
                           slot.appointment!.status === 'confirmed' ? 'Confirmada' :
                           slot.appointment!.status === 'scheduled' ? 'Agendada' :
                           slot.appointment!.status === 'cancelled' ? 'Cancelada' :
                           'Em andamento'}
                        </span>
                        
                        {slot.appointment!.modality === 'online' && (
                          <Video className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ) : slot.isAvailable ? (
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Plus className="h-4 w-4" />
                      <span>Horário disponível</span>
                    </div>
                  ) : slot.isBlocked ? (
                    <div className="flex items-center space-x-2 text-slate-400">
                      <Clock className="h-4 w-4" />
                      <span>Horário bloqueado</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-slate-400">
                      <Clock className="h-4 w-4" />
                      <span>Fora do horário de funcionamento</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resumo do Dia */}
      {dayAppointments.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <h4 className="font-medium text-slate-800 mb-3">Resumo do Dia</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {dayAppointments.filter(a => a.status === 'completed').length}
              </p>
              <p className="text-sm text-slate-600">Realizadas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {dayAppointments.filter(a => a.status === 'confirmed' || a.status === 'scheduled').length}
              </p>
              <p className="text-sm text-slate-600">Agendadas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                R$ {dayAppointments.reduce((sum, apt) => sum + apt.price, 0)}
              </p>
              <p className="text-sm text-slate-600">Receita</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-600">
                {Math.round(dayAppointments.reduce((sum, apt) => sum + apt.duration, 0) / 60)}h
              </p>
              <p className="text-sm text-slate-600">Tempo Total</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
