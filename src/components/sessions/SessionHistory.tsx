import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Tag, 
  Search, 
  Filter, 
  FileText,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit,
  Trash2,
  Download
} from 'lucide-react';
import { useSessionStore } from '../../stores/useSessionStore';
import { TagSelector } from './TagSelector';
import { EncryptionIndicator } from './EncryptionIndicator';
import type { SessionRecord, SessionFilters } from '../../types';

interface SessionHistoryProps {
  patientId: number;
  onSessionSelect?: (session: SessionRecord) => void;
  onSessionEdit?: (session: SessionRecord) => void;
  onSessionDelete?: (sessionId: number) => void;
  className?: string;
}

const SessionHistory: React.FC<SessionHistoryProps> = ({
  patientId,
  onSessionSelect,
  onSessionEdit,
  onSessionDelete,
  className = ''
}) => {
  const {
    sessions,
    sessionsLoading,
    sessionsError,
    tags,
    activeFilters,
    fetchSessions,
    setFilters,
    clearFilters,
    deleteSession
  } = useSessionStore();

  const [searchText, setSearchText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'sessionNumber'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedSessions, setExpandedSessions] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Carregar sessões quando o componente monta ou os filtros mudam
  useEffect(() => {
    const filters: SessionFilters = {
      patientId,
      searchText: searchText || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      sortBy,
      sortOrder
    };
    
    fetchSessions(filters);
  }, [patientId, searchText, selectedTags, sortBy, sortOrder, fetchSessions]);

  const handleSessionClick = (session: SessionRecord) => {
    onSessionSelect?.(session);
  };

  const handleSessionEdit = (session: SessionRecord) => {
    onSessionEdit?.(session);
  };

  const handleSessionDelete = async (sessionId: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta sessão? Esta ação não pode ser desfeita.')) {
      try {
        await deleteSession(sessionId);
        onSessionDelete?.(sessionId);
      } catch (error) {
        console.error('Erro ao excluir sessão:', error);
      }
    }
  };

  const toggleSessionExpansion = (sessionId: number) => {
    const newExpanded = new Set(expandedSessions);
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId);
    } else {
      newExpanded.add(sessionId);
    }
    setExpandedSessions(newExpanded);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const clearAllFilters = () => {
    setSearchText('');
    setSelectedTags([]);
    setSortBy('date');
    setSortOrder('desc');
    clearFilters();
  };

  const hasActiveFilters = searchText || selectedTags.length > 0;

  if (sessionsLoading) {
    return (
      <div className={`bg-white rounded-lg border border-slate-200 p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-slate-600">Carregando sessões...</span>
        </div>
      </div>
    );
  }

  if (sessionsError) {
    return (
      <div className={`bg-white rounded-lg border border-slate-200 p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="text-red-600 mb-2">Erro ao carregar sessões</div>
          <p className="text-slate-600 text-sm">{sessionsError}</p>
          <button
            onClick={() => fetchSessions({ patientId })}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-slate-200 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">
            Histórico de Sessões ({sessions.length})
          </h3>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Filtros */}
        {showFilters && (
          <div className="mt-4 space-y-4 p-4 bg-slate-50 rounded-lg">
            {/* Busca por texto */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Buscar nas sessões
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Buscar por queixa, observações, plano..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            {/* Filtro por tags */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Filtrar por tags
              </label>
              <TagSelector
                selectedTags={selectedTags}
                availableTags={tags.map(t => t.name)}
                onChange={setSelectedTags}
                maxTags={5}
              />
            </div>

            {/* Ordenação */}
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ordenar por
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'sessionNumber')}
                  className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="date">Data</option>
                  <option value="sessionNumber">Número da Sessão</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ordem
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="desc">Mais recente</option>
                  <option value="asc">Mais antigo</option>
                </select>
              </div>
            </div>

            {/* Limpar filtros */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
              >
                Limpar filtros
              </button>
            )}
          </div>
        )}
      </div>

      {/* Lista de sessões */}
      <div className="divide-y divide-slate-200">
        {sessions.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-slate-600 mb-2">
              Nenhuma sessão encontrada
            </h4>
            <p className="text-slate-500">
              {hasActiveFilters 
                ? 'Tente ajustar os filtros para encontrar sessões.'
                : 'Este paciente ainda não possui sessões registradas.'
              }
            </p>
          </div>
        ) : (
          sessions.map((session) => (
            <div key={session.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header da sessão */}
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold text-slate-800">
                        Sessão #{session.sessionNumber}
                      </span>
                      <EncryptionIndicator 
                        isEncrypted={session.isEncrypted}
                        status="encrypted"
                        showTooltip={false}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(session.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(session.duration)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Queixa principal */}
                  {session.mainComplaint && (
                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-slate-700 mb-1">Queixa Principal</h5>
                      <p className="text-sm text-slate-600">
                        {truncateText(session.mainComplaint, 150)}
                      </p>
                    </div>
                  )}

                  {/* Observações clínicas */}
                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-slate-700 mb-1">Observações Clínicas</h5>
                    <p className="text-sm text-slate-600">
                      {truncateText(session.clinicalObservations, 200)}
                    </p>
                  </div>

                  {/* Tags */}
                  {session.tags.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center space-x-2">
                        <Tag className="h-4 w-4 text-slate-500" />
                        <div className="flex flex-wrap gap-1">
                          {session.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Conteúdo expandido */}
                  {expandedSessions.has(session.id) && (
                    <div className="mt-4 space-y-3 p-4 bg-slate-50 rounded-lg">
                      {session.therapeuticPlan && (
                        <div>
                          <h6 className="text-sm font-medium text-slate-700 mb-1">Plano Terapêutico</h6>
                          <p className="text-sm text-slate-600">{session.therapeuticPlan}</p>
                        </div>
                      )}
                      
                      {session.evolution && (
                        <div>
                          <h6 className="text-sm font-medium text-slate-700 mb-1">Evolução</h6>
                          <p className="text-sm text-slate-600">{session.evolution}</p>
                        </div>
                      )}
                      
                      {session.homeworkAssigned && (
                        <div>
                          <h6 className="text-sm font-medium text-slate-700 mb-1">Tarefas de Casa</h6>
                          <p className="text-sm text-slate-600">{session.homeworkAssigned}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => toggleSessionExpansion(session.id)}
                    className="p-2 text-slate-500 hover:text-slate-700 transition-colors"
                    title={expandedSessions.has(session.id) ? 'Recolher' : 'Expandir'}
                  >
                    {expandedSessions.has(session.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleSessionClick(session)}
                    className="p-2 text-slate-500 hover:text-slate-700 transition-colors"
                    title="Visualizar"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleSessionEdit(session)}
                    className="p-2 text-slate-500 hover:text-slate-700 transition-colors"
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleSessionDelete(session.id)}
                    className="p-2 text-slate-500 hover:text-red-600 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SessionHistory;
