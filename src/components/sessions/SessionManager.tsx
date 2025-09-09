import React, { useState, useEffect } from 'react';
import { useVideoStore } from '../../stores/useVideoStore';
import { VideoRoom } from './VideoRoom';
import { WaitingRoom } from './WaitingRoom';
import { SessionControls } from './SessionControls';
import LoadingSpinner from '../ui/LoadingSpinner';

interface SessionManagerProps {
  appointmentId: number;
  isPsychologist?: boolean;
  onSessionEnd?: () => void;
}

export const SessionManager: React.FC<SessionManagerProps> = ({
  appointmentId,
  isPsychologist = false,
  onSessionEnd
}) => {
  const {
    currentSession,
    isLoading,
    error,
    startSession,
    joinSession,
    clearError
  } = useVideoStore();

  const [sessionPhase, setSessionPhase] = useState<'waiting' | 'active' | 'ended'>('waiting');
  const [showControls, setShowControls] = useState(false);

  // Inicializar sessão quando o componente monta
  useEffect(() => {
    if (appointmentId && !currentSession) {
      handleInitializeSession();
    }
  }, [appointmentId, currentSession]);

  // Atualizar fase da sessão baseado no status
  useEffect(() => {
    if (currentSession) {
      switch (currentSession.status) {
        case 'waiting':
          setSessionPhase('waiting');
          break;
        case 'active':
          setSessionPhase('active');
          break;
        case 'ended':
          setSessionPhase('ended');
          break;
        default:
          setSessionPhase('waiting');
      }
    }
  }, [currentSession]);

  const handleInitializeSession = async () => {
    try {
      if (isPsychologist) {
        // Psicólogo inicia a sessão
        await startSession(appointmentId);
      } else {
        // Paciente entra na sessão existente
        // Em produção, o roomId viria do agendamento
        const roomId = `room_${appointmentId}`;
        await joinSession(roomId);
      }
    } catch (error) {
      console.error('Erro ao inicializar sessão:', error);
    }
  };

  const handleStartSession = () => {
    setSessionPhase('active');
  };

  const handleEndSession = () => {
    setSessionPhase('ended');
    onSessionEnd?.();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" text="Preparando sessão..." />
          <p className="text-slate-400 mt-4">
            {isPsychologist ? 'Iniciando sala de telepsicologia...' : 'Conectando à sessão...'}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-4">Erro na Sessão</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={clearError}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Tentar Novamente
            </button>
            <button
              onClick={onSessionEnd}
              className="w-full bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-600 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar componente baseado na fase da sessão
  switch (sessionPhase) {
    case 'waiting':
      return (
        <WaitingRoom
          appointmentId={appointmentId}
          isPsychologist={isPsychologist}
          onStartSession={handleStartSession}
          onEndSession={handleEndSession}
        />
      );

    case 'active':
      return (
        <div className="relative">
          <VideoRoom
            appointmentId={appointmentId}
            isPsychologist={isPsychologist}
            onSessionEnd={handleEndSession}
          />
          
          {showControls && (
            <SessionControls
              appointmentId={appointmentId}
              isPsychologist={isPsychologist}
              onClose={() => setShowControls(false)}
            />
          )}
          
          {/* Botão flutuante para controles */}
          <button
            onClick={() => setShowControls(!showControls)}
            className="fixed top-4 right-4 bg-slate-800 text-white p-3 rounded-full shadow-lg hover:bg-slate-700 transition-colors z-50"
            title="Controles da sessão"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      );

    case 'ended':
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-4">Sessão Finalizada</h2>
            <p className="text-slate-400 mb-6">
              A sessão de telepsicologia foi encerrada com sucesso.
            </p>
            <button
              onClick={onSessionEnd}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      );

    default:
      return null;
  }
};
