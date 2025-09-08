import React, { useState } from 'react';
import { 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  ArrowLeft,
  Smartphone,
  Mail,
  MessageCircle,
  Download,
  Share2,
  Phone
} from 'lucide-react';
import { AppointmentForm } from '../components/agenda';
import { PaymentStatusComponent } from '../components/agenda';
import type { BookingConfirmation as BookingConfirmationType, PaymentStatus } from '../types';

const BookingDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'booking' | 'confirmation' | 'payment' | 'complete'>('booking');
  const [confirmation, setConfirmation] = useState<BookingConfirmationType | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');

  const handleBookingComplete = (bookingConfirmation: BookingConfirmationType) => {
    setConfirmation(bookingConfirmation);
    setCurrentStep('confirmation');
  };

  const handlePaymentComplete = () => {
    setPaymentStatus('paid');
    setCurrentStep('complete');
  };

  const handleBackToBooking = () => {
    setCurrentStep('booking');
    setConfirmation(null);
    setPaymentStatus('pending');
  };

  const handleStartPayment = () => {
    setCurrentStep('payment');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (currentStep === 'booking') {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-6">
            <button
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </button>
            <h1 className="text-3xl font-bold text-slate-800">Sistema de Agendamento Completo</h1>
            <p className="text-slate-600 mt-2">
              Demonstração do fluxo completo: agendamento, confirmação, pagamento e notificações
            </p>
          </div>

          <AppointmentForm
            psychologistId={1}
            onBookingComplete={handleBookingComplete}
            onCancel={() => window.history.back()}
          />
        </div>
      </div>
    );
  }

  if (currentStep === 'confirmation' && confirmation) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <button
              onClick={handleBackToBooking}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar ao agendamento</span>
            </button>
            <h1 className="text-3xl font-bold text-slate-800">Agendamento Confirmado</h1>
            <p className="text-slate-600 mt-2">
              Código de confirmação: <span className="font-mono font-medium">{confirmation.confirmationCode}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Resumo do agendamento */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-6">Resumo do Agendamento</h2>
                
                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h3 className="font-medium text-slate-800 mb-3">Detalhes da Consulta</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-600">Data</p>
                          <p className="font-medium">
                            {new Date(confirmation.appointmentDate).toLocaleDateString('pt-BR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-600">Horário</p>
                          <p className="font-medium">{confirmation.appointmentTime}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {confirmation.modality === 'online' ? (
                          <Smartphone className="h-5 w-5 text-slate-500" />
                        ) : (
                          <Calendar className="h-5 w-5 text-slate-500" />
                        )}
                        <div>
                          <p className="text-sm text-slate-600">Modalidade</p>
                          <p className="font-medium">
                            {confirmation.modality === 'online' ? 'Online' : 'Presencial'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-600">Valor</p>
                          <p className="font-bold text-lg">{formatPrice(confirmation.price)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <h3 className="font-medium text-slate-800 mb-3">Dados do Paciente</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-600">Nome</p>
                        <p className="font-medium">{confirmation.patientName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Email</p>
                        <p className="font-medium">{confirmation.patientEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Telefone</p>
                        <p className="font-medium">{confirmation.patientPhone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-800 mb-3">Instruções Importantes</h3>
                    <p className="text-sm text-blue-700 mb-2">{confirmation.instructions.generalInstructions}</p>
                    {confirmation.modality === 'online' && confirmation.instructions.onlineInstructions && (
                      <p className="text-sm text-blue-700">{confirmation.instructions.onlineInstructions}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Painel lateral */}
            <div className="space-y-6">
              {/* Status do pagamento */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Status do Pagamento</h3>
                <PaymentStatusComponent
                  status={paymentStatus}
                  amount={confirmation.price}
                  onRetry={() => setCurrentStep('payment')}
                />
              </div>

              {/* Ações */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Ações</h3>
                <div className="space-y-3">
                  {paymentStatus === 'pending' && (
                    <button
                      onClick={handleStartPayment}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Realizar Pagamento</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => window.print()}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Baixar Comprovante</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Confirmação de Agendamento',
                          text: `Agendamento confirmado para ${new Date(confirmation.appointmentDate).toLocaleDateString('pt-BR')} às ${confirmation.appointmentTime}`,
                          url: window.location.href
                        });
                      }
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Compartilhar</span>
                  </button>
                </div>
              </div>

              {/* Contato */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Contato</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-slate-500" />
                    <a 
                      href={`tel:${confirmation.instructions.contactInfo.phone}`}
                      className="text-sm text-slate-600 hover:text-slate-800 transition-colors"
                    >
                      {confirmation.instructions.contactInfo.phone}
                    </a>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <a 
                      href={`mailto:${confirmation.instructions.contactInfo.email}`}
                      className="text-sm text-slate-600 hover:text-slate-800 transition-colors"
                    >
                      {confirmation.instructions.contactInfo.email}
                    </a>
                  </div>
                  
                  {confirmation.instructions.contactInfo.whatsapp && (
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="h-4 w-4 text-slate-500" />
                      <a 
                        href={`https://wa.me/${confirmation.instructions.contactInfo.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-slate-600 hover:text-slate-800 transition-colors"
                      >
                        WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'payment' && confirmation) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-6">
            <button
              onClick={() => setCurrentStep('confirmation')}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar à confirmação</span>
            </button>
            <h1 className="text-3xl font-bold text-slate-800">Pagamento</h1>
            <p className="text-slate-600 mt-2">
              Complete o pagamento para finalizar seu agendamento
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Pagamento da Consulta</h2>
              <p className="text-slate-600">
                Valor: <span className="font-bold text-lg">{formatPrice(confirmation.price)}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-medium text-slate-800 mb-2">Resumo do Agendamento</h3>
                <div className="text-sm text-slate-600 space-y-1">
                  <p><strong>Data:</strong> {new Date(confirmation.appointmentDate).toLocaleDateString('pt-BR')}</p>
                  <p><strong>Horário:</strong> {confirmation.appointmentTime}</p>
                  <p><strong>Modalidade:</strong> {confirmation.modality === 'online' ? 'Online' : 'Presencial'}</p>
                  <p><strong>Paciente:</strong> {confirmation.patientName}</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">Métodos de Pagamento Disponíveis</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                    <Smartphone className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-sm">PIX</p>
                      <p className="text-xs text-slate-500">Pagamento instantâneo</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">Cartão</p>
                      <p className="text-xs text-slate-500">Crédito ou débito</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePaymentComplete}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Simular Pagamento (Demo)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'complete' && confirmation) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-slate-800 mb-4">
              Agendamento Finalizado!
            </h1>
            
            <p className="text-slate-600 mb-6">
              Seu agendamento foi confirmado e o pagamento foi processado com sucesso.
            </p>

            <div className="bg-slate-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-slate-800 mb-4">Detalhes finais:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Código de confirmação:</span>
                  <span className="font-mono font-medium">{confirmation.confirmationCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Data:</span>
                  <span className="font-medium">
                    {new Date(confirmation.appointmentDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Horário:</span>
                  <span className="font-medium">{confirmation.appointmentTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Valor pago:</span>
                  <span className="font-bold">{formatPrice(confirmation.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Status do pagamento:</span>
                  <span className="font-medium text-green-600">Pago</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-800 mb-2">Próximos passos:</h4>
              <ul className="text-sm text-blue-700 space-y-1 text-left">
                <li>• Você receberá um email de confirmação</li>
                <li>• Um lembrete será enviado 24h antes da consulta</li>
                <li>• Em caso de dúvidas, entre em contato conosco</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleBackToBooking}
                className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Novo Agendamento
              </button>
              
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
              >
                Imprimir Comprovante
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default BookingDemo;
