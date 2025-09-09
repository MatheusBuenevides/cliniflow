import React, { useState, useEffect } from 'react';
import { useVideoStore } from '../../stores/useVideoStore';
import LoadingSpinner from '../ui/LoadingSpinner';

interface SessionRecorderProps {
  isPsychologist: boolean;
  onRecordingComplete?: (url: string) => void;
}

export const SessionRecorder: React.FC<SessionRecorderProps> = ({
  isPsychologist,
  onRecordingComplete
}) => {
  const { 
    currentSession, 
    startRecording, 
    stopRecording, 
    isLoading 
  } = useVideoStore();
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [showConsentModal, setShowConsentModal] = useState(false);

  useEffect(() => {
    let interval: number;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording]);

  const handleStartRecording = async () => {
    if (!isPsychologist) {
      setShowConsentModal(true);
      return;
    }

    try {
      await startRecording();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
    }
  };

  const handleStopRecording = async () => {
    try {
      const url = await stopRecording();
      setIsRecording(false);
      setRecordingUrl(url);
      onRecordingComplete?.(url);
    } catch (error) {
      console.error('Erro ao parar gravação:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConsentConfirm = async () => {
    setShowConsentModal(false);
    await handleStartRecording();
  };

  if (!currentSession) return null;

  return (
    <>
      {/* Controles de Gravação */}
      <div className="flex items-center space-x-4">
        {!isRecording ? (
          <button
            onClick={handleStartRecording}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
            )}
            <span>Iniciar Gravação</span>
          </button>
        ) : (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span>Gravando</span>
              <span className="font-mono">{formatTime(recordingTime)}</span>
            </div>
            
            <button
              onClick={handleStopRecording}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h12v12H6z"/>
                </svg>
              )}
              <span>Parar</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal de Consentimento */}
      {showConsentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Consentimento para Gravação
              </h3>
              <p className="text-slate-400">
                A gravação desta sessão requer o consentimento de ambos os participantes. 
                Você concorda em ser gravado?
              </p>
            </div>

            <div className="bg-slate-700 rounded-lg p-4 mb-6">
              <h4 className="text-white font-medium mb-2">Informações sobre a gravação:</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• A gravação será armazenada de forma segura e criptografada</li>
                <li>• Apenas o psicólogo terá acesso ao arquivo</li>
                <li>• Você pode solicitar a exclusão a qualquer momento</li>
                <li>• A gravação será usada apenas para fins terapêuticos</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowConsentModal(false)}
                className="flex-1 bg-slate-700 text-white px-4 py-3 rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConsentConfirm}
                className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                Concordar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* URL da Gravação */}
      {recordingUrl && (
        <div className="mt-4 p-4 bg-slate-700 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Gravação Concluída</h4>
              <p className="text-sm text-slate-400">
                Duração: {formatTime(recordingTime)}
              </p>
            </div>
            <a
              href={recordingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Baixar
            </a>
          </div>
        </div>
      )}
    </>
  );
};
