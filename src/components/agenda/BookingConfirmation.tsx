import React, { useState } from 'react';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  User, 
  Mail, 
  Phone, 
  FileText,
  CreditCard,
  ArrowLeft,
  Download,
  Share2
} from 'lucide-react';
import type { AppointmentBookingForm, TimeSlot } from '../../types/booking';

interface BookingConfirmationProps {
  formData: AppointmentBookingForm;
  selectedSlot: TimeSlot;
  onBack: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  formData,
  selectedSlot,
  onBack,
  onConfirm,
  onCancel,
  className = ''
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

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

  const getModalityIcon = (modality: string) => {
    return modality === 'online' ? (
      <Video className="h-5 w-5" />
    ) : (
      <MapPin className="h-5 w-5" />
    );
  };

  const getModalityLabel = (modality: string) => {
    return modality === 'online' ? 'Online' : 'Presencial';
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    
    try {
      // Simular processo de confirmação
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsConfirmed(true);
      onConfirm();
    } catch (error) {
      console.error('Erro ao confirmar agendamento:', error);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleDownloadConfirmation = () => {
    // Simular download do comprovante
    const confirmationData = {
      date: new Date(selectedSlot.date).toLocaleDateString('pt-BR'),
      time: formatTime(selectedSlot.time),
      modality: getModalityLabel(selectedSlot.modality),
      patient: formData.patientName,
      email: formData.patientEmail,
      phone: formData.patientPhone,
      price: formatPrice(selectedSlot.price)
    };

    const blob = new Blob([JSON.stringify(confirmationData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agendamento-${selectedSlot.date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareConfirmation = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Confirmação de Agendamento',
        text: `Agendamento confirmado para ${new Date(selectedSlot.date).toLocaleDateString('pt-BR')} às ${formatTime(selectedSlot.time)}`,
        url: window.location.href
      });
    } else {
      // Fallback para copiar para clipboard
      navigator.clipboard.writeText(
        `Agendamento confirmado para ${new Date(selectedSlot.date).toLocaleDateString('pt-BR')} às ${formatTime(selectedSlot.time)}`
      );
    }
  };

  if (isConfirmed) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 ${className}`}>
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Agendamento Confirmado!
          </h2>
          
          <p className="text-slate-600 mb-6">
            Seu agendamento foi realizado com sucesso. Você receberá um email de confirmação em breve.
          </p>

          <div className="bg-slate-50 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-slate-800 mb-4">Detalhes do agendamento:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                <span className="text-slate-600">
                  {new Date(selectedSlot.date).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-slate-500" />
                <span className="text-slate-600">
                  {formatTime(selectedSlot.time)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {getModalityIcon(selectedSlot.modality)}
                <span className="text-slate-600">
                  {getModalityLabel(selectedSlot.modality)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-slate-500" />
                <span className="text-slate-600">
                  {formData.patientName}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleDownloadConfirmation}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Baixar comprovante</span>
            </button>
            
            <button
              onClick={handleShareConfirmation}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>Compartilhar</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-slate-600" />
          <h3 className="text-lg font-medium text-slate-800">Confirmação do Agendamento</h3>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Revise os dados antes de confirmar o agendamento
        </p>
      </div>

      <div className="p-6">
        {/* Resumo do agendamento */}
        <div className="bg-slate-50 rounded-lg p-6 mb-6">
          <h4 className="font-semibold text-slate-800 mb-4 flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Detalhes da consulta</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Data</p>
                  <p className="text-slate-600">
                    {new Date(selectedSlot.date).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Horário</p>
                  <p className="text-slate-600">{formatTime(selectedSlot.time)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {getModalityIcon(selectedSlot.modality)}
                <div>
                  <p className="text-sm font-medium text-slate-700">Modalidade</p>
                  <p className="text-slate-600">{getModalityLabel(selectedSlot.modality)}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-700">Duração</p>
                <p className="text-slate-600">{selectedSlot.duration} minutos</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-slate-700">Valor</p>
                <p className="text-2xl font-bold text-slate-800">
                  {formatPrice(selectedSlot.price)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dados do paciente */}
        <div className="bg-slate-50 rounded-lg p-6 mb-6">
          <h4 className="font-semibold text-slate-800 mb-4 flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Dados do paciente</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Nome</p>
                  <p className="text-slate-600">{formData.patientName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Email</p>
                  <p className="text-slate-600">{formData.patientEmail}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Telefone</p>
                  <p className="text-slate-600">{formData.patientPhone}</p>
                </div>
              </div>
              
              {formData.birthDate && (
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Data de nascimento</p>
                    <p className="text-slate-600">
                      {new Date(formData.birthDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {formData.isFirstTime && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">
                ✓ Primeira consulta
              </p>
            </div>
          )}

          {formData.notes && (
            <div className="mt-4">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-4 w-4 text-slate-500" />
                <p className="text-sm font-medium text-slate-700">Observações</p>
              </div>
              <p className="text-slate-600 text-sm bg-white p-3 rounded border">
                {formData.notes}
              </p>
            </div>
          )}
        </div>

        {/* Informações de pagamento */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <CreditCard className="h-5 w-5 text-amber-600" />
            <h4 className="font-medium text-amber-800">Informações de pagamento</h4>
          </div>
          <p className="text-sm text-amber-700">
            Após a confirmação do agendamento, você receberá um link de pagamento por email. 
            O pagamento pode ser realizado até 24 horas antes da consulta.
          </p>
        </div>

        {/* Botões */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center space-x-2 px-6 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </button>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
            >
              Cancelar
            </button>
            
            <button
              onClick={handleConfirm}
              disabled={isConfirming}
              className="px-8 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isConfirming ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Confirmando...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Confirmar Agendamento</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
