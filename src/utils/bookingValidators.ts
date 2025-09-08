import type { AppointmentBookingForm, TimeSlot } from '../types/booking';
import type { SessionModality } from '../types';

// Validações de email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validações de telefone
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  return phoneRegex.test(phone);
};

// Formatar telefone automaticamente
export const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  let formatted = numbers;
  
  if (numbers.length >= 2) {
    formatted = `(${numbers.slice(0, 2)})`;
    if (numbers.length > 2) {
      formatted += ` ${numbers.slice(2, 7)}`;
      if (numbers.length > 7) {
        formatted += `-${numbers.slice(7, 11)}`;
      }
    }
  }
  
  return formatted;
};

// Validações de data de nascimento
export const validateBirthDate = (birthDate: string): { isValid: boolean; error?: string } => {
  if (!birthDate) {
    return { isValid: true }; // Data de nascimento é opcional
  }

  const date = new Date(birthDate);
  const today = new Date();
  
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Data inválida' };
  }
  
  if (date > today) {
    return { isValid: false, error: 'Data de nascimento não pode ser futura' };
  }
  
  const age = today.getFullYear() - date.getFullYear();
  if (age < 0 || age > 120) {
    return { isValid: false, error: 'Data de nascimento inválida' };
  }
  
  return { isValid: true };
};

// Validações de nome
export const validateName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'Nome é obrigatório' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Nome deve ter pelo menos 2 caracteres' };
  }
  
  if (name.trim().length > 100) {
    return { isValid: false, error: 'Nome deve ter no máximo 100 caracteres' };
  }
  
  // Verificar se contém apenas letras, espaços e acentos
  const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
  if (!nameRegex.test(name.trim())) {
    return { isValid: false, error: 'Nome deve conter apenas letras' };
  }
  
  return { isValid: true };
};

// Validações de observações
export const validateNotes = (notes: string): { isValid: boolean; error?: string } => {
  if (!notes) {
    return { isValid: true }; // Observações são opcionais
  }
  
  if (notes.length > 500) {
    return { isValid: false, error: 'Observações devem ter no máximo 500 caracteres' };
  }
  
  return { isValid: true };
};

// Validações de disponibilidade de horário
export const validateTimeSlot = (slot: TimeSlot): { isValid: boolean; error?: string } => {
  if (!slot.isAvailable) {
    return { isValid: false, error: 'Horário não disponível' };
  }
  
  if (slot.isBlocked) {
    return { isValid: false, error: slot.reason || 'Horário bloqueado' };
  }
  
  // Verificar se não é um horário passado
  const now = new Date();
  const slotDateTime = new Date(`${slot.date}T${slot.time}`);
  
  if (slotDateTime < now) {
    return { isValid: false, error: 'Não é possível agendar para horários passados' };
  }
  
  return { isValid: true };
};

// Validações de modalidade
export const validateModality = (modality: SessionModality): { isValid: boolean; error?: string } => {
  if (!modality) {
    return { isValid: false, error: 'Modalidade é obrigatória' };
  }
  
  if (!['inPerson', 'online'].includes(modality)) {
    return { isValid: false, error: 'Modalidade inválida' };
  }
  
  return { isValid: true };
};

// Validações de termos
export const validateTerms = (termsAccepted: boolean): { isValid: boolean; error?: string } => {
  if (!termsAccepted) {
    return { isValid: false, error: 'Você deve aceitar os termos de agendamento' };
  }
  
  return { isValid: true };
};

// Validação completa do formulário
export const validateBookingForm = (formData: Partial<AppointmentBookingForm>): {
  isValid: boolean;
  errors: Record<string, string>;
} => {
  const errors: Record<string, string> = {};

  // Validar nome
  const nameValidation = validateName(formData.patientName || '');
  if (!nameValidation.isValid) {
    errors.patientName = nameValidation.error!;
  }

  // Validar email
  if (!formData.patientEmail || !formData.patientEmail.trim()) {
    errors.patientEmail = 'Email é obrigatório';
  } else if (!validateEmail(formData.patientEmail)) {
    errors.patientEmail = 'Email inválido';
  }

  // Validar telefone
  if (!formData.patientPhone || !formData.patientPhone.trim()) {
    errors.patientPhone = 'Telefone é obrigatório';
  } else if (!validatePhone(formData.patientPhone)) {
    errors.patientPhone = 'Telefone deve estar no formato (11) 99999-9999';
  }

  // Validar data de nascimento
  if (formData.birthDate) {
    const birthDateValidation = validateBirthDate(formData.birthDate);
    if (!birthDateValidation.isValid) {
      errors.birthDate = birthDateValidation.error!;
    }
  }

  // Validar observações
  if (formData.notes) {
    const notesValidation = validateNotes(formData.notes);
    if (!notesValidation.isValid) {
      errors.notes = notesValidation.error!;
    }
  }

  // Validar slot selecionado
  if (formData.selectedSlot) {
    const slotValidation = validateTimeSlot({
      id: `${formData.selectedSlot.date}-${formData.selectedSlot.time}`,
      date: formData.selectedSlot.date,
      time: formData.selectedSlot.time,
      duration: formData.selectedSlot.duration,
      modality: formData.selectedSlot.modality,
      price: formData.selectedSlot.price,
      isAvailable: true,
      isBlocked: false
    });
    
    if (!slotValidation.isValid) {
      errors.selectedSlot = slotValidation.error!;
    }

    // Validar modalidade
    const modalityValidation = validateModality(formData.selectedSlot.modality);
    if (!modalityValidation.isValid) {
      errors.modality = modalityValidation.error!;
    }
  } else {
    errors.selectedSlot = 'Horário é obrigatório';
  }

  // Validar termos
  const termsValidation = validateTerms(formData.termsAccepted || false);
  if (!termsValidation.isValid) {
    errors.termsAccepted = termsValidation.error!;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validações de disponibilidade em tempo real
export const checkSlotAvailability = async (
  date: string,
  time: string,
  psychologistId: number
): Promise<{ isAvailable: boolean; reason?: string }> => {
  try {
    // Simular chamada para API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock: verificar se o horário está disponível
    const now = new Date();
    const slotDateTime = new Date(`${date}T${time}`);
    
    if (slotDateTime < now) {
      return { isAvailable: false, reason: 'Horário passado' };
    }
    
    // Simular alguns horários ocupados
    const blockedSlots = [
      { date: '2024-01-25', time: '14:00' },
      { date: '2024-01-25', time: '16:00' }
    ];
    
    const isBlocked = blockedSlots.some(slot => slot.date === date && slot.time === time);
    
    if (isBlocked) {
      return { isAvailable: false, reason: 'Horário já agendado' };
    }
    
    return { isAvailable: true };
  } catch (error) {
    return { isAvailable: false, reason: 'Erro ao verificar disponibilidade' };
  }
};

// Validações de conflitos de horário
export const checkTimeConflicts = (
  newSlot: TimeSlot,
  existingAppointments: any[]
): { hasConflict: boolean; conflictingAppointment?: any } => {
  const newStart = new Date(`${newSlot.date}T${newSlot.time}`);
  const newEnd = new Date(newStart.getTime() + newSlot.duration * 60000);
  
  for (const appointment of existingAppointments) {
    if (appointment.date === newSlot.date) {
      const existingStart = new Date(`${appointment.date}T${appointment.time}`);
      const existingEnd = new Date(existingStart.getTime() + appointment.duration * 60000);
      
      // Verificar sobreposição
      if (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      ) {
        return {
          hasConflict: true,
          conflictingAppointment: appointment
        };
      }
    }
  }
  
  return { hasConflict: false };
};

// Validações de limites de reagendamento
export const validateReschedulingLimits = (
  appointmentDate: string,
  cancellationHours: number = 24
): { canReschedule: boolean; reason?: string } => {
  const now = new Date();
  const appointmentDateTime = new Date(appointmentDate);
  const hoursUntilAppointment = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (hoursUntilAppointment < cancellationHours) {
    return {
      canReschedule: false,
      reason: `Reagendamento deve ser feito com pelo menos ${cancellationHours} horas de antecedência`
    };
  }
  
  return { canReschedule: true };
};

// Utilitários para formatação
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDuration = (duration: number): string => {
  if (duration === 60) return '1 hora';
  if (duration === 30) return '30 minutos';
  if (duration === 45) return '45 minutos';
  return `${duration} minutos`;
};
