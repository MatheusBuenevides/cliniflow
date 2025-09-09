import { create } from 'zustand';
import type { 
  VideoSession, 
  ChatMessage, 
  ConnectionQuality 
} from '../types/index';
import { sessionService, type CreateSessionRequest, type JoinSessionRequest } from '../services/sessionService';

interface VideoState {
  // Estado
  currentSession: VideoSession | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'failed';
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  chatMessages: ChatMessage[];
  connectionQuality: ConnectionQuality | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  startSession: (appointmentId: number, psychologistId?: number, patientId?: number) => Promise<void>;
  endSession: () => Promise<void>;
  joinSession: (roomId: string, participantId?: number, participantType?: 'psychologist' | 'patient') => Promise<void>;
  leaveSession: () => Promise<void>;
  sendChatMessage: (message: string, senderId: number, senderName: string) => Promise<void>;
  toggleVideo: () => void;
  toggleAudio: () => void;
  updateConnectionQuality: (quality: ConnectionQuality) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  testEquipment: () => Promise<any>;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string>;
  getSessionReport: () => Promise<any>;
}


export const useVideoStore = create<VideoState>((set, get) => ({
  // Estado inicial
  currentSession: null,
  connectionStatus: 'disconnected',
  isVideoEnabled: true,
  isAudioEnabled: true,
  chatMessages: [],
  connectionQuality: null,
  isLoading: false,
  error: null,

  // Actions
  startSession: async (appointmentId: number, psychologistId = 1, patientId = 2) => {
    set({ isLoading: true, error: null, connectionStatus: 'connecting' });
    
    try {
      const request: CreateSessionRequest = {
        appointmentId,
        psychologistId,
        patientId,
        recordingEnabled: false,
        sessionConfig: {
          allowChat: true,
          allowScreenShare: true,
          maxParticipants: 2,
        },
      };

      const newSession = await sessionService.createSession(request);
      
      set({
        currentSession: newSession,
        connectionStatus: 'connected',
        chatMessages: newSession.chatMessages || [],
        connectionQuality: newSession.connectionQuality || null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        currentSession: null,
        connectionStatus: 'failed',
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao iniciar sessão',
      });
    }
  },

  endSession: async () => {
    const { currentSession } = get();
    if (!currentSession) return;
    
    set({ isLoading: true, error: null });
    
    try {
      await sessionService.endSession(currentSession.id);
      
      const endedSession: VideoSession = {
        ...currentSession,
        status: 'ended',
        endTime: new Date().toISOString(),
      };
      
      set({
        currentSession: endedSession,
        connectionStatus: 'disconnected',
        isLoading: false,
        error: null,
      });
      
      // Limpar sessão após um delay
      setTimeout(() => {
        set({
          currentSession: null,
          chatMessages: [],
          connectionQuality: null,
        });
      }, 2000);
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao finalizar sessão',
      });
    }
  },

  joinSession: async (roomId: string, participantId = 2, participantType: 'psychologist' | 'patient' = 'patient') => {
    set({ isLoading: true, error: null, connectionStatus: 'connecting' });
    
    try {
      const request: JoinSessionRequest = {
        roomId,
        participantId,
        participantType,
      };

      const existingSession = await sessionService.joinSession(request);
      
      set({
        currentSession: existingSession,
        connectionStatus: 'connected',
        chatMessages: existingSession.chatMessages || [],
        connectionQuality: existingSession.connectionQuality || null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        currentSession: null,
        connectionStatus: 'failed',
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao entrar na sessão',
      });
    }
  },

  leaveSession: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({
        connectionStatus: 'disconnected',
        isLoading: false,
        error: null,
      });
      
      // Limpar sessão após um delay
      setTimeout(() => {
        set({
          currentSession: null,
          chatMessages: [],
          connectionQuality: null,
        });
      }, 1000);
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao sair da sessão',
      });
    }
  },

  sendChatMessage: async (message: string, senderId: number, senderName: string) => {
    const { currentSession } = get();
    if (!currentSession) return;
    
    try {
      const newMessage = await sessionService.sendChatMessage(
        currentSession.id,
        message,
        senderId,
        senderName
      );
      
      set(state => ({
        chatMessages: [...state.chatMessages, newMessage],
      }));
      
      // Simular resposta automática (mock)
      if (senderId !== 1) { // Se não for o psicólogo
        setTimeout(async () => {
          try {
            const responseMessage = await sessionService.sendChatMessage(
              currentSession.id,
              'Entendo. Vamos conversar mais sobre isso.',
              1,
              'Dr. Ana Silva'
            );
            
            set(state => ({
              chatMessages: [...state.chatMessages, responseMessage],
            }));
          } catch (error) {
            console.error('Erro ao enviar resposta automática:', error);
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      set({ error: 'Erro ao enviar mensagem' });
    }
  },

  toggleVideo: () => {
    const { isVideoEnabled } = get();
    set({ isVideoEnabled: !isVideoEnabled });
  },

  toggleAudio: () => {
    const { isAudioEnabled } = get();
    set({ isAudioEnabled: !isAudioEnabled });
  },

  updateConnectionQuality: async (quality: ConnectionQuality) => {
    const { currentSession } = get();
    if (!currentSession) return;
    
    try {
      await sessionService.updateConnectionQuality(currentSession.id, quality);
      
      set({ connectionQuality: quality });
      
      // Atualizar também na sessão atual
      set({
        currentSession: {
          ...currentSession,
          connectionQuality: quality,
        },
      });
    } catch (error) {
      console.error('Erro ao atualizar qualidade da conexão:', error);
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  testEquipment: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await sessionService.testEquipment();
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao testar equipamentos',
      });
      throw error;
    }
  },

  startRecording: async () => {
    const { currentSession } = get();
    if (!currentSession) return;
    
    set({ isLoading: true, error: null });
    
    try {
      await sessionService.startRecording(currentSession.id);
      
      set({
        currentSession: {
          ...currentSession,
          recordingEnabled: true,
        },
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao iniciar gravação',
      });
    }
  },

  stopRecording: async () => {
    const { currentSession } = get();
    if (!currentSession) return '';
    
    set({ isLoading: true, error: null });
    
    try {
      const recordingUrl = await sessionService.stopRecording(currentSession.id);
      
      set({
        currentSession: {
          ...currentSession,
          recordingEnabled: false,
        },
        isLoading: false,
      });
      
      return recordingUrl;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao parar gravação',
      });
      throw error;
    }
  },

  getSessionReport: async () => {
    const { currentSession } = get();
    if (!currentSession) return null;
    
    set({ isLoading: true, error: null });
    
    try {
      const report = await sessionService.getSessionReport(currentSession.id);
      set({ isLoading: false });
      return report;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao obter relatório',
      });
      throw error;
    }
  },
}));
