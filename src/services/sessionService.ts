import type { 
  VideoSession, 
  ChatMessage, 
  ConnectionQuality
} from '../types';

// Interface para criação de sessão
export interface CreateSessionRequest {
  appointmentId: number;
  psychologistId: number;
  patientId: number;
  recordingEnabled?: boolean;
  sessionConfig?: {
    allowChat: boolean;
    allowScreenShare: boolean;
    maxParticipants: number;
  };
}

// Interface para entrada na sessão
export interface JoinSessionRequest {
  roomId: string;
  participantId: number;
  participantType: 'psychologist' | 'patient';
  token?: string;
}

// Interface para configurações de sessão
export interface SessionConfig {
  allowChat: boolean;
  allowScreenShare: boolean;
  allowRecording: boolean;
  maxParticipants: number;
  sessionDuration: number; // em minutos
  autoEndAfterInactivity: number; // em minutos
}

// Interface para teste de equipamentos
export interface EquipmentTest {
  microphone: {
    working: boolean;
    level: number; // 0-100
    error?: string;
  };
  camera: {
    working: boolean;
    resolution: string;
    error?: string;
  };
  internet: {
    speed: number; // em Mbps
    latency: number; // em ms
    stability: 'excellent' | 'good' | 'fair' | 'poor';
  };
}

// Interface para transcrição
export interface TranscriptionSegment {
  id: string;
  speaker: 'psychologist' | 'patient';
  text: string;
  timestamp: number; // em segundos
  confidence: number; // 0-1
}

// Interface para relatório de sessão
export interface SessionReport {
  sessionId: string;
  appointmentId: number;
  duration: number; // em minutos
  participants: {
    psychologist: {
      id: number;
      name: string;
      joinTime: string;
      leaveTime?: string;
    };
    patient: {
      id: number;
      name: string;
      joinTime: string;
      leaveTime?: string;
    };
  };
  quality: {
    averageConnectionQuality: ConnectionQuality;
    disconnections: number;
    reconnections: number;
  };
  chat: {
    totalMessages: number;
    psychologistMessages: number;
    patientMessages: number;
  };
  recording?: {
    enabled: boolean;
    duration: number;
    fileSize: number;
    url?: string;
  };
  transcription?: {
    enabled: boolean;
    segments: TranscriptionSegment[];
    accuracy: number;
  };
}

class SessionService {
  private sessions: Map<string, VideoSession> = new Map();
  private activeSessions: Set<string> = new Set();

  // Criar nova sessão de telepsicologia
  async createSession(request: CreateSessionRequest): Promise<VideoSession> {
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1500));

      const sessionId = `session_${Date.now()}_${request.appointmentId}`;
      const roomId = `room_${Date.now()}_${request.appointmentId}`;

      const newSession: VideoSession = {
        id: sessionId,
        appointmentId: request.appointmentId,
        roomId,
        startTime: new Date().toISOString(),
        participantIds: [request.psychologistId, request.patientId],
        status: 'waiting',
        recordingEnabled: request.recordingEnabled || false,
        chatMessages: [],
        connectionQuality: {
          video: 'excellent',
          audio: 'excellent',
          latency: 30,
          bandwidth: 3000,
        },
      };

      // Armazenar sessão
      this.sessions.set(sessionId, newSession);
      this.activeSessions.add(sessionId);

      // Simular criação de sala no servidor WebRTC
      await this.createWebRTCRoom(roomId);

      return newSession;
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
      throw new Error('Falha ao criar sessão de telepsicologia');
    }
  }

  // Entrar em sessão existente
  async joinSession(request: JoinSessionRequest): Promise<VideoSession> {
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Buscar sessão existente
      const session = Array.from(this.sessions.values())
        .find(s => s.roomId === request.roomId);

      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      // Verificar se a sessão ainda está ativa
      if (session.status === 'ended' || session.status === 'cancelled') {
        throw new Error('Sessão já foi finalizada');
      }

      // Validar token se fornecido
      if (request.token && !this.validateSessionToken(request.token)) {
        throw new Error('Token de acesso inválido');
      }

      // Atualizar status se necessário
      if (session.status === 'waiting') {
        session.status = 'active';
      }

      return session;
    } catch (error) {
      console.error('Erro ao entrar na sessão:', error);
      throw new Error('Falha ao entrar na sessão');
    }
  }

  // Finalizar sessão
  async endSession(sessionId: string): Promise<void> {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Atualizar status
      session.status = 'ended';
      session.endTime = new Date().toISOString();

      // Remover da lista de sessões ativas
      this.activeSessions.delete(sessionId);

      // Simular finalização no servidor WebRTC
      await this.endWebRTCRoom(session.roomId);

      // Gerar relatório da sessão
      await this.generateSessionReport(sessionId);
    } catch (error) {
      console.error('Erro ao finalizar sessão:', error);
      throw new Error('Falha ao finalizar sessão');
    }
  }

  // Obter sessão por ID
  async getSession(sessionId: string): Promise<VideoSession | null> {
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 500));

      return this.sessions.get(sessionId) || null;
    } catch (error) {
      console.error('Erro ao buscar sessão:', error);
      return null;
    }
  }

  // Obter sessão por appointmentId
  async getSessionByAppointment(appointmentId: number): Promise<VideoSession | null> {
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 500));

      return Array.from(this.sessions.values())
        .find(s => s.appointmentId === appointmentId) || null;
    } catch (error) {
      console.error('Erro ao buscar sessão por agendamento:', error);
      return null;
    }
  }

  // Enviar mensagem no chat
  async sendChatMessage(
    sessionId: string, 
    message: string, 
    senderId: number, 
    senderName: string
  ): Promise<ChatMessage> {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      const newMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        senderId,
        senderName,
        message,
        timestamp: new Date().toISOString(),
        type: 'text',
      };

      // Adicionar mensagem à sessão
      if (!session.chatMessages) {
        session.chatMessages = [];
      }
      session.chatMessages.push(newMessage);

      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 200));

      return newMessage;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw new Error('Falha ao enviar mensagem');
    }
  }

  // Atualizar qualidade da conexão
  async updateConnectionQuality(
    sessionId: string, 
    quality: ConnectionQuality
  ): Promise<void> {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      session.connectionQuality = quality;

      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Erro ao atualizar qualidade da conexão:', error);
    }
  }

  // Testar equipamentos antes da sessão
  async testEquipment(): Promise<EquipmentTest> {
    try {
      // Simular delay do teste
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock de teste de equipamentos
      return {
        microphone: {
          working: true,
          level: 75,
        },
        camera: {
          working: true,
          resolution: '1920x1080',
        },
        internet: {
          speed: 25.5,
          latency: 45,
          stability: 'excellent',
        },
      };
    } catch (error) {
      console.error('Erro ao testar equipamentos:', error);
      throw new Error('Falha ao testar equipamentos');
    }
  }

  // Iniciar gravação da sessão
  async startRecording(sessionId: string): Promise<void> {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));

      session.recordingEnabled = true;
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      throw new Error('Falha ao iniciar gravação');
    }
  }

  // Parar gravação da sessão
  async stopRecording(sessionId: string): Promise<string> {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 2000));

      session.recordingEnabled = false;

      // Retornar URL do arquivo de gravação
      return `https://storage.cliniflow.com/recordings/${sessionId}.mp4`;
    } catch (error) {
      console.error('Erro ao parar gravação:', error);
      throw new Error('Falha ao parar gravação');
    }
  }

  // Obter relatório da sessão
  async getSessionReport(sessionId: string): Promise<SessionReport> {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const duration = session.endTime && session.startTime
        ? Math.floor((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 60000)
        : 0;

      return {
        sessionId,
        appointmentId: session.appointmentId,
        duration,
        participants: {
          psychologist: {
            id: session.participantIds[0],
            name: 'Dr. Ana Silva',
            joinTime: session.startTime || new Date().toISOString(),
            leaveTime: session.endTime,
          },
          patient: {
            id: session.participantIds[1],
            name: 'Paciente',
            joinTime: session.startTime || new Date().toISOString(),
            leaveTime: session.endTime,
          },
        },
        quality: {
          averageConnectionQuality: session.connectionQuality || {
            video: 'good',
            audio: 'good',
            latency: 50,
            bandwidth: 2000,
          },
          disconnections: 0,
          reconnections: 0,
        },
        chat: {
          totalMessages: session.chatMessages?.length || 0,
          psychologistMessages: session.chatMessages?.filter(m => m.senderId === session.participantIds[0]).length || 0,
          patientMessages: session.chatMessages?.filter(m => m.senderId === session.participantIds[1]).length || 0,
        },
        recording: session.recordingEnabled ? {
          enabled: true,
          duration,
          fileSize: duration * 10, // Mock: 10MB por minuto
        } : undefined,
      };
    } catch (error) {
      console.error('Erro ao obter relatório da sessão:', error);
      throw new Error('Falha ao obter relatório da sessão');
    }
  }

  // Métodos privados para simulação

  private async createWebRTCRoom(roomId: string): Promise<void> {
    // Simular criação de sala no servidor WebRTC
    console.log(`Criando sala WebRTC: ${roomId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  private async endWebRTCRoom(roomId: string): Promise<void> {
    // Simular finalização de sala no servidor WebRTC
    console.log(`Finalizando sala WebRTC: ${roomId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  private validateSessionToken(token: string): boolean {
    // Simular validação de token
    return token.length > 10;
  }

  private async generateSessionReport(sessionId: string): Promise<void> {
    // Simular geração de relatório
    console.log(`Gerando relatório para sessão: ${sessionId}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Obter sessões ativas
  getActiveSessions(): VideoSession[] {
    return Array.from(this.sessions.values())
      .filter(s => this.activeSessions.has(s.id));
  }

  // Limpar sessões antigas
  cleanupOldSessions(): void {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.endTime && new Date(session.endTime) < oneHourAgo) {
        this.sessions.delete(sessionId);
        this.activeSessions.delete(sessionId);
      }
    }
  }
}

// Instância singleton do serviço
export const sessionService = new SessionService();

// Limpar sessões antigas a cada 30 minutos
setInterval(() => {
  sessionService.cleanupOldSessions();
}, 30 * 60 * 1000);