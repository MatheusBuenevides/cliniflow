import React, { useState } from 'react';
import { Calendar, Clock, User, CheckCircle, ArrowLeft } from 'lucide-react';
import { AppointmentForm } from '../components/agenda';
import type { Appointment } from '../types';

const OnlineBooking: React.FC = () => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [completedAppointment, setCompletedAppointment] = useState<Appointment | null>(null);

  const handleStartBooking = () => {
    setShowBookingForm(true);
    setCompletedAppointment(null);
  };

  const handleBookingComplete = (appointment: Appointment) => {
    setCompletedAppointment(appointment);
    setShowBookingForm(false);
  };

  const handleCancel = () => {
    setShowBookingForm(false);
    setCompletedAppointment(null);
  };

  const handleNewBooking = () => {
    setCompletedAppointment(null);
    setShowBookingForm(false);
  };

  if (completedAppointment) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-slate-800 mb-4">
              Agendamento Realizado com Sucesso!
            </h1>
            
            <p className="text-slate-600 mb-6">
              Seu agendamento foi confirmado. Você receberá um email de confirmação em breve.
            </p>

            <div className="bg-slate-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-slate-800 mb-4">Detalhes do agendamento:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600">
                    {new Date(completedAppointment.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600">
                    {completedAppointment.time}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600">
                    {completedAppointment.patient.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-600">
                    Modalidade: {completedAppointment.modality === 'online' ? 'Online' : 'Presencial'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-600">
                    Valor: {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(completedAppointment.price)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleNewBooking}
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

  if (showBookingForm) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-6">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </button>
            <h1 className="text-3xl font-bold text-slate-800">Agendar Consulta Online</h1>
            <p className="text-slate-600 mt-2">
              Preencha os dados abaixo para agendar sua consulta
            </p>
          </div>

          <AppointmentForm
            psychologistId={1} // Mock ID
            onBookingComplete={handleBookingComplete}
            onCancel={handleCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Sistema de Agendamento Online
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Agende sua consulta de forma rápida e segura. 
            Escolha o melhor horário e modalidade para você.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Calendário Visual
            </h3>
            <p className="text-slate-600 text-sm">
              Visualize horários disponíveis de forma intuitiva e navegue facilmente entre as datas.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Horários Flexíveis
            </h3>
            <p className="text-slate-600 text-sm">
              Escolha entre consultas presenciais ou online, com diferentes durações e preços.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Processo Simples
            </h3>
            <p className="text-slate-600 text-sm">
              Preencha seus dados, confirme o agendamento e receba a confirmação por email.
            </p>
          </div>
        </div>

        {/* Demo Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Demonstração do Sistema
            </h2>
            <p className="text-slate-600">
              Experimente o sistema de agendamento online completo
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Features List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Funcionalidades Implementadas:
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-700">Calendário Visual</p>
                    <p className="text-sm text-slate-500">
                      Exibição de horários disponíveis com navegação por mês/semana
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-700">Diferenciação Visual</p>
                    <p className="text-sm text-slate-500">
                      Indicação clara entre modalidades presencial e online
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-700">Bloqueio de Horários</p>
                    <p className="text-sm text-slate-500">
                      Horários passados e ocupados são automaticamente bloqueados
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-700">Formulário Completo</p>
                    <p className="text-sm text-slate-500">
                      Dados do paciente, modalidade, observações e termos
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-700">Validações em Tempo Real</p>
                    <p className="text-sm text-slate-500">
                      Verificação de disponibilidade e validação de dados
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-700">Confirmação Completa</p>
                    <p className="text-sm text-slate-500">
                      Resumo do agendamento e confirmação final
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col justify-center">
              <div className="bg-slate-50 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Pronto para testar?
                </h3>
                <p className="text-slate-600 mb-6">
                  Clique no botão abaixo para experimentar o sistema completo de agendamento online.
                </p>
                
                <button
                  onClick={handleStartBooking}
                  className="w-full px-8 py-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
                >
                  Iniciar Agendamento
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-12 bg-slate-100 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Detalhes Técnicos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-slate-700 mb-2">Componentes Criados:</h4>
              <ul className="space-y-1 text-slate-600">
                <li>• AvailabilityCalendar</li>
                <li>• TimeSlotGrid</li>
                <li>• PatientDataForm</li>
                <li>• BookingConfirmation</li>
                <li>• AppointmentForm (orquestrador)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-slate-700 mb-2">Funcionalidades:</h4>
              <ul className="space-y-1 text-slate-600">
                <li>• Validações em tempo real</li>
                <li>• Integração com stores Zustand</li>
                <li>• Serviços de API mockados</li>
                <li>• Tipos TypeScript completos</li>
                <li>• Interface responsiva</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineBooking;
