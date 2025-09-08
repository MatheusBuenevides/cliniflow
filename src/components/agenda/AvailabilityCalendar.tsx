import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Video } from 'lucide-react';
import type { CalendarDay, TimeSlot } from '../../types/booking';
import type { SessionModality } from '../../types';

interface AvailabilityCalendarProps {
  onDateSelect: (date: string) => void;
  onSlotSelect: (slot: TimeSlot) => void;
  selectedDate?: string;
  selectedSlot?: TimeSlot;
  availabilitySettings: {
    workingHours: any;
    sessionDuration: number;
    advanceBookingDays: number;
    blockedDates: string[];
  };
  existingAppointments?: any[];
  className?: string;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  onDateSelect,
  onSlotSelect,
  selectedDate,
  selectedSlot,
  availabilitySettings,
  existingAppointments = [],
  className = ''
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

  // Gerar slots disponíveis para uma data específica
  const generateSlotsForDate = (date: string): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const dayOfWeek = new Date(date).getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek] as keyof typeof availabilitySettings.workingHours;
    
    const daySchedule = availabilitySettings.workingHours[dayName];
    if (!daySchedule) return slots;

    const startTime = daySchedule.start;
    const endTime = daySchedule.end;
    const lunchStart = daySchedule.lunchStart;
    const lunchEnd = daySchedule.lunchEnd;

    // Converter horários para minutos
    const timeToMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const minutesToTime = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const lunchStartMinutes = lunchStart ? timeToMinutes(lunchStart) : null;
    const lunchEndMinutes = lunchEnd ? timeToMinutes(lunchEnd) : null;

    // Gerar slots de 30 em 30 minutos
    for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
      // Pular horário de almoço
      if (lunchStartMinutes && lunchEndMinutes && 
          minutes >= lunchStartMinutes && minutes < lunchEndMinutes) {
        continue;
      }

      const time = minutesToTime(minutes);
      const slotId = `${date}-${time}`;
      
      // Verificar se já existe agendamento neste horário
      const hasAppointment = existingAppointments.some(apt => 
        apt.date === date && apt.time === time
      );

      // Verificar se é um horário passado
      const now = new Date();
      const slotDateTime = new Date(`${date}T${time}`);
      const isPast = slotDateTime < now;

      slots.push({
        id: slotId,
        date,
        time,
        duration: availabilitySettings.sessionDuration,
        modality: 'inPerson', // Será alterado pelo usuário
        price: 120, // Preço padrão
        isAvailable: !hasAppointment && !isPast,
        isBlocked: hasAppointment || isPast,
        reason: hasAppointment ? 'Agendado' : isPast ? 'Horário passado' : undefined
      });
    }

    return slots;
  };

  // Gerar calendário do mês
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + availabilitySettings.advanceBookingDays);
    const maxDateString = maxDate.toISOString().split('T')[0];

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = dateString === today;
      const isPast = dateString < today;
      const isFuture = dateString > maxDateString;
      const isBlocked = availabilitySettings.blockedDates.includes(dateString);
      
      const slots = isCurrentMonth && !isPast && !isFuture && !isBlocked 
        ? generateSlotsForDate(dateString) 
        : [];

      days.push({
        date: dateString,
        isCurrentMonth,
        isToday,
        isPast: isPast || isFuture || isBlocked,
        hasAvailableSlots: slots.some(slot => slot.isAvailable),
        slots
      });
    }

    return days;
  }, [currentDate, availabilitySettings, existingAppointments]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (day: CalendarDay) => {
    if (!day.isPast && day.hasAvailableSlots) {
      onDateSelect(day.date);
      setAvailableSlots(day.slots);
    }
  };

  const handleSlotClick = (slot: TimeSlot) => {
    if (slot.isAvailable) {
      onSlotSelect(slot);
    }
  };

  const getModalityIcon = (modality: SessionModality) => {
    return modality === 'online' ? (
      <Video className="h-4 w-4" />
    ) : (
      <MapPin className="h-4 w-4" />
    );
  };


  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 ${className}`}>
      {/* Header do Calendário */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <Calendar className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-slate-800">Selecione uma data</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </button>
          <h3 className="text-lg font-medium text-slate-700 w-40 text-center">
            {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
          </h3>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Grid do Calendário */}
      <div className="p-6">
        {/* Dias da semana */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-slate-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Dias do mês */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            const isSelected = selectedDate === day.date;
            const dayNumber = new Date(day.date).getDate();
            
            return (
              <div
                key={index}
                className={`
                  relative p-2 h-20 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${!day.isCurrentMonth ? 'opacity-30' : ''}
                  ${day.isPast ? 'bg-slate-50 border-slate-200 cursor-not-allowed' : ''}
                  ${day.isToday && !day.isPast ? 'border-purple-300 bg-purple-50' : ''}
                  ${isSelected ? 'border-purple-500 bg-purple-100' : ''}
                  ${!day.isPast && day.hasAvailableSlots && !isSelected ? 'hover:border-purple-300 hover:bg-purple-50' : ''}
                `}
                onClick={() => handleDateClick(day)}
              >
                <div className={`
                  text-sm font-medium
                  ${day.isToday ? 'text-purple-600' : ''}
                  ${isSelected ? 'text-purple-700' : ''}
                  ${day.isPast ? 'text-slate-400' : 'text-slate-700'}
                `}>
                  {dayNumber}
                </div>
                
                {/* Indicador de disponibilidade */}
                {day.hasAvailableSlots && !day.isPast && (
                  <div className="absolute bottom-1 right-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Slots disponíveis para a data selecionada */}
      {selectedDate && availableSlots.length > 0 && (
        <div className="border-t border-slate-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5 text-slate-600" />
            <h3 className="text-lg font-medium text-slate-800">
              Horários disponíveis para {new Date(selectedDate).toLocaleDateString('pt-BR')}
            </h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {availableSlots.map(slot => {
              const isSelected = selectedSlot?.id === slot.id;
              
              return (
                <button
                  key={slot.id}
                  onClick={() => handleSlotClick(slot)}
                  disabled={!slot.isAvailable}
                  className={`
                    p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200
                    ${slot.isAvailable 
                      ? isSelected
                        ? 'border-purple-500 bg-purple-100 text-purple-700'
                        : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50 text-slate-700'
                      : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                    }
                  `}
                >
                  <div className="flex items-center justify-center space-x-1">
                    {getModalityIcon(slot.modality)}
                    <span>{slot.time}</span>
                  </div>
                  {slot.isBlocked && slot.reason && (
                    <div className="text-xs text-slate-500 mt-1">{slot.reason}</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mensagem quando não há slots disponíveis */}
      {selectedDate && availableSlots.length === 0 && (
        <div className="border-t border-slate-200 p-6 text-center">
          <div className="text-slate-500">
            <Clock className="h-8 w-8 mx-auto mb-2 text-slate-400" />
            <p>Não há horários disponíveis para esta data.</p>
            <p className="text-sm">Tente selecionar outra data.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
