import React from 'react';

interface ControlPanelProps {
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onToggleChat: () => void;
  onEndSession: () => void;
  showChat: boolean;
  isPsychologist?: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isVideoEnabled,
  isAudioEnabled,
  onToggleVideo,
  onToggleAudio,
  onToggleChat,
  onEndSession,
  showChat,
  isPsychologist = false
}) => {
  return (
    <div className="bg-slate-800 border-t border-slate-700 px-6 py-4">
      <div className="flex items-center justify-center space-x-4">
        {/* Botão de Áudio */}
        <button
          onClick={onToggleAudio}
          className={`p-3 rounded-full transition-all duration-200 ${
            isAudioEnabled
              ? 'bg-slate-700 text-white hover:bg-slate-600'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
          title={isAudioEnabled ? 'Desativar microfone' : 'Ativar microfone'}
        >
          {isAudioEnabled ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
        </button>

        {/* Botão de Vídeo */}
        <button
          onClick={onToggleVideo}
          className={`p-3 rounded-full transition-all duration-200 ${
            isVideoEnabled
              ? 'bg-slate-700 text-white hover:bg-slate-600'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
          title={isVideoEnabled ? 'Desativar câmera' : 'Ativar câmera'}
        >
          {isVideoEnabled ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12" />
            </svg>
          )}
        </button>

        {/* Botão de Chat */}
        <button
          onClick={onToggleChat}
          className={`p-3 rounded-full transition-all duration-200 ${
            showChat
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-slate-700 text-white hover:bg-slate-600'
          }`}
          title={showChat ? 'Fechar chat' : 'Abrir chat'}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>

        {/* Separador */}
        <div className="w-px h-8 bg-slate-600"></div>

        {/* Botão de Finalizar Sessão */}
        <button
          onClick={onEndSession}
          className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all duration-200"
          title="Finalizar sessão"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Indicadores de Status */}
      <div className="flex items-center justify-center mt-3 space-x-6 text-sm text-slate-400">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isAudioEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>{isAudioEnabled ? 'Microfone ativo' : 'Microfone desativado'}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isVideoEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>{isVideoEnabled ? 'Câmera ativa' : 'Câmera desativada'}</span>
        </div>

        {isPsychologist && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>Modo Psicólogo</span>
          </div>
        )}
      </div>
    </div>
  );
};
