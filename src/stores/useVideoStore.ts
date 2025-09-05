import { create } from 'zustand';
import type { 
  VideoSession, 
  VideoSessionStatus, 
  ChatMessage, 
  ConnectionQuality 
} from '../types/index';

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
  startSession: (appointmentId: number) => Promise<void>;
  endSession: () => Promise<void>;
  joinSession: (roomId: string) => Promise<void>;
  leaveSession: () => Promise<void>;
  sendChatMessage: (message: string, senderId: number, senderName: string) => void;
  toggleVideo: () => void;
  toggleAudio: () => void;
  updateConnectionQuality: (quality: ConnectionQuality) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// Mock data temporário para desenvolvimento
const mockVideoSession: VideoSession = {
  id: 'session_123',
  appointmentId: 2,
  roomId: 'room_789',
  startTime: '2024-01-25T16:00:00.000Z',
  participantIds: [1, 2], // psychologistId, patientId
  status: 'active',
  recordingEnabled: false,
  chatMessages: [
    {
      id: 'msg_1',
      senderId: 1,
      senderName: 'Dr. Ana Silva',
      message: 'Olá! Como você está se sentindo hoje?',
      timestamp: '2024-01-25T16:00:30.000Z',
      type: 'text',
    },
    {
      id: 'msg_2',
      senderId: 2,
      senderName: 'João Oliveira',
      message: 'Olá doutora! Estou um pouco ansioso, mas melhor que ontem.',
      timestamp: '2024-01-25T16:01:15.000Z',
      type: 'text',
    },
  ],
  connectionQuality: {
    video: 'good',
    audio: 'excellent',
    latency: 45,
    bandwidth: 2500,
  },
};

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
  startSession: async (appointmentId: number) => {
    set({ isLoading: true, error: null, connectionStatus: 'connecting' });
    
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock de criação de sessão
      const newSession: VideoSession = {
        id: `session_${Date.now()}`,
        appointmentId,
        roomId: `room_${Date.now()}`,
        startTime: new Date().toISOString(),
        participantIds: [1, appointmentId], // Mock: psychologistId e patientId
        status: 'active',
        recordingEnabled: false,
        chatMessages: [],
        connectionQuality: {
          video: 'excellent',
          audio: 'excellent',
          latency: 30,
          bandwidth: 3000,
        },
      };
      
      set({
        currentSession: newSession,
        connectionStatus: 'connected',
        chatMessages: [],
        connectionQuality: newSession.connectionQuality,
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
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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

  joinSession: async (roomId: string) => {
    set({ isLoading: true, error: null, connectionStatus: 'connecting' });
    
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock de sessão existente
      const existingSession: VideoSession = {
        ...mockVideoSession,
        roomId,
        status: 'active',
      };
      
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

  sendChatMessage: (message: string, senderId: number, senderName: string) => {
    const { chatMessages } = get();
    
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId,
      senderName,
      message,
      timestamp: new Date().toISOString(),
      type: 'text',
    };
    
    set({
      chatMessages: [...chatMessages, newMessage],
    });
    
    // Simular resposta automática (mock)
    if (senderId !== 1) { // Se não for o psicólogo
      setTimeout(() => {
        const responseMessage: ChatMessage = {
          id: `msg_${Date.now() + 1}`,
          senderId: 1,
          senderName: 'Dr. Ana Silva',
          message: 'Entendo. Vamos conversar mais sobre isso.',
          timestamp: new Date().toISOString(),
          type: 'text',
        };
        
        set(state => ({
          chatMessages: [...state.chatMessages, responseMessage],
        }));
      }, 2000);
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

  updateConnectionQuality: (quality: ConnectionQuality) => {
    set({ connectionQuality: quality });
    
    // Atualizar também na sessão atual se existir
    const { currentSession } = get();
    if (currentSession) {
      set({
        currentSession: {
          ...currentSession,
          connectionQuality: quality,
        },
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
