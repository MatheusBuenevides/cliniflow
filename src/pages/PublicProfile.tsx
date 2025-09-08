import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// Interface local para evitar problemas de importação
interface Psychologist {
  id: number;
  name: string;
  crp: string;
  email: string;
  phone: string;
  avatar?: string;
  bio: string;
  specialties: string[];
  customUrl: string;
  workingHours: WorkingHours;
  sessionPrices: SessionPrices;
  createdAt: string;
  updatedAt: string;
}

interface WorkingHours {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
}

interface DaySchedule {
  start: string;
  end: string;
  lunchStart?: string;
  lunchEnd?: string;
}

interface SessionPrices {
  initial: number;
  followUp: number;
  online: number;
  duration: number;
}
import { getPsychologistByCustomUrl } from '../services/mockData';
import PublicLayout from '../components/layout/PublicLayout';
import { PsychologistProfile } from '../components/psychologist';
import BookingCTA from '../components/psychologist/BookingCTA';
import { LoadingSpinner } from '../components/ui';
import { AppointmentForm } from '../components/agenda';
import type { Appointment } from '../types';

const PublicProfile: React.FC = () => {
  const { customUrl } = useParams<{ customUrl: string }>();
  const [psychologist, setPsychologist] = useState<Psychologist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [completedAppointment, setCompletedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    const fetchPsychologist = async () => {
      if (!customUrl) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Simula delay de rede
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const foundPsychologist = getPsychologistByCustomUrl(customUrl);
        
        if (foundPsychologist) {
          setPsychologist(foundPsychologist);
        } else {
          setError('Psicólogo não encontrado');
        }
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
        setError('Erro ao carregar perfil do psicólogo');
      } finally {
        setLoading(false);
      }
    };

    fetchPsychologist();
  }, [customUrl]);

  const handleBookingComplete = (appointment: Appointment) => {
    setCompletedAppointment(appointment);
    setShowBookingForm(false);
  };

  const handleStartBooking = () => {
    setShowBookingForm(true);
    setCompletedAppointment(null);
  };

  const handleCancelBooking = () => {
    setShowBookingForm(false);
    setCompletedAppointment(null);
  };

  // Loading State
  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner size="lg" text="Carregando perfil do psicólogo..." />
        </div>
      </PublicLayout>
    );
  }

  // Error State - 404
  if (error || !psychologist) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Psicólogo não encontrado</h1>
            <p className="text-gray-600 mb-8">
              O psicólogo que você está procurando não foi encontrado ou a URL pode estar incorreta.
            </p>
            <div className="space-y-4">
              <a
                href="/"
                className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
              >
                Voltar ao início
              </a>
              <p className="text-sm text-gray-500">
                Verifique se a URL está correta ou entre em contato conosco.
              </p>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  // Success State - Mostrar perfil
  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showBookingForm ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Agendar Consulta</h1>
                <p className="text-slate-600 mt-2">
                  Agende sua consulta com {psychologist.name}
                </p>
              </div>
              <button
                onClick={handleCancelBooking}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <AppointmentForm
              psychologistId={psychologist.id}
              onBookingComplete={handleBookingComplete}
              onCancel={handleCancelBooking}
            />
          </div>
        ) : completedAppointment ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-slate-800 mb-4">
              Agendamento Confirmado!
            </h1>
            
            <p className="text-slate-600 mb-6">
              Seu agendamento foi realizado com sucesso. Você receberá um email de confirmação em breve.
            </p>

            <div className="bg-slate-50 rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
              <h3 className="font-semibold text-slate-800 mb-4">Detalhes do agendamento:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-slate-600">
                    {new Date(completedAppointment.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-slate-600">
                    {completedAppointment.time}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
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
                onClick={handleStartBooking}
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
        ) : (
          <div className="space-y-8">
            <PsychologistProfile 
              psychologist={psychologist} 
              onStartBooking={handleStartBooking}
            />
            
            <BookingCTA 
              onStartBooking={handleStartBooking}
              psychologistName={psychologist.name}
            />
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default PublicProfile;
