import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';

interface WaitingRoomProps {
  appointmentId: number;
  isPsychologist?: boolean;
  onStartSession: () => void;
  onEndSession: () => void;
}

export const WaitingRoom: React.FC<WaitingRoomProps> = ({
  appointmentId,
  isPsychologist = false,
  onStartSession,
  onEndSession
}) => {
  const [participants, setParticipants] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Simular participantes entrando na sala
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isPsychologist) {
        setParticipants(['Dr. Ana Silva']);
      } else {
        setParticipants(['Paciente']);
      }
      setIsReady(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isPsychologist]);

  // Simular countdown quando ambos estão prontos
  useEffect(() => {
    if (isReady && participants.length >= 1) {
      setCountdown(5);
      const countdownTimer = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(countdownTimer);
            onStartSession();
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownTimer);
    }
  }, [isReady, participants.length, onStartSession]);

  const handleStartNow = () => {
    onStartSession();
  };

  const handleLeaveRoom = () => {
    onEndSession();
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Sala de Espera
            </h1>
            <p className="text-slate-400">
              {isPsychologist 
                ? 'Aguardando paciente entrar na sessão...' 
                : 'Aguardando psicólogo iniciar a sessão...'
              }
            </p>
          </div>

          {/* Status da Conexão */}
          <div className="bg-slate-700 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Status da Conexão</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Conectado</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-300">Microfone: OK</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-300">Câmera: OK</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-300">Internet: Estável</span>
              </div>
            </div>
          </div>

          {/* Lista de Participantes */}
          <div className="bg-slate-700 rounded-lg p-6 mb-6">
            <h3 className="text-white font-semibold mb-4">Participantes</h3>
            <div className="space-y-3">
              {participants.length === 0 ? (
                <div className="flex items-center space-x-3 text-slate-400">
                  <LoadingSpinner size="sm" />
                  <span>Carregando participantes...</span>
                </div>
              ) : (
                participants.map((participant, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="text-white">{participant}</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Countdown */}
          {countdown && countdown > 0 && (
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">{countdown}</span>
              </div>
              <p className="text-slate-400">Iniciando sessão em...</p>
            </div>
          )}

          {/* Instruções */}
          <div className="bg-slate-700 rounded-lg p-6 mb-6">
            <h3 className="text-white font-semibold mb-4">Instruções para a Sessão</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>Certifique-se de estar em um ambiente silencioso e privado</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>Teste seu microfone e câmera antes de começar</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>Mantenha uma conexão estável com a internet</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>A sessão será gravada apenas com seu consentimento</span>
              </li>
            </ul>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-3">
            {isPsychologist && isReady && (
              <button
                onClick={handleStartNow}
                className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Iniciar Sessão Agora
              </button>
            )}
            
            <button
              onClick={handleLeaveRoom}
              className="flex-1 bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-600 transition-colors font-medium"
            >
              Sair da Sala
            </button>
          </div>

          {/* Informações de Suporte */}
          <div className="mt-6 pt-6 border-t border-slate-600">
            <p className="text-xs text-slate-500 text-center">
              Em caso de problemas técnicos, entre em contato com o suporte.
              <br />
              Sessão ID: {appointmentId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
