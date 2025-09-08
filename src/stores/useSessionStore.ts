import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  SessionRecord, 
  SessionRecordCreate, 
  SessionRecordUpdate,
  SessionTag,
  SessionTemplate,
  SessionFilters,
  EvolutionReport,
  SessionAttachment,
  SessionEditorState
} from '../types';
import { sessionService } from '../services/sessionService';

interface SessionStore {
  // Estado das sessões
  sessions: SessionRecord[];
  currentSession: SessionRecord | null;
  sessionsLoading: boolean;
  sessionsError: string | null;
  
  // Estado das tags
  tags: SessionTag[];
  tagsLoading: boolean;
  
  // Estado dos templates
  templates: SessionTemplate[];
  templatesLoading: boolean;
  
  // Estado do editor
  editorState: SessionEditorState;
  
  // Filtros ativos
  activeFilters: SessionFilters;
  
  // Ações das sessões
  fetchSessions: (filters?: SessionFilters) => Promise<void>;
  getSessionById: (id: number) => Promise<SessionRecord | null>;
  createSession: (data: SessionRecordCreate) => Promise<SessionRecord>;
  updateSession: (id: number, data: SessionRecordUpdate) => Promise<SessionRecord>;
  deleteSession: (id: number) => Promise<void>;
  setCurrentSession: (session: SessionRecord | null) => void;
  
  // Ações das tags
  fetchTags: () => Promise<void>;
  createTag: (name: string, color?: string) => Promise<SessionTag>;
  
  // Ações dos templates
  fetchTemplates: () => Promise<void>;
  createTemplate: (data: Omit<SessionTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<SessionTemplate>;
  
  // Ações do editor
  setEditorState: (state: Partial<SessionEditorState>) => void;
  startEditing: () => void;
  stopEditing: () => void;
  saveSession: (data: SessionRecordUpdate) => Promise<void>;
  autoSave: (data: SessionRecordUpdate) => Promise<void>;
  
  // Ações de filtros
  setFilters: (filters: SessionFilters) => void;
  clearFilters: () => void;
  
  // Ações de relatórios
  getEvolutionReport: (patientId: number, startDate: string, endDate: string) => Promise<EvolutionReport>;
  
  // Ações de anexos
  uploadAttachment: (sessionId: number, file: File, description?: string) => Promise<SessionAttachment>;
  
  // Utilitários
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  sessions: [],
  currentSession: null,
  sessionsLoading: false,
  sessionsError: null,
  tags: [],
  tagsLoading: false,
  templates: [],
  templatesLoading: false,
  editorState: {
    isEditing: false,
    isSaving: false,
    hasUnsavedChanges: false,
    autoSaveEnabled: true,
    encryptionStatus: 'encrypted' as const
  },
  activeFilters: {}
};

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Ações das sessões
      fetchSessions: async (filters = {}) => {
        set({ sessionsLoading: true, sessionsError: null });
        try {
          const sessions = await sessionService.getSessions(filters);
          set({ sessions, sessionsLoading: false });
        } catch (error) {
          set({ 
            sessionsError: error instanceof Error ? error.message : 'Erro ao carregar sessões',
            sessionsLoading: false 
          });
        }
      },
      
      getSessionById: async (id: number) => {
        try {
          const session = await sessionService.getSessionById(id);
          if (session) {
            set({ currentSession: session });
          }
          return session;
        } catch (error) {
          set({ 
            sessionsError: error instanceof Error ? error.message : 'Erro ao carregar sessão'
          });
          return null;
        }
      },
      
      createSession: async (data: SessionRecordCreate) => {
        set({ sessionsLoading: true, sessionsError: null });
        try {
          const newSession = await sessionService.createSession(data);
          set(state => ({ 
            sessions: [newSession, ...state.sessions],
            sessionsLoading: false 
          }));
          return newSession;
        } catch (error) {
          set({ 
            sessionsError: error instanceof Error ? error.message : 'Erro ao criar sessão',
            sessionsLoading: false 
          });
          throw error;
        }
      },
      
      updateSession: async (id: number, data: SessionRecordUpdate) => {
        set({ sessionsLoading: true, sessionsError: null });
        try {
          const updatedSession = await sessionService.updateSession(id, data);
          set(state => ({
            sessions: state.sessions.map(s => s.id === id ? updatedSession : s),
            currentSession: state.currentSession?.id === id ? updatedSession : state.currentSession,
            sessionsLoading: false
          }));
          return updatedSession;
        } catch (error) {
          set({ 
            sessionsError: error instanceof Error ? error.message : 'Erro ao atualizar sessão',
            sessionsLoading: false 
          });
          throw error;
        }
      },
      
      deleteSession: async (id: number) => {
        set({ sessionsLoading: true, sessionsError: null });
        try {
          await sessionService.deleteSession(id);
          set(state => ({
            sessions: state.sessions.filter(s => s.id !== id),
            currentSession: state.currentSession?.id === id ? null : state.currentSession,
            sessionsLoading: false
          }));
        } catch (error) {
          set({ 
            sessionsError: error instanceof Error ? error.message : 'Erro ao deletar sessão',
            sessionsLoading: false 
          });
          throw error;
        }
      },
      
      setCurrentSession: (session: SessionRecord | null) => {
        set({ currentSession: session });
      },
      
      // Ações das tags
      fetchTags: async () => {
        set({ tagsLoading: true });
        try {
          const tags = await sessionService.getTags();
          set({ tags, tagsLoading: false });
        } catch (error) {
          set({ tagsLoading: false });
        }
      },
      
      createTag: async (name: string, color?: string) => {
        try {
          const newTag = await sessionService.createTag(name, color);
          set(state => ({ tags: [...state.tags, newTag] }));
          return newTag;
        } catch (error) {
          throw error;
        }
      },
      
      // Ações dos templates
      fetchTemplates: async () => {
        set({ templatesLoading: true });
        try {
          const templates = await sessionService.getTemplates();
          set({ templates, templatesLoading: false });
        } catch (error) {
          set({ templatesLoading: false });
        }
      },
      
      createTemplate: async (data: Omit<SessionTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
          const newTemplate = await sessionService.createTemplate(data);
          set(state => ({ templates: [...state.templates, newTemplate] }));
          return newTemplate;
        } catch (error) {
          throw error;
        }
      },
      
      // Ações do editor
      setEditorState: (state: Partial<SessionEditorState>) => {
        set(currentState => ({
          editorState: { ...currentState.editorState, ...state }
        }));
      },
      
      startEditing: () => {
        set(state => ({
          editorState: { 
            ...state.editorState, 
            isEditing: true,
            hasUnsavedChanges: false
          }
        }));
      },
      
      stopEditing: () => {
        set(state => ({
          editorState: { 
            ...state.editorState, 
            isEditing: false,
            hasUnsavedChanges: false
          }
        }));
      },
      
      saveSession: async (data: SessionRecordUpdate) => {
        const { currentSession } = get();
        if (!currentSession) return;
        
        set(state => ({
          editorState: { 
            ...state.editorState, 
            isSaving: true 
          }
        }));
        
        try {
          await get().updateSession(currentSession.id, data);
          set(state => ({
            editorState: { 
              ...state.editorState, 
              isSaving: false,
              hasUnsavedChanges: false,
              lastSaved: new Date().toISOString()
            }
          }));
        } catch (error) {
          set(state => ({
            editorState: { 
              ...state.editorState, 
              isSaving: false 
            }
          }));
          throw error;
        }
      },
      
      autoSave: async (data: SessionRecordUpdate) => {
        const { editorState, currentSession } = get();
        if (!editorState.autoSaveEnabled || !currentSession) return;
        
        try {
          await get().updateSession(currentSession.id, data);
          set(state => ({
            editorState: { 
              ...state.editorState, 
              lastSaved: new Date().toISOString()
            }
          }));
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      },
      
      // Ações de filtros
      setFilters: (filters: SessionFilters) => {
        set({ activeFilters: filters });
        get().fetchSessions(filters);
      },
      
      clearFilters: () => {
        set({ activeFilters: {} });
        get().fetchSessions();
      },
      
      // Ações de relatórios
      getEvolutionReport: async (patientId: number, startDate: string, endDate: string) => {
        try {
          return await sessionService.getEvolutionReport(patientId, startDate, endDate);
        } catch (error) {
          throw error;
        }
      },
      
      // Ações de anexos
      uploadAttachment: async (sessionId: number, file: File, description?: string) => {
        try {
          return await sessionService.uploadAttachment(sessionId, file, description);
        } catch (error) {
          throw error;
        }
      },
      
      // Utilitários
      clearError: () => {
        set({ sessionsError: null });
      },
      
      reset: () => {
        set(initialState);
      }
    }),
    {
      name: 'session-store',
      partialize: (state) => ({
        tags: state.tags,
        templates: state.templates,
        editorState: {
          autoSaveEnabled: state.editorState.autoSaveEnabled
        }
      })
    }
  )
);
