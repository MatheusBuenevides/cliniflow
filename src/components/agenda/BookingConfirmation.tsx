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
  Share2,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import type { AppointmentBookingForm, TimeSlot } from '../../types/booking';
import type { BookingConfirmation as BookingConfirmationType, PaymentLink, PaymentStatus } from '../../types';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { PIXQRCode } from './PIXQRCode';
import { BookingInstructions } from './BookingInstructions';

interface BookingConfirmationProps {
  formData: AppointmentBookingForm;
  selectedSlot: TimeSlot;
  onBack: () => void;
  onConfirm: (confirmation: BookingConfirmationType) => void;
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
  const [confirmation, setConfirmation] = useState<BookingConfirmationType | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('pix');
  const [paymentLink, setPaymentLink] = useState<PaymentLink | null>(null);
  const [currentStep, setCurrentStep] = useState<'confirmation' | 'payment' | 'instructions'>('confirmation');

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

  const generateConfirmationCode = () => {
    return `CF${Date.now().toString().slice(-6)}`;
  };

  const createBookingConfirmation = (): BookingConfirmationType => {
    const confirmationCode = generateConfirmationCode();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expira em 7 dias

    return {
      id: `conf_${Date.now()}`,
      appointmentId: Math.floor(Math.random() * 10000),
      confirmationCode,
      patientName: formData.patientName,
      patientEmail: formData.patientEmail,
      patientPhone: formData.patientPhone,
      appointmentDate: selectedSlot.date,
      appointmentTime: selectedSlot.time,
      modality: selectedSlot.modality,
      price: selectedSlot.price,
      paymentStatus: 'pending',
      instructions: {
        generalInstructions: 'Chegue com 10 minutos de antecedência. Traga um documento com foto.',
        onlineInstructions: 'Acesse o link da videoconferência 5 minutos antes do horário.',
        inPersonInstructions: 'O consultório está localizado no centro da cidade. Estacionamento disponível.',
        preparationNotes: 'Anote suas dúvidas e preocupações para discutirmos na consulta.',
        cancellationPolicy: 'Cancelamentos devem ser feitos com pelo menos 24h de antecedência.',
        reschedulingPolicy: 'Reagendamentos podem ser feitos até 48h antes da consulta.',
        contactInfo: {
          phone: '(11) 99999-9999',
          email: 'contato@psicologo.com',
          whatsapp: '(11) 99999-9999'
        }
      },
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString()
    };
  };

  const createPaymentLink = (): PaymentLink => {
    return {
      id: `pay_${Date.now()}`,
      appointmentId: Math.floor(Math.random() * 10000),
      amount: selectedSlot.price,
      description: `Consulta psicológica - ${new Date(selectedSlot.date).toLocaleDateString('pt-BR')} às ${selectedSlot.time}`,
      url: `https://pagamento.exemplo.com/pay/${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      status: 'active',
      createdAt: new Date().toISOString(),
      paymentMethod: selectedPaymentMethod as any,
      pixCode: '00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913PSICOLOGO LTDA6008SAO PAULO62070503***6304',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    };
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    
    try {
      // Simular processo de confirmação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newConfirmation = createBookingConfirmation();
      const newPaymentLink = createPaymentLink();
      
      setConfirmation(newConfirmation);
      setPaymentLink(newPaymentLink);
      setCurrentStep('payment');
      setIsConfirmed(true);
    } catch (error) {
      console.error('Erro ao confirmar agendamento:', error);
    } finally {
      setIsConfirming(false);
    }
  };

  const handlePaymentComplete = () => {
    if (confirmation) {
      const updatedConfirmation = {
        ...confirmation,
        paymentStatus: 'paid' as PaymentStatus
      };
      setConfirmation(updatedConfirmation);
      setCurrentStep('instructions');
    }
  };

  const handleFinalConfirm = () => {
    if (confirmation) {
      onConfirm(confirmation);
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

  // Renderizar etapa de pagamento
  if (isConfirmed && currentStep === 'payment' && confirmation && paymentLink) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 ${className}`}>
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-medium text-slate-800">Agendamento Confirmado</h3>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Código de confirmação: <span className="font-mono font-medium">{confirmation.confirmationCode}</span>
          </p>
        </div>

        <div className="p-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <h4 className="font-medium text-green-800">Agendamento Realizado com Sucesso!</h4>
            </div>
            <p className="text-sm text-green-700">
              Seu agendamento foi confirmado. Agora você pode realizar o pagamento para finalizar o processo.
            </p>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-slate-800 mb-4">Resumo do Agendamento</h4>
            <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Data:</span>
                <span className="font-medium">{new Date(selectedSlot.date).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Horário:</span>
                <span className="font-medium">{formatTime(selectedSlot.time)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Modalidade:</span>
                <span className="font-medium">{getModalityLabel(selectedSlot.modality)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Valor:</span>
                <span className="font-bold text-lg">{formatPrice(selectedSlot.price)}</span>
              </div>
            </div>
          </div>

          <PaymentMethodSelector
            selectedMethod={selectedPaymentMethod}
            onMethodChange={setSelectedPaymentMethod}
            amount={selectedSlot.price}
          />

          {selectedPaymentMethod === 'pix' && (
            <PIXQRCode
              paymentLink={paymentLink}
              onPaymentComplete={handlePaymentComplete}
            />
          )}

          {selectedPaymentMethod !== 'pix' && (
            <div className="mt-6">
              <button
                onClick={() => window.open(paymentLink.url, '_blank')}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Ir para Pagamento</span>
              </button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-slate-200">
            <button
              onClick={() => setCurrentStep('instructions')}
              className="w-full px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
            >
              Pular pagamento por enquanto
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar etapa de instruções
  if (isConfirmed && currentStep === 'instructions' && confirmation) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 ${className}`}>
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-medium text-slate-800">Instruções do Agendamento</h3>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Código: <span className="font-mono font-medium">{confirmation.confirmationCode}</span>
          </p>
        </div>

        <div className="p-6">
          <BookingInstructions
            instructions={confirmation.instructions}
            appointmentDate={confirmation.appointmentDate}
            appointmentTime={confirmation.appointmentTime}
            modality={confirmation.modality}
          />

          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownloadConfirmation}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Baixar comprovante</span>
              </button>
              
              <button
                onClick={handleShareConfirmation}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>Compartilhar</span>
              </button>

              <button
                onClick={handleFinalConfirm}
                className="flex items-center justify-center space-x-2 px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Finalizar</span>
              </button>
            </div>
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
