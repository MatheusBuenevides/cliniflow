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
import { LoadingSpinner } from '../components/ui';

const PublicProfile: React.FC = () => {
  const { customUrl } = useParams<{ customUrl: string }>();
  const [psychologist, setPsychologist] = useState<Psychologist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <PsychologistProfile psychologist={psychologist} />
      </div>
    </PublicLayout>
  );
};

export default PublicProfile;
