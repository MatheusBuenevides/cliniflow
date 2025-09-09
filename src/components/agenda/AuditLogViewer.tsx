import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Globe,
  Calendar,
  Activity
} from 'lucide-react';
import { FormInput } from '../ui';
import { auditService } from '../../services/auditService';
import type { AuditLog, SecurityAlert, AuditAction, AuditResource } from '../../services/auditService';

interface AuditLogViewerProps {
  className?: string;
}

interface FilterState {
  action?: AuditAction;
  resource?: AuditResource;
  userId?: string;
  startDate?: string;
  endDate?: string;
  success?: boolean;
}

const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ className = '' }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [stats, setStats] = useState<any>(null);

  const [filters, setFilters] = useState<FilterState>({});
  const [searchTerm, setSearchTerm] = useState('');

  const auditActions: AuditAction[] = [
    'payment_created',
    'payment_processed',
    'payment_failed',
    'payment_cancelled',
    'payment_refunded',
    'payment_status_checked',
    'payment_link_created',
    'payment_link_updated',
    'payment_link_deleted',
    'payment_link_accessed',
    'refund_requested',
    'refund_processed',
    'refund_failed',
    'webhook_received',
    'webhook_processed',
    'webhook_failed',
    'gateway_config_updated',
    'security_alert',
    'suspicious_activity'
  ];

  const auditResources: AuditResource[] = [
    'payment',
    'payment_link',
    'refund',
    'webhook',
    'gateway',
    'security',
    'user'
  ];

  const severityColors = {
    low: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    high: 'text-orange-600 bg-orange-100',
    critical: 'text-red-600 bg-red-100'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionIcon = (action: AuditAction) => {
    switch (action) {
      case 'payment_created':
      case 'payment_processed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'payment_failed':
      case 'payment_cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'payment_refunded':
      case 'refund_processed':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'security_alert':
      case 'suspicious_activity':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return <Activity className="h-4 w-4 text-slate-600" />;
    }
  };

  const getActionLabel = (action: AuditAction) => {
    const labels: Record<AuditAction, string> = {
      payment_created: 'Pagamento Criado',
      payment_processed: 'Pagamento Processado',
      payment_failed: 'Pagamento Falhou',
      payment_cancelled: 'Pagamento Cancelado',
      payment_refunded: 'Pagamento Estornado',
      payment_status_checked: 'Status Verificado',
      payment_link_created: 'Link Criado',
      payment_link_updated: 'Link Atualizado',
      payment_link_deleted: 'Link Excluído',
      payment_link_accessed: 'Link Acessado',
      refund_requested: 'Estorno Solicitado',
      refund_processed: 'Estorno Processado',
      refund_failed: 'Estorno Falhou',
      webhook_received: 'Webhook Recebido',
      webhook_processed: 'Webhook Processado',
      webhook_failed: 'Webhook Falhou',
      gateway_config_updated: 'Config Atualizada',
      security_alert: 'Alerta de Segurança',
      suspicious_activity: 'Atividade Suspeita'
    };
    return labels[action] || action;
  };

  const getResourceLabel = (resource: AuditResource) => {
    const labels: Record<AuditResource, string> = {
      payment: 'Pagamento',
      payment_link: 'Link de Pagamento',
      refund: 'Estorno',
      webhook: 'Webhook',
      gateway: 'Gateway',
      security: 'Segurança',
      user: 'Usuário'
    };
    return labels[resource] || resource;
  };

  const loadLogs = async () => {
    setLoading(true);
    try {
      const [logsData, alertsData, statsData] = await Promise.all([
        auditService.getAuditLogs(filters),
        auditService.getSecurityAlerts({ resolved: false }),
        auditService.getAuditStats('day')
      ]);

      setLogs(logsData);
      setAlerts(alertsData);
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Action', 'Resource', 'Resource ID', 'User ID', 'IP Address', 'Success', 'Error Message'],
      ...logs.map(log => [
        log.timestamp,
        log.action,
        log.resource,
        log.resourceId,
        log.userId || '',
        log.ipAddress || '',
        log.success ? 'Sim' : 'Não',
        log.errorMessage || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadLogs();
  }, [filters]);

  const filteredLogs = logs.filter(log => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      log.action.toLowerCase().includes(searchLower) ||
      log.resource.toLowerCase().includes(searchLower) ||
      log.resourceId.toLowerCase().includes(searchLower) ||
      (log.userId && log.userId.toLowerCase().includes(searchLower)) ||
      (log.ipAddress && log.ipAddress.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className={`bg-white rounded-lg border border-slate-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              Logs de Auditoria
            </h3>
            <p className="text-sm text-slate-600">
              Monitoramento de segurança e atividades do sistema
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-3 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
          </button>

          <button
            onClick={exportLogs}
            className="flex items-center space-x-2 px-3 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-slate-600" />
              <span className="text-sm text-slate-600">Total de Eventos</span>
            </div>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stats.totalEvents}</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-600">Sucessos</span>
            </div>
            <p className="text-2xl font-bold text-green-800 mt-1">{stats.successfulEvents}</p>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm text-red-600">Falhas</span>
            </div>
            <p className="text-2xl font-bold text-red-800 mt-1">{stats.failedEvents}</p>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span className="text-sm text-orange-600">Alertas</span>
            </div>
            <p className="text-2xl font-bold text-orange-800 mt-1">{stats.securityAlerts}</p>
          </div>
        </div>
      )}

      {/* Alertas de Segurança */}
      {alerts.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-slate-700 mb-3">Alertas de Segurança Ativos</h4>
          <div className="space-y-2">
            {alerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border ${severityColors[alert.severity]}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">{alert.message}</span>
                  </div>
                  <span className="text-xs">{formatDate(alert.timestamp)}</span>
                </div>
              </div>
            ))}
            {alerts.length > 3 && (
              <p className="text-sm text-slate-600 text-center">
                E mais {alerts.length - 3} alertas...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Filtros */}
      {showFilters && (
        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ação
              </label>
              <select
                value={filters.action || ''}
                onChange={(e) => handleFilterChange('action', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todas as ações</option>
                {auditActions.map(action => (
                  <option key={action} value={action}>
                    {getActionLabel(action)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Recurso
              </label>
              <select
                value={filters.resource || ''}
                onChange={(e) => handleFilterChange('resource', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todos os recursos</option>
                {auditResources.map(resource => (
                  <option key={resource} value={resource}>
                    {getResourceLabel(resource)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                value={filters.success === undefined ? '' : filters.success.toString()}
                onChange={(e) => handleFilterChange('success', e.target.value === '' ? undefined : e.target.value === 'true')}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todos</option>
                <option value="true">Sucesso</option>
                <option value="false">Falha</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <FormInput
              id="search"
              name="search"
              type="text"
              label=""
              placeholder="Buscar em logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-5 w-5" />}
              className="flex-1 mr-4"
            />

            <button
              onClick={clearFilters}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      )}

      {/* Lista de Logs */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-slate-600 mt-2">Carregando logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h4 className="font-medium text-slate-700 mb-2">
              Nenhum log encontrado
            </h4>
            <p className="text-sm text-slate-600">
              Ajuste os filtros para ver mais resultados
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => setSelectedLog(log)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getActionIcon(log.action)}
                  <div>
                    <h4 className="font-medium text-slate-800">
                      {getActionLabel(log.action)}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {getResourceLabel(log.resource)} • {log.resourceId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-slate-600">
                      {formatDate(log.timestamp)}
                    </p>
                    <div className="flex items-center space-x-2">
                      {log.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-xs ${log.success ? 'text-green-600' : 'text-red-600'}`}>
                        {log.success ? 'Sucesso' : 'Falha'}
                      </span>
                    </div>
                  </div>

                  <Eye className="h-4 w-4 text-slate-400" />
                </div>
              </div>

              {log.userId && (
                <div className="mt-2 flex items-center space-x-4 text-sm text-slate-500">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{log.userId}</span>
                  </div>
                  {log.ipAddress && (
                    <div className="flex items-center space-x-1">
                      <Globe className="h-3 w-3" />
                      <span>{log.ipAddress}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal de Detalhes */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Detalhes do Log
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ação
                  </label>
                  <p className="text-sm text-slate-800">{getActionLabel(selectedLog.action)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Recurso
                  </label>
                  <p className="text-sm text-slate-800">{getResourceLabel(selectedLog.resource)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    ID do Recurso
                  </label>
                  <p className="text-sm text-slate-800 font-mono">{selectedLog.resourceId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status
                  </label>
                  <div className="flex items-center space-x-2">
                    {selectedLog.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ${selectedLog.success ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedLog.success ? 'Sucesso' : 'Falha'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Timestamp
                  </label>
                  <p className="text-sm text-slate-800">{formatDate(selectedLog.timestamp)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Usuário
                  </label>
                  <p className="text-sm text-slate-800">{selectedLog.userId || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    IP Address
                  </label>
                  <p className="text-sm text-slate-800">{selectedLog.ipAddress || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    User Agent
                  </label>
                  <p className="text-sm text-slate-800 truncate">{selectedLog.userAgent || 'N/A'}</p>
                </div>
              </div>

              {selectedLog.errorMessage && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Mensagem de Erro
                  </label>
                  <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {selectedLog.errorMessage}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Detalhes
                </label>
                <pre className="text-xs text-slate-800 bg-slate-50 p-3 rounded overflow-x-auto">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { AuditLogViewer };
