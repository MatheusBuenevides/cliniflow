import React, { useState } from 'react';
import { useVideoStore } from '../../stores/useVideoStore';
import { SessionRecorder } from './SessionRecorder';
import LoadingSpinner from '../ui/LoadingSpinner';

interface SessionControlsProps {
  appointmentId: number;
  isPsychologist?: boolean;
  onClose: () => void;
}

export const SessionControls: React.FC<SessionControlsProps> = ({
  appointmentId,
  isPsychologist = false,
  onClose
}) => {
  const { 
    currentSession, 
    endSession, 
    getSessionReport,
    isLoading 
  } = useVideoStore();
  
  const [sessionNotes, setSessionNotes] = useState('');
  const [, setSessionReport] = useState<any>(null);

  const handleSaveNotes = () => {
    // Em produção, aqui seria salvo no prontuário
    console.log('Notas da sessão:', sessionNotes);
  };

  const handleEndSession = async () => {
    try {
      await endSession();
      onClose();
    } catch (error) {
      console.error('Erro ao finalizar sessão:', error);
    }
  };

  const handleGenerateReport = async () => {
    try {
      const report = await getSessionReport();
      setSessionReport(report);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    }
  };

  const getSessionDuration = () => {
    if (!currentSession?.startTime) return '00:00:00';
    
    const start = new Date(currentSession.startTime);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Controles da Sessão</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Controles de Gravação */}
        <div className="mb-6">
          <h3 className="text-white font-medium mb-3">Gravação da Sessão</h3>
          <SessionRecorder 
            isPsychologist={isPsychologist}
            onRecordingComplete={(url) => {
              console.log('Gravação concluída:', url);
            }}
          />
        </div>

        {/* Notas da Sessão */}
        <div className="mb-6">
          <h3 className="text-white font-medium mb-3">Notas da Sessão</h3>
          <textarea
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            placeholder="Adicione observações importantes da sessão..."
            className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={4}
            maxLength={1000}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-400">
              {sessionNotes.length}/1000 caracteres
            </span>
            <button
              onClick={handleSaveNotes}
              className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-colors"
            >
              Salvar
            </button>
          </div>
        </div>

        {/* Configurações Rápidas */}
        <div className="mb-6">
          <h3 className="text-white font-medium mb-3">Configurações</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Qualidade de Vídeo</span>
              <select className="bg-slate-700 text-white px-3 py-1 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="auto">Automática</option>
                <option value="high">Alta</option>
                <option value="medium">Média</option>
                <option value="low">Baixa</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Qualidade de Áudio</span>
              <select className="bg-slate-700 text-white px-3 py-1 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="auto">Automática</option>
                <option value="high">Alta</option>
                <option value="medium">Média</option>
              </select>
            </div>
          </div>
        </div>

        {/* Informações da Sessão */}
        <div className="mb-6 p-4 bg-slate-700 rounded-lg">
          <h3 className="text-white font-medium mb-2">Informações da Sessão</h3>
          <div className="space-y-1 text-sm text-slate-300">
            <div className="flex justify-between">
              <span>ID da Sessão:</span>
              <span className="font-mono">{appointmentId}</span>
            </div>
            <div className="flex justify-between">
              <span>Duração:</span>
              <span>{getSessionDuration()}</span>
            </div>
            <div className="flex justify-between">
              <span>Participantes:</span>
              <span>2</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-green-400">Ativa</span>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col space-y-3">
          {isPsychologist && (
            <button
              onClick={handleGenerateReport}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Gerar Relatório'}
            </button>
          )}
          
          <button
            onClick={handleEndSession}
            disabled={isLoading}
            className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Finalizar Sessão'}
          </button>
          
          <button
            onClick={onClose}
            className="w-full bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-600 transition-colors font-medium"
          >
            Fechar Controles
          </button>
        </div>

        {/* Aviso de Segurança */}
        <div className="mt-4 p-3 bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg">
          <div className="flex items-start space-x-2">
            <svg className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-xs text-yellow-200">
              Esta sessão é confidencial e protegida por criptografia. 
              Não compartilhe informações sensíveis fora da plataforma.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
