import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, User, CheckCircle } from 'lucide-react';
import AvailabilityCalendar from './AvailabilityCalendar';
import TimeSlotGrid from './TimeSlotGrid';
import PatientDataForm from './PatientDataForm';
import BookingConfirmation from './BookingConfirmation';
import type { 
  AppointmentBookingForm, 
  TimeSlot, 
  BookingState, 
  AvailabilitySettings 
} from '../../types/booking';
import type { SessionModality } from '../../types';

interface AppointmentFormProps {
  psychologistId: number;
  onBookingComplete: (appointment: any) => void;
  onCancel: () => void;
  className?: string;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  psychologistId,
  onBookingComplete,
  onCancel,
  className = ''
}) => {
  const [bookingState, setBookingState] = useState<BookingState>({
    currentStep: 'calendar',
    formData: {},
    isLoading: false
  });

  // Configurações de disponibilidade (mock - seria buscado da API)
  const availabilitySettings: AvailabilitySettings = {
    workingHours: {
      monday: { start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
      tuesday: { start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
      wednesday: { start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
      thursday: { start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
      friday: { start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
      saturday: { start: '08:00', end: '12:00' },
      sunday: null
    },
    sessionDuration: 50,
    bufferTime: 10,
    advanceBookingDays: 30,
    cancellationHours: 24,
    allowOnlineBooking: true,
    allowInPersonBooking: true,
    blockedDates: [],
    blockedTimes: []
  };

  // Mock de agendamentos existentes
  const existingAppointments = [
    {
      id: 1,
      date: '2024-01-25',
      time: '14:00',
      duration: 50,
      modality: 'inPerson' as SessionModality
    },
    {
      id: 2,
      date: '2024-01-25',
      time: '16:00',
      duration: 50,
      modality: 'online' as SessionModality
    }
  ];

  const steps = [
    { key: 'calendar', title: 'Selecionar Data', icon: Calendar },
    { key: 'time', title: 'Escolher Horário', icon: Clock },
    { key: 'form', title: 'Dados do Paciente', icon: User },
    { key: 'confirmation', title: 'Confirmação', icon: CheckCircle }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === bookingState.currentStep);

  const handleDateSelect = (date: string) => {
    setBookingState(prev => ({
      ...prev,
      selectedDate: date,
      currentStep: 'time'
    }));
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setBookingState(prev => ({
      ...prev,
      selectedSlot: slot,
      currentStep: 'form',
      formData: {
        ...prev.formData,
        selectedSlot: {
          date: slot.date,
          time: slot.time,
          duration: slot.duration,
          modality: slot.modality,
          price: slot.price
        }
      }
    }));
  };

  const handleModalityChange = (slotId: string, modality: SessionModality) => {
    if (bookingState.selectedSlot?.id === slotId) {
      const updatedSlot = { ...bookingState.selectedSlot, modality };
      setBookingState(prev => ({
        ...prev,
        selectedSlot: updatedSlot,
        formData: {
          ...prev.formData,
          selectedSlot: {
            ...prev.formData.selectedSlot!,
            modality
          }
        }
      }));
    }
  };

  const handleFormDataChange = (data: Partial<AppointmentBookingForm>) => {
    setBookingState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...data }
    }));
  };

  const handleFormNext = () => {
    setBookingState(prev => ({
      ...prev,
      currentStep: 'confirmation'
    }));
  };

  const handleFormBack = () => {
    setBookingState(prev => ({
      ...prev,
      currentStep: 'time'
    }));
  };

  const handleConfirmationBack = () => {
    setBookingState(prev => ({
      ...prev,
      currentStep: 'form'
    }));
  };

  const handleConfirm = async () => {
    setBookingState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simular criação do agendamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const appointment = {
        id: Date.now(),
        patientId: Date.now(),
        psychologistId,
        date: bookingState.selectedSlot!.date,
        time: bookingState.selectedSlot!.time,
        duration: bookingState.selectedSlot!.duration,
        type: bookingState.formData.isFirstTime ? 'initial' : 'followUp',
        modality: bookingState.selectedSlot!.modality,
        status: 'scheduled',
        price: bookingState.selectedSlot!.price,
        notes: bookingState.formData.notes,
        paymentStatus: 'pending',
        patient: {
          name: bookingState.formData.patientName,
          email: bookingState.formData.patientEmail,
          phone: bookingState.formData.patientPhone
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      onBookingComplete(appointment);
    } catch (error) {
      setBookingState(prev => ({
        ...prev,
        error: 'Erro ao confirmar agendamento. Tente novamente.',
        isLoading: false
      }));
    }
  };

  const handleStepBack = () => {
    const prevStep = steps[currentStepIndex - 1];
    if (prevStep) {
      setBookingState(prev => ({
        ...prev,
        currentStep: prevStep.key as BookingState['currentStep']
      }));
    }
  };

  const renderCurrentStep = () => {
    switch (bookingState.currentStep) {
      case 'calendar':
        return (
          <AvailabilityCalendar
            onDateSelect={handleDateSelect}
            onSlotSelect={handleSlotSelect}
            selectedDate={bookingState.selectedDate}
            selectedSlot={bookingState.selectedSlot}
            availabilitySettings={availabilitySettings}
            existingAppointments={existingAppointments}
          />
        );

      case 'time':
        if (!bookingState.selectedDate) return null;
        
        // Gerar slots para a data selecionada
        const slots = generateSlotsForDate(bookingState.selectedDate);
        
        return (
          <TimeSlotGrid
            slots={slots}
            selectedSlot={bookingState.selectedSlot}
            onSlotSelect={handleSlotSelect}
            onModalityChange={handleModalityChange}
          />
        );

      case 'form':
        return (
          <PatientDataForm
            selectedSlot={bookingState.selectedSlot}
            formData={bookingState.formData}
            onFormDataChange={handleFormDataChange}
            onNext={handleFormNext}
            onBack={handleFormBack}
          />
        );

      case 'confirmation':
        return (
          <BookingConfirmation
            formData={bookingState.formData as AppointmentBookingForm}
            selectedSlot={bookingState.selectedSlot!}
            onBack={handleConfirmationBack}
            onConfirm={handleConfirm}
            onCancel={onCancel}
          />
        );

      default:
        return null;
    }
  };

  // Função para gerar slots (simplificada)
  const generateSlotsForDate = (date: string): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const dayOfWeek = new Date(date).getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek] as keyof typeof availabilitySettings.workingHours;
    
    const daySchedule = availabilitySettings.workingHours[dayName];
    if (!daySchedule) return slots;

    // Gerar slots de 30 em 30 minutos
    const startTime = daySchedule.start;
    const endTime = daySchedule.end;
    
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

    for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
      const time = minutesToTime(minutes);
      const slotId = `${date}-${time}`;
      
      const hasAppointment = existingAppointments.some(apt => 
        apt.date === date && apt.time === time
      );

      const now = new Date();
      const slotDateTime = new Date(`${date}T${time}`);
      const isPast = slotDateTime < now;

      slots.push({
        id: slotId,
        date,
        time,
        duration: availabilitySettings.sessionDuration,
        modality: 'inPerson',
        price: 120,
        isAvailable: !hasAppointment && !isPast,
        isBlocked: hasAppointment || isPast,
        reason: hasAppointment ? 'Agendado' : isPast ? 'Horário passado' : undefined
      });
    }

    return slots;
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Header com progresso */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Agendar Consulta</h1>
          <button
            onClick={onCancel}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Indicador de progresso */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            
            return (
              <div key={step.key} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                  ${isActive 
                    ? 'border-purple-500 bg-purple-500 text-white' 
                    : isCompleted 
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-slate-300 bg-white text-slate-400'
                  }
                `}>
                  <StepIcon className="h-5 w-5" />
                </div>
                
                <div className="ml-3 hidden sm:block">
                  <p className={`
                    text-sm font-medium
                    ${isActive ? 'text-purple-600' : isCompleted ? 'text-green-600' : 'text-slate-500'}
                  `}>
                    {step.title}
                  </p>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`
                    w-12 h-0.5 mx-4
                    ${isCompleted ? 'bg-green-500' : 'bg-slate-300'}
                  `} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Conteúdo do step atual */}
      <div className="min-h-[600px]">
        {renderCurrentStep()}
      </div>

      {/* Navegação inferior */}
      {bookingState.currentStep !== 'confirmation' && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
          <button
            onClick={currentStepIndex > 0 ? handleStepBack : onCancel}
            className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{currentStepIndex > 0 ? 'Voltar' : 'Cancelar'}</span>
          </button>

          <div className="text-sm text-slate-500">
            Passo {currentStepIndex + 1} de {steps.length}
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {bookingState.isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="text-slate-700">Processando...</span>
          </div>
        </div>
      )}

      {/* Error message */}
      {bookingState.error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{bookingState.error}</p>
          <button
            onClick={() => setBookingState(prev => ({ ...prev, error: undefined }))}
            className="mt-2 text-red-800 underline text-sm"
          >
            Tentar novamente
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentForm;
