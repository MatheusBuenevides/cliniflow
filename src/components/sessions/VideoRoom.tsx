import React, { useEffect, useRef, useState } from 'react';
import { useVideoStore } from '../../stores/useVideoStore';
import { VideoPlayer } from './VideoPlayer';
import { ControlPanel } from './ControlPanel';
import { ChatPanel } from './ChatPanel';
import { ConnectionStatus } from './ConnectionStatus';
import { SessionIntegration } from './SessionIntegration';
import LoadingSpinner from '../ui/LoadingSpinner';

interface VideoRoomProps {
  appointmentId: number;
  isPsychologist?: boolean;
  onSessionEnd?: () => void;
}

export const VideoRoom: React.FC<VideoRoomProps> = ({
  appointmentId,
  isPsychologist = false,
  onSessionEnd
}) => {
  const {
    currentSession,
    connectionStatus,
    isVideoEnabled,
    isAudioEnabled,
    chatMessages,
    connectionQuality,
    isLoading,
    error,
    startSession,
    endSession,
    sendChatMessage,
    toggleVideo,
    toggleAudio,
    clearError
  } = useVideoStore();

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Inicializar sessão quando o componente monta
  useEffect(() => {
    if (appointmentId && !currentSession) {
      handleStartSession();
    }
  }, [appointmentId, currentSession]);

  // Configurar streams de vídeo/áudio
  useEffect(() => {
    if (currentSession && connectionStatus === 'connected') {
      setupMediaStreams();
    }
  }, [currentSession, connectionStatus]);

  const handleStartSession = async () => {
    try {
      setIsConnecting(true);
      await startSession(appointmentId);
    } catch (error) {
      console.error('Erro ao iniciar sessão:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const setupMediaStreams = async () => {
    try {
      // Solicitar acesso à câmera e microfone
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled
      });

      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Simular stream remoto (em produção seria via WebRTC)
      setTimeout(() => {
        // Mock: criar um stream remoto simulado
        const mockRemoteStream = new MediaStream();
        setRemoteStream(mockRemoteStream);
        
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = mockRemoteStream;
        }
      }, 2000);

    } catch (error) {
      console.error('Erro ao acessar mídia:', error);
    }
  };

  const handleEndSession = async () => {
    try {
      // Parar streams locais
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }

      await endSession();
      onSessionEnd?.();
    } catch (error) {
      console.error('Erro ao finalizar sessão:', error);
    }
  };

  const handleSendMessage = (message: string) => {
    if (currentSession) {
      const senderId = isPsychologist ? 1 : 2;
      const senderName = isPsychologist ? 'Dr. Ana Silva' : 'Paciente';
      sendChatMessage(message, senderId, senderName);
    }
  };

  // Loading state
  if (isLoading || isConnecting) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" text="Conectando à sessão..." />
          <p className="text-slate-400 mt-4">
            Preparando ambiente de telepsicologia...
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
          <h2 className="text-xl font-semibold text-white mb-4">Erro na Conexão</h2>
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
              Sair da Sessão
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sessão não encontrada
  if (!currentSession) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Sessão não encontrada</h2>
          <p className="text-slate-400 mb-6">
            Não foi possível encontrar a sessão de telepsicologia.
          </p>
          <button
            onClick={onSessionEnd}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Integração com Sistema */}
      <SessionIntegration 
        appointmentId={appointmentId}
        onSessionComplete={(data) => {
          console.log('Sessão integrada:', data);
        }}
      />

      {/* Header da Sessão */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <h1 className="text-white font-semibold">
                Sessão de Telepsicologia
              </h1>
              <p className="text-slate-400 text-sm">
                {isPsychologist ? 'Dr. Ana Silva' : 'Paciente'} • 
                {currentSession.startTime ? new Date(currentSession.startTime).toLocaleString('pt-BR') : 'Sessão ativa'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <ConnectionStatus quality={connectionQuality} />
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Área Principal de Vídeo */}
      <div className="flex-1 flex">
        {/* Vídeo Principal */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-slate-800">
            {/* Vídeo Remoto (Principal) */}
            <VideoPlayer
              ref={remoteVideoRef}
              stream={remoteStream}
              isLocal={false}
              className="w-full h-full object-cover"
            />
            
            {/* Vídeo Local (Picture-in-Picture) */}
            <div className="absolute top-4 right-4 w-48 h-36 bg-slate-700 rounded-lg overflow-hidden border-2 border-slate-600">
              <VideoPlayer
                ref={localVideoRef}
                stream={localStream}
                isLocal={true}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Overlay quando não há vídeo */}
            {!remoteStream && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-slate-400">
                    {isPsychologist ? 'Aguardando paciente...' : 'Aguardando psicólogo...'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Lateral */}
        {showChat && (
          <div className="w-80 bg-slate-800 border-l border-slate-700">
            <ChatPanel
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              onClose={() => setShowChat(false)}
            />
          </div>
        )}
      </div>

      {/* Painel de Controle */}
      <ControlPanel
        isVideoEnabled={isVideoEnabled}
        isAudioEnabled={isAudioEnabled}
        onToggleVideo={toggleVideo}
        onToggleAudio={toggleAudio}
        onToggleChat={() => setShowChat(!showChat)}
        onEndSession={handleEndSession}
        showChat={showChat}
        isPsychologist={isPsychologist}
      />
    </div>
  );
};
