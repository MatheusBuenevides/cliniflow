import type { 
  SessionRecord, 
  SessionRecordCreate, 
  SessionRecordUpdate,
  SessionTag,
  SessionTemplate,
  SessionFilters,
  EvolutionReport,
  SessionAuditLog,
  SessionAttachment
} from '../types';

// Mock data para sessões
const mockSessions: SessionRecord[] = [
  {
    id: 1,
    appointmentId: 1,
    patientId: 1,
    psychologistId: 1,
    sessionNumber: 1,
    date: '2024-01-15',
    duration: 50,
    mainComplaint: 'Ansiedade generalizada e dificuldades no trabalho',
    clinicalObservations: 'Paciente apresentou-se ansiosa, com relato de preocupações excessivas sobre performance no trabalho. Demonstrou boa insight sobre seus padrões de pensamento. Trabalhamos técnicas de respiração e identificação de pensamentos automáticos.',
    therapeuticPlan: 'Continuar com TCC focando em técnicas de relaxamento e reestruturação cognitiva. Próxima sessão: trabalhar com registro de pensamentos.',
    evolution: 'Paciente demonstrou melhora na identificação de gatilhos de ansiedade. Comprometeu-se a praticar exercícios de respiração diariamente.',
    homeworkAssigned: 'Registrar 3 situações de ansiedade durante a semana, anotando pensamentos, emoções e comportamentos.',
    tags: ['ansiedade', 'tcc', 'trabalho'],
    attachments: [],
    isEncrypted: true,
    lastModified: '2024-01-15T16:30:00Z',
    createdAt: '2024-01-15T16:30:00Z',
    updatedAt: '2024-01-15T16:30:00Z'
  },
  {
    id: 2,
    appointmentId: 2,
    patientId: 1,
    psychologistId: 1,
    sessionNumber: 2,
    date: '2024-01-22',
    duration: 50,
    mainComplaint: 'Continuação do tratamento para ansiedade',
    clinicalObservations: 'Paciente trouxe o registro de pensamentos conforme combinado. Identificamos padrões de pensamento catastrófico. Trabalhamos na técnica de questionamento socrático.',
    therapeuticPlan: 'Manter foco em TCC. Introduzir técnicas de mindfulness na próxima sessão.',
    evolution: 'Boa aderência ao tratamento. Paciente relatou redução de 30% na intensidade da ansiedade.',
    homeworkAssigned: 'Praticar questionamento socrático em 2 situações de ansiedade. Iniciar prática de mindfulness 5 min/dia.',
    tags: ['ansiedade', 'tcc', 'mindfulness'],
    attachments: [],
    isEncrypted: true,
    lastModified: '2024-01-22T16:30:00Z',
    createdAt: '2024-01-22T16:30:00Z',
    updatedAt: '2024-01-22T16:30:00Z'
  }
];

const mockTags: SessionTag[] = [
  { id: 1, name: 'ansiedade', color: '#ef4444', psychologistId: 1, usageCount: 15, createdAt: '2024-01-01T00:00:00Z' },
  { id: 2, name: 'depressão', color: '#3b82f6', psychologistId: 1, usageCount: 8, createdAt: '2024-01-01T00:00:00Z' },
  { id: 3, name: 'tcc', color: '#10b981', psychologistId: 1, usageCount: 12, createdAt: '2024-01-01T00:00:00Z' },
  { id: 4, name: 'mindfulness', color: '#8b5cf6', psychologistId: 1, usageCount: 6, createdAt: '2024-01-01T00:00:00Z' },
  { id: 5, name: 'trabalho', color: '#f59e0b', psychologistId: 1, usageCount: 9, createdAt: '2024-01-01T00:00:00Z' },
  { id: 6, name: 'relacionamentos', color: '#ec4899', psychologistId: 1, usageCount: 7, createdAt: '2024-01-01T00:00:00Z' }
];

const mockTemplates: SessionTemplate[] = [
  {
    id: 1,
    name: 'Sessão Inicial',
    description: 'Template para primeira sessão com novo paciente',
    content: {
      mainComplaint: '',
      clinicalObservations: 'Paciente apresentou-se [descrição do estado emocional/comportamental]. Relatou [principais queixas]. Demonstrou [observações sobre insight, motivação, etc.].',
      therapeuticPlan: 'Plano terapêutico: [abordagem escolhida]. Objetivos: [objetivos específicos]. Próximos passos: [ações para próxima sessão].',
      evolution: '',
      homeworkAssigned: '',
      tags: []
    },
    isDefault: true,
    psychologistId: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Sessão TCC',
    description: 'Template para sessões de Terapia Cognitivo-Comportamental',
    content: {
      mainComplaint: '',
      clinicalObservations: 'Paciente trouxe [tarefas de casa]. Trabalhamos com [técnicas utilizadas]. Identificamos [padrões de pensamento/comportamento].',
      therapeuticPlan: 'Continuar com TCC focando em [área específica]. Próxima sessão: [técnicas/objetivos].',
      evolution: 'Paciente demonstrou [mudanças observadas]. Relatou [melhoras/dificuldades].',
      homeworkAssigned: '[Tarefas específicas para casa]',
      tags: ['tcc']
    },
    isDefault: false,
    psychologistId: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Simulação de criptografia (em produção seria real)
const encryptText = (text: string): string => {
  // Simulação de criptografia - em produção usar biblioteca real
  return btoa(text);
};

const decryptText = (encryptedText: string): string => {
  // Simulação de descriptografia - em produção usar biblioteca real
  try {
    return atob(encryptedText);
  } catch {
    return encryptedText; // Se não conseguir descriptografar, retorna o texto original
  }
};

class SessionService {
  // Buscar sessões com filtros
  async getSessions(filters: SessionFilters = {}): Promise<SessionRecord[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simular delay de rede
    
    let filteredSessions = [...mockSessions];
    
    // Aplicar filtros
    if (filters.patientId) {
      filteredSessions = filteredSessions.filter(s => s.patientId === filters.patientId);
    }
    
    if (filters.startDate) {
      filteredSessions = filteredSessions.filter(s => s.date >= filters.startDate!);
    }
    
    if (filters.endDate) {
      filteredSessions = filteredSessions.filter(s => s.date <= filters.endDate!);
    }
    
    if (filters.tags && filters.tags.length > 0) {
      filteredSessions = filteredSessions.filter(s => 
        filters.tags!.some(tag => s.tags.includes(tag))
      );
    }
    
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filteredSessions = filteredSessions.filter(s => 
        s.mainComplaint?.toLowerCase().includes(searchLower) ||
        s.clinicalObservations.toLowerCase().includes(searchLower) ||
        s.therapeuticPlan?.toLowerCase().includes(searchLower) ||
        s.evolution?.toLowerCase().includes(searchLower)
      );
    }
    
    // Ordenação
    const sortBy = filters.sortBy || 'date';
    const sortOrder = filters.sortOrder || 'desc';
    
    filteredSessions.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'sessionNumber':
          aValue = a.sessionNumber;
          bValue = b.sessionNumber;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
    
    return filteredSessions;
  }
  
  // Buscar sessão por ID
  async getSessionById(id: number): Promise<SessionRecord | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const session = mockSessions.find(s => s.id === id);
    if (!session) return null;
    
    // Descriptografar campos sensíveis
    const decryptedSession = {
      ...session,
      clinicalObservations: decryptText(session.clinicalObservations),
      therapeuticPlan: session.therapeuticPlan ? decryptText(session.therapeuticPlan) : undefined,
      evolution: session.evolution ? decryptText(session.evolution) : undefined,
      homeworkAssigned: session.homeworkAssigned ? decryptText(session.homeworkAssigned) : undefined
    };
    
    return decryptedSession;
  }
  
  // Criar nova sessão
  async createSession(data: SessionRecordCreate): Promise<SessionRecord> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newSession: SessionRecord = {
      id: Math.max(...mockSessions.map(s => s.id)) + 1,
      sessionNumber: mockSessions.filter(s => s.patientId === data.patientId).length + 1,
      isEncrypted: true,
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
      // Criptografar campos sensíveis
      clinicalObservations: encryptText(data.clinicalObservations),
      therapeuticPlan: data.therapeuticPlan ? encryptText(data.therapeuticPlan) : undefined,
      evolution: data.evolution ? encryptText(data.evolution) : undefined,
      homeworkAssigned: data.homeworkAssigned ? encryptText(data.homeworkAssigned) : undefined
    };
    
    mockSessions.push(newSession);
    return newSession;
  }
  
  // Atualizar sessão
  async updateSession(id: number, data: SessionRecordUpdate): Promise<SessionRecord> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const sessionIndex = mockSessions.findIndex(s => s.id === id);
    if (sessionIndex === -1) {
      throw new Error('Sessão não encontrada');
    }
    
    const updatedSession: SessionRecord = {
      ...mockSessions[sessionIndex],
      ...data,
      updatedAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      // Criptografar campos sensíveis se foram alterados
      clinicalObservations: data.clinicalObservations ? encryptText(data.clinicalObservations) : mockSessions[sessionIndex].clinicalObservations,
      therapeuticPlan: data.therapeuticPlan ? encryptText(data.therapeuticPlan) : mockSessions[sessionIndex].therapeuticPlan,
      evolution: data.evolution ? encryptText(data.evolution) : mockSessions[sessionIndex].evolution,
      homeworkAssigned: data.homeworkAssigned ? encryptText(data.homeworkAssigned) : mockSessions[sessionIndex].homeworkAssigned
    };
    
    mockSessions[sessionIndex] = updatedSession;
    return updatedSession;
  }
  
  // Deletar sessão
  async deleteSession(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const sessionIndex = mockSessions.findIndex(s => s.id === id);
    if (sessionIndex === -1) {
      throw new Error('Sessão não encontrada');
    }
    
    mockSessions.splice(sessionIndex, 1);
  }
  
  // Buscar tags
  async getTags(): Promise<SessionTag[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockTags];
  }
  
  // Criar nova tag
  async createTag(name: string, color?: string): Promise<SessionTag> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newTag: SessionTag = {
      id: Math.max(...mockTags.map(t => t.id)) + 1,
      name: name.toLowerCase(),
      color: color || '#6b7280',
      psychologistId: 1,
      usageCount: 0,
      createdAt: new Date().toISOString()
    };
    
    mockTags.push(newTag);
    return newTag;
  }
  
  // Buscar templates
  async getTemplates(): Promise<SessionTemplate[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockTemplates];
  }
  
  // Criar template
  async createTemplate(data: Omit<SessionTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<SessionTemplate> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newTemplate: SessionTemplate = {
      id: Math.max(...mockTemplates.map(t => t.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };
    
    mockTemplates.push(newTemplate);
    return newTemplate;
  }
  
  // Gerar relatório de evolução
  async getEvolutionReport(patientId: number, startDate: string, endDate: string): Promise<EvolutionReport> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const patientSessions = mockSessions.filter(s => 
      s.patientId === patientId && 
      s.date >= startDate && 
      s.date <= endDate
    );
    
    // Calcular estatísticas
    const totalSessions = patientSessions.length;
    const averageDuration = patientSessions.reduce((sum, s) => sum + s.duration, 0) / totalSessions;
    
    // Tags mais comuns
    const tagCounts: Record<string, number> = {};
    patientSessions.forEach(session => {
      session.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    const mostCommonTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    return {
      patientId,
      patientName: 'Ana Silva', // Mock - seria buscado do serviço de pacientes
      period: { start: startDate, end: endDate },
      sessions: patientSessions.map(s => ({
        sessionNumber: s.sessionNumber,
        date: s.date,
        mainComplaint: s.mainComplaint,
        evolution: s.evolution,
        tags: s.tags
      })),
      summary: {
        totalSessions,
        averageSessionDuration: Math.round(averageDuration),
        mostCommonTags,
        progressIndicators: ['Redução da ansiedade', 'Melhora na qualidade do sono', 'Aumento da autoestima']
      }
    };
  }
  
  // Log de auditoria
  async logAccess(sessionId: number, action: SessionAuditLog['action'], details?: string): Promise<void> {
    // Em produção, isso seria enviado para o backend
    console.log(`Audit Log: Session ${sessionId}, Action: ${action}, Details: ${details}`);
  }
  
  // Upload de anexo
  async uploadAttachment(sessionId: number, file: File, description?: string): Promise<SessionAttachment> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const attachment: SessionAttachment = {
      id: Math.floor(Math.random() * 10000),
      sessionId,
      fileName: `attachment_${Date.now()}_${file.name}`,
      originalName: file.name,
      fileType: file.type,
      fileSize: file.size,
      description,
      isEncrypted: true,
      uploadedAt: new Date().toISOString()
    };
    
    return attachment;
  }
}

export const sessionService = new SessionService();
