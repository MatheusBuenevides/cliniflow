import React, { useState, useEffect, useCallback } from 'react';
import { 
  Save, 
  Lock, 
  Unlock, 
  FileText, 
  Tag, 
  Paperclip, 
  Clock,
  User,
  Calendar,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useSessionStore } from '../../stores/useSessionStore';
import { TagSelector } from './TagSelector';
import { AttachmentUploader } from './AttachmentUploader';
import { EncryptionIndicator } from './EncryptionIndicator';
import type { SessionRecord, SessionRecordUpdate } from '../../types';

interface SessionEditorProps {
  session: SessionRecord;
  onSave?: (session: SessionRecord) => void;
  onCancel?: () => void;
  className?: string;
}

const SessionEditor: React.FC<SessionEditorProps> = ({
  session,
  onSave,
  onCancel,
  className = ''
}) => {
  const {
    editorState,
    setEditorState,
    startEditing,
    stopEditing,
    saveSession,
    autoSave,
    tags
  } = useSessionStore();

  const [formData, setFormData] = useState({
    mainComplaint: session.mainComplaint || '',
    clinicalObservations: session.clinicalObservations || '',
    therapeuticPlan: session.therapeuticPlan || '',
    evolution: session.evolution || '',
    homeworkAssigned: session.homeworkAssigned || '',
    tags: session.tags || []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-save com debounce
  const debouncedAutoSave = useCallback(
    debounce((data: SessionRecordUpdate) => {
      if (editorState.autoSaveEnabled && editorState.isEditing) {
        autoSave(data);
      }
    }, 2000),
    [editorState.autoSaveEnabled, editorState.isEditing, autoSave]
  );

  // Detectar mudanças
  useEffect(() => {
    const hasChanges = 
      formData.mainComplaint !== (session.mainComplaint || '') ||
      formData.clinicalObservations !== (session.clinicalObservations || '') ||
      formData.therapeuticPlan !== (session.therapeuticPlan || '') ||
      formData.evolution !== (session.evolution || '') ||
      formData.homeworkAssigned !== (session.homeworkAssigned || '') ||
      JSON.stringify(formData.tags) !== JSON.stringify(session.tags || []);

    setEditorState({ hasUnsavedChanges: hasChanges });

    if (hasChanges && editorState.isEditing) {
      debouncedAutoSave(formData);
    }
  }, [formData, session, editorState.isEditing, debouncedAutoSave, setEditorState]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTagsChange = (newTags: string[]) => {
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.clinicalObservations.trim()) {
      newErrors.clinicalObservations = 'Observações clínicas são obrigatórias';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await saveSession(formData);
      onSave?.(session);
    } catch (error) {
      console.error('Erro ao salvar sessão:', error);
    }
  };

  const handleStartEditing = () => {
    startEditing();
  };

  const handleStopEditing = () => {
    if (editorState.hasUnsavedChanges) {
      const confirmed = window.confirm(
        'Você tem alterações não salvas. Deseja realmente cancelar?'
      );
      if (!confirmed) return;
    }
    
    stopEditing();
    onCancel?.();
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  return (
    <div className={`bg-white rounded-lg border border-slate-200 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-slate-600" />
              <h2 className="text-lg font-semibold text-slate-800">
                Sessão #{session.sessionNumber}
              </h2>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <Calendar className="h-4 w-4" />
              <span>{new Date(session.date).toLocaleDateString('pt-BR')}</span>
              <Clock className="h-4 w-4 ml-2" />
              <span>{formatDuration(session.duration)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <EncryptionIndicator 
              isEncrypted={session.isEncrypted}
              status={editorState.encryptionStatus}
            />
            
            {editorState.isEditing ? (
              <div className="flex items-center space-x-2">
                {editorState.isSaving ? (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Salvando...</span>
                  </div>
                ) : editorState.lastSaved ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">
                      Salvo {new Date(editorState.lastSaved).toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                ) : null}
                
                <button
                  onClick={handleSave}
                  disabled={editorState.isSaving}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Salvar</span>
                </button>
                
                <button
                  onClick={handleStopEditing}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={handleStartEditing}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <Unlock className="h-4 w-4" />
                <span>Editar</span>
              </button>
            )}
          </div>
        </div>

        {/* Status de alterações não salvas */}
        {editorState.hasUnsavedChanges && (
          <div className="mt-3 flex items-center space-x-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-md">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Você tem alterações não salvas</span>
          </div>
        )}
      </div>

      {/* Formulário */}
      <div className="p-6 space-y-6">
        {/* Queixa Principal */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Queixa Principal
          </label>
          <textarea
            value={formData.mainComplaint}
            onChange={(e) => handleInputChange('mainComplaint', e.target.value)}
            disabled={!editorState.isEditing}
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 disabled:bg-slate-50 disabled:text-slate-500"
            placeholder="Descreva a queixa principal do paciente..."
          />
        </div>

        {/* Observações Clínicas */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Observações Clínicas <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.clinicalObservations}
            onChange={(e) => handleInputChange('clinicalObservations', e.target.value)}
            disabled={!editorState.isEditing}
            rows={6}
            className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 disabled:bg-slate-50 disabled:text-slate-500 ${
              errors.clinicalObservations ? 'border-red-300' : 'border-slate-300'
            }`}
            placeholder="Descreva as observações clínicas da sessão..."
          />
          {errors.clinicalObservations && (
            <p className="mt-1 text-sm text-red-600">{errors.clinicalObservations}</p>
          )}
        </div>

        {/* Plano Terapêutico */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Plano Terapêutico
          </label>
          <textarea
            value={formData.therapeuticPlan}
            onChange={(e) => handleInputChange('therapeuticPlan', e.target.value)}
            disabled={!editorState.isEditing}
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 disabled:bg-slate-50 disabled:text-slate-500"
            placeholder="Descreva o plano terapêutico para esta sessão..."
          />
        </div>

        {/* Evolução */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Evolução
          </label>
          <textarea
            value={formData.evolution}
            onChange={(e) => handleInputChange('evolution', e.target.value)}
            disabled={!editorState.isEditing}
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 disabled:bg-slate-50 disabled:text-slate-500"
            placeholder="Descreva a evolução do paciente..."
          />
        </div>

        {/* Tarefas de Casa */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tarefas de Casa
          </label>
          <textarea
            value={formData.homeworkAssigned}
            onChange={(e) => handleInputChange('homeworkAssigned', e.target.value)}
            disabled={!editorState.isEditing}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 disabled:bg-slate-50 disabled:text-slate-500"
            placeholder="Descreva as tarefas de casa atribuídas..."
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Tag className="h-4 w-4 inline mr-1" />
            Tags
          </label>
          <TagSelector
            selectedTags={formData.tags}
            availableTags={tags.map(t => t.name)}
            onChange={handleTagsChange}
            disabled={!editorState.isEditing}
          />
        </div>

        {/* Anexos */}
        {editorState.isEditing && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Paperclip className="h-4 w-4 inline mr-1" />
              Anexos
            </label>
            <AttachmentUploader
              sessionId={session.id}
              attachments={session.attachments || []}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Função debounce
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default SessionEditor;
