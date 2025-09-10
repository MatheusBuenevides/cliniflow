import React, { useState } from 'react';
import { Search, Download, Eye, RefreshCw, User, MessageSquare, Clock } from 'lucide-react';
import DeliveryStatus from './DeliveryStatus';

interface CommunicationLogEntry {
  id: string;
  type: 'email' | 'sms' | 'whatsapp';
  recipient: {
    name: string;
    email?: string;
    phone?: string;
  };
  subject?: string;
  content: string;
  status: 'scheduled' | 'sent' | 'delivered' | 'read' | 'failed' | 'bounced';
  scheduledFor: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  failedAt?: string;
  errorMessage?: string;
  bounceReason?: string;
  retryCount?: number;
  nextRetryAt?: string;
  providerResponse?: any;
  trackingId?: string;
  openCount?: number;
  clickCount?: number;
  unsubscribeCount?: number;
  trigger?: {
    type: string;
    appointmentId?: number;
    hoursBefore?: number;
  };
  createdAt: string;
}

interface CommunicationLogProps {
  entries: CommunicationLogEntry[];
  onRefresh?: () => Promise<void>;
  onRetry?: (entryId: string) => Promise<void>;
  onExport?: (filters: LogFilters) => Promise<void>;
  isLoading?: boolean;
}

interface LogFilters {
  type: 'all' | 'email' | 'sms' | 'whatsapp';
  status: 'all' | 'scheduled' | 'sent' | 'delivered' | 'read' | 'failed' | 'bounced';
  dateRange: {
    start: string;
    end: string;
  };
  recipient: string;
  search: string;
}

const CommunicationLog: React.FC<CommunicationLogProps> = ({
  entries,
  onRefresh,
  onRetry,
  onExport,
  isLoading = false
}) => {
  const [filters, setFilters] = useState<LogFilters>({
    type: 'all',
    status: 'all',
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias atrás
      end: new Date().toISOString().split('T')[0]
    },
    recipient: '',
    search: ''
  });

  const [selectedEntry, setSelectedEntry] = useState<CommunicationLogEntry | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Filtrar entradas
  const filteredEntries = entries.filter(entry => {
    const matchesType = filters.type === 'all' || entry.type === filters.type;
    const matchesStatus = filters.status === 'all' || entry.status === filters.status;
    const matchesDateRange = entry.scheduledFor >= filters.dateRange.start && 
                           entry.scheduledFor <= filters.dateRange.end + 'T23:59:59';
    const matchesRecipient = !filters.recipient || 
                           entry.recipient.name.toLowerCase().includes(filters.recipient.toLowerCase()) ||
                           entry.recipient.email?.toLowerCase().includes(filters.recipient.toLowerCase());
    const matchesSearch = !filters.search ||
                         entry.subject?.toLowerCase().includes(filters.search.toLowerCase()) ||
                         entry.content.toLowerCase().includes(filters.search.toLowerCase());

    return matchesType && matchesStatus && matchesDateRange && matchesRecipient && matchesSearch;
  });

  // Estatísticas
  const stats = {
    total: filteredEntries.length,
    sent: filteredEntries.filter(e => e.status === 'sent' || e.status === 'delivered' || e.status === 'read').length,
    failed: filteredEntries.filter(e => e.status === 'failed' || e.status === 'bounced').length,
    scheduled: filteredEntries.filter(e => e.status === 'scheduled').length,
    byType: {
      email: filteredEntries.filter(e => e.type === 'email').length,
      sms: filteredEntries.filter(e => e.type === 'sms').length,
      whatsapp: filteredEntries.filter(e => e.type === 'whatsapp').length
    }
  };

  // Refresh
  const handleRefresh = async () => {
    if (!onRefresh) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Erro ao atualizar log:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Export
  const handleExport = async () => {
    if (!onExport) return;
    
    setIsExporting(true);
    try {
      await onExport(filters);
    } catch (error) {
      console.error('Erro ao exportar log:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Retry
  const handleRetry = async (entryId: string) => {
    if (!onRetry) return;
    
    try {
      await onRetry(entryId);
    } catch (error) {
      console.error('Erro ao tentar reenviar:', error);
    }
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obter ícone do tipo
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return '📧';
      case 'sms':
        return '📱';
      case 'whatsapp':
        return '💬';
      default:
        return '📄';
    }
  };

  // Obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'sent':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'read':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'bounced':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Obter texto do status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Agendada';
      case 'sent':
        return 'Enviada';
      case 'delivered':
        return 'Entregue';
      case 'read':
        return 'Lida';
      case 'failed':
        return 'Falhou';
      case 'bounced':
        return 'Retornou';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Log de Comunicação</h2>
          <p className="text-sm text-gray-600">Histórico de todas as mensagens enviadas</p>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          )}
          {onExport && (
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Exportando...' : 'Exportar'}
            </button>
          )}
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Total</span>
          </div>
          <div className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-900">Enviadas</span>
          </div>
          <div className="text-2xl font-bold text-green-900 mt-1">{stats.sent}</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-900">Falharam</span>
          </div>
          <div className="text-2xl font-bold text-red-900 mt-1">{stats.failed}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="font-medium text-yellow-900">Agendadas</span>
          </div>
          <div className="text-2xl font-bold text-yellow-900 mt-1">{stats.scheduled}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Por Tipo</span>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            📧 {stats.byType.email} • 📱 {stats.byType.sms} • 💬 {stats.byType.whatsapp}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
        <h3 className="font-medium text-gray-900">Filtros</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="scheduled">Agendadas</option>
              <option value="sent">Enviadas</option>
              <option value="delivered">Entregues</option>
              <option value="read">Lidas</option>
              <option value="failed">Falharam</option>
              <option value="bounced">Retornaram</option>
            </select>
          </div>

          {/* Data Início */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                dateRange: { ...prev.dateRange, start: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Data Fim */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                dateRange: { ...prev.dateRange, end: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Busca */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Paciente, assunto..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Entradas */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 mx-auto mb-4 text-gray-400 animate-spin" />
            <div className="text-gray-500">Carregando log de comunicação...</div>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <div>Nenhuma mensagem encontrada</div>
            <div className="text-sm">Ajuste os filtros para ver mais resultados</div>
          </div>
        ) : (
          filteredEntries.map(entry => (
            <div key={entry.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getTypeIcon(entry.type)}</span>
                  <div>
                    <div className="font-medium text-gray-900">{entry.recipient.name}</div>
                    <div className="text-sm text-gray-500">
                      {entry.recipient.email || entry.recipient.phone}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                    {getStatusText(entry.status)}
                  </span>
                  <button
                    onClick={() => setSelectedEntry(selectedEntry?.id === entry.id ? null : entry)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-2">
                {entry.subject && <div className="font-medium">{entry.subject}</div>}
                <div>Agendada para: {formatDate(entry.scheduledFor)}</div>
                {entry.trigger && (
                  <div>Trigger: {entry.trigger.type.replace('_', ' ')}</div>
                )}
              </div>

              <div className="text-sm text-gray-500 line-clamp-2">
                {entry.content}
              </div>

              {/* Detalhes Expandidos */}
              {selectedEntry?.id === entry.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <DeliveryStatus
                    messageId={entry.id}
                    type={entry.type}
                    recipient={entry.recipient.name}
                    scheduledFor={entry.scheduledFor}
                    status={entry.status}
                    onRefresh={onRefresh}
                    onRetry={() => handleRetry(entry.id)}
                    details={{
                      sentAt: entry.sentAt,
                      deliveredAt: entry.deliveredAt,
                      readAt: entry.readAt,
                      failedAt: entry.failedAt,
                      errorMessage: entry.errorMessage,
                      bounceReason: entry.bounceReason,
                      retryCount: entry.retryCount,
                      nextRetryAt: entry.nextRetryAt,
                      providerResponse: entry.providerResponse,
                      trackingId: entry.trackingId,
                      openCount: entry.openCount,
                      clickCount: entry.clickCount,
                      unsubscribeCount: entry.unsubscribeCount
                    }}
                    showDetails={true}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Paginação */}
      {filteredEntries.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>
            Mostrando {filteredEntries.length} de {entries.length} mensagens
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
              Anterior
            </button>
            <span>Página 1 de 1</span>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationLog;
