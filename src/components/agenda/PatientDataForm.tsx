import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import FormInput from '../ui/FormInput';
import type { AppointmentBookingForm, TimeSlot } from '../../types/booking';

interface PatientDataFormProps {
  selectedSlot?: TimeSlot;
  formData: Partial<AppointmentBookingForm>;
  onFormDataChange: (data: Partial<AppointmentBookingForm>) => void;
  onNext: () => void;
  onBack: () => void;
  className?: string;
}

interface FormErrors {
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  birthDate?: string;
  termsAccepted?: string;
}

const PatientDataForm: React.FC<PatientDataFormProps> = ({
  selectedSlot,
  formData,
  onFormDataChange,
  onNext,
  onBack,
  className = ''
}) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validações
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Nome obrigatório
    if (!formData.patientName?.trim()) {
      newErrors.patientName = 'Nome é obrigatório';
    } else if (formData.patientName.trim().length < 2) {
      newErrors.patientName = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Email obrigatório e válido
    if (!formData.patientEmail?.trim()) {
      newErrors.patientEmail = 'Email é obrigatório';
    } else if (!validateEmail(formData.patientEmail)) {
      newErrors.patientEmail = 'Email inválido';
    }

    // Telefone obrigatório e válido
    if (!formData.patientPhone?.trim()) {
      newErrors.patientPhone = 'Telefone é obrigatório';
    } else if (!validatePhone(formData.patientPhone)) {
      newErrors.patientPhone = 'Telefone deve estar no formato (11) 99999-9999';
    }

    // Data de nascimento (opcional, mas se preenchida deve ser válida)
    if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (birthDate > today) {
        newErrors.birthDate = 'Data de nascimento não pode ser futura';
      } else if (age < 0 || age > 120) {
        newErrors.birthDate = 'Data de nascimento inválida';
      }
    }

    // Termos obrigatórios
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'Você deve aceitar os termos de agendamento';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof AppointmentBookingForm, value: any) => {
    onFormDataChange({ ...formData, [field]: value });
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePhoneChange = (value: string) => {
    // Formatar telefone automaticamente
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
    
    handleInputChange('patientPhone', formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simular delay de validação
      await new Promise(resolve => setTimeout(resolve, 500));
      onNext();
    } catch (error) {
      console.error('Erro ao validar formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const getModalityLabel = (modality: string) => {
    return modality === 'online' ? 'Online' : 'Presencial';
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-slate-600" />
          <h3 className="text-lg font-medium text-slate-800">Dados do Paciente</h3>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Preencha os dados para finalizar o agendamento
        </p>
      </div>

      {/* Resumo do agendamento */}
      {selectedSlot && (
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <h4 className="font-medium text-slate-800 mb-3">Resumo do agendamento</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-slate-500" />
                <span className="text-slate-600">
                  {new Date(selectedSlot.date).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-slate-600">
                  Horário: {formatTime(selectedSlot.time)}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-slate-600">
                  Modalidade: {getModalityLabel(selectedSlot.modality)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-800">
                {formatPrice(selectedSlot.price)}
              </div>
              <div className="text-sm text-slate-500">
                Duração: {selectedSlot.duration} minutos
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {/* Nome completo */}
          <FormInput
            label="Nome completo"
            type="text"
            value={formData.patientName || ''}
            onChange={(e) => handleInputChange('patientName', e.target.value)}
            error={errors.patientName}
            leftIcon={<User className="h-4 w-4" />}
            placeholder="Digite seu nome completo"
            required
          />

          {/* Email */}
          <FormInput
            label="Email"
            type="email"
            value={formData.patientEmail || ''}
            onChange={(e) => handleInputChange('patientEmail', e.target.value)}
            error={errors.patientEmail}
            leftIcon={<Mail className="h-4 w-4" />}
            placeholder="seu@email.com"
            required
          />

          {/* Telefone */}
          <FormInput
            label="Telefone"
            type="tel"
            value={formData.patientPhone || ''}
            onChange={(e) => handlePhoneChange(e.target.value)}
            error={errors.patientPhone}
            leftIcon={<Phone className="h-4 w-4" />}
            placeholder="(11) 99999-9999"
            maxLength={15}
            required
          />

          {/* Data de nascimento */}
          <FormInput
            label="Data de nascimento (opcional)"
            type="date"
            value={formData.birthDate || ''}
            onChange={(e) => handleInputChange('birthDate', e.target.value)}
            error={errors.birthDate}
            leftIcon={<Calendar className="h-4 w-4" />}
            helperText="Ajuda na personalização do atendimento"
          />

          {/* Primeira consulta */}
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFirstTime || false}
                onChange={(e) => handleInputChange('isFirstTime', e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-slate-700">
                Esta é minha primeira consulta
              </span>
            </label>
            <p className="text-xs text-slate-500 ml-7">
              Marque esta opção se for sua primeira consulta com este psicólogo
            </p>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Observações (opcional)
            </label>
            <div className="relative">
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Alguma informação adicional que gostaria de compartilhar?"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                rows={3}
                maxLength={500}
              />
              <div className="absolute bottom-2 right-2 text-xs text-slate-400">
                {(formData.notes || '').length}/500
              </div>
            </div>
          </div>

          {/* Termos de agendamento */}
          <div className="space-y-3">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.termsAccepted || false}
                onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5"
                required
              />
              <div className="text-sm">
                <span className="font-medium text-slate-700">
                  Aceito os termos de agendamento
                </span>
                {errors.termsAccepted && (
                  <p className="text-red-600 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.termsAccepted}
                  </p>
                )}
                <p className="text-slate-500 mt-1">
                  Li e aceito os{' '}
                  <a href="#" className="text-purple-600 hover:text-purple-700 underline">
                    termos de agendamento
                  </a>{' '}
                  e a{' '}
                  <a href="#" className="text-purple-600 hover:text-purple-700 underline">
                    política de privacidade
                  </a>
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Botões */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-8">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
          >
            Voltar
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Validando...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Continuar</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientDataForm;
