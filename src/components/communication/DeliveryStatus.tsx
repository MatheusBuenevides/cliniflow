import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle, RefreshCw, Eye } from 'lucide-react';

interface DeliveryStatusProps {
  messageId: string;
  type: 'email' | 'sms' | 'whatsapp';
  recipient: string;
  scheduledFor: string;
  status: 'scheduled' | 'sent' | 'delivered' | 'read' | 'failed' | 'bounced';
  onRefresh?: () => Promise<void>;
  onRetry?: () => Promise<void>;
  details?: DeliveryDetails;
  showDetails?: boolean;
}

interface DeliveryDetails {
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
}

const DeliveryStatus: React.FC<DeliveryStatusProps> = ({
  type,
  recipient,
  scheduledFor,
  status,
  onRefresh,
  onRetry,
  details,
  showDetails = false
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [expanded, setExpanded] = useState(showDetails);

  // Auto-refresh para mensagens em andamento
  useEffect(() => {
    if (status === 'scheduled' || status === 'sent') {
      const interval = setInterval(() => {
        if (onRefresh) {
          onRefresh();
        }
      }, 30000); // Refresh a cada 30 segundos

      return () => clearInterval(interval);
    }
  }, [status, onRefresh]);

  // Obter ícone do status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'sent':
        return <CheckCircle className="w-5 h-5 text-yellow-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'read':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'bounced':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
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

  // Formatar data/hora
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calcular tempo desde o envio
  const getTimeSince = (dateTime: string) => {
    const now = new Date();
    const date = new Date(dateTime);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;
    } else if (diffHours > 0) {
      return `${diffHours} hora${diffHours > 1 ? 's' : ''} atrás`;
    } else if (diffMins > 0) {
      return `${diffMins} minuto${diffMins > 1 ? 's' : ''} atrás`;
    } else {
      return 'Agora mesmo';
    }
  };

  // Refresh status
  const handleRefresh = async () => {
    if (!onRefresh) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Retry envio
  const handleRetry = async () => {
    if (!onRetry) return;
    
    setIsRetrying(true);
    try {
      await onRetry();
    } catch (error) {
      console.error('Erro ao tentar reenviar:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-lg">{getTypeIcon(type)}</span>
          <div>
            <div className="font-medium text-gray-900">{recipient}</div>
            <div className="text-sm text-gray-500">
              {type.toUpperCase()} • {formatDateTime(scheduledFor)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {getStatusText(status)}
          </span>
          {getStatusIcon(status)}
        </div>
      </div>

      {/* Status Timeline */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {status === 'scheduled' && (
            <>
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Agendada para {formatDateTime(scheduledFor)}</span>
            </>
          )}
          
          {status === 'sent' && details?.sentAt && (
            <>
              <CheckCircle className="w-4 h-4 text-yellow-500" />
              <span>Enviada {getTimeSince(details.sentAt)}</span>
            </>
          )}
          
          {status === 'delivered' && details?.deliveredAt && (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Entregue {getTimeSince(details.deliveredAt)}</span>
            </>
          )}
          
          {status === 'read' && details?.readAt && (
            <>
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Lida {getTimeSince(details.readAt)}</span>
            </>
          )}
          
          {status === 'failed' && details?.failedAt && (
            <>
              <XCircle className="w-4 h-4 text-red-500" />
              <span>Falhou {getTimeSince(details.failedAt)}</span>
            </>
          )}
          
          {status === 'bounced' && details?.bounceReason && (
            <>
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <span>Retornou: {details.bounceReason}</span>
            </>
          )}
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-2">
        {onRefresh && (
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        )}
        
        {onRetry && (status === 'failed' || status === 'bounced') && (
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex items-center gap-1 px-2 py-1 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
            Tentar Novamente
          </button>
        )}
        
        {details && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
          >
            <Eye className="w-4 h-4" />
            {expanded ? 'Ocultar' : 'Detalhes'}
          </button>
        )}
      </div>

      {/* Detalhes Expandidos */}
      {expanded && details && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          {/* Informações de Entrega */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Informações de Entrega</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {details.sentAt && (
                <div>
                  <span className="text-gray-500">Enviada em:</span>
                  <div className="font-medium">{formatDateTime(details.sentAt)}</div>
                </div>
              )}
              {details.deliveredAt && (
                <div>
                  <span className="text-gray-500">Entregue em:</span>
                  <div className="font-medium">{formatDateTime(details.deliveredAt)}</div>
                </div>
              )}
              {details.readAt && (
                <div>
                  <span className="text-gray-500">Lida em:</span>
                  <div className="font-medium">{formatDateTime(details.readAt)}</div>
                </div>
              )}
              {details.trackingId && (
                <div>
                  <span className="text-gray-500">ID de Rastreamento:</span>
                  <div className="font-mono text-xs">{details.trackingId}</div>
                </div>
              )}
            </div>
          </div>

          {/* Estatísticas de Email */}
          {type === 'email' && (details.openCount !== undefined || details.clickCount !== undefined) && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Estatísticas de Email</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                {details.openCount !== undefined && (
                  <div>
                    <span className="text-gray-500">Aberturas:</span>
                    <div className="font-medium">{details.openCount}</div>
                  </div>
                )}
                {details.clickCount !== undefined && (
                  <div>
                    <span className="text-gray-500">Cliques:</span>
                    <div className="font-medium">{details.clickCount}</div>
                  </div>
                )}
                {details.unsubscribeCount !== undefined && (
                  <div>
                    <span className="text-gray-500">Descadastros:</span>
                    <div className="font-medium">{details.unsubscribeCount}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Informações de Erro */}
          {(status === 'failed' || status === 'bounced') && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Informações de Erro</h4>
              <div className="space-y-2 text-sm">
                {details.errorMessage && (
                  <div>
                    <span className="text-gray-500">Mensagem de erro:</span>
                    <div className="font-medium text-red-600">{details.errorMessage}</div>
                  </div>
                )}
                {details.bounceReason && (
                  <div>
                    <span className="text-gray-500">Motivo do retorno:</span>
                    <div className="font-medium text-orange-600">{details.bounceReason}</div>
                  </div>
                )}
                {details.retryCount !== undefined && (
                  <div>
                    <span className="text-gray-500">Tentativas:</span>
                    <div className="font-medium">{details.retryCount}</div>
                  </div>
                )}
                {details.nextRetryAt && (
                  <div>
                    <span className="text-gray-500">Próxima tentativa:</span>
                    <div className="font-medium">{formatDateTime(details.nextRetryAt)}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Resposta do Provedor */}
          {details.providerResponse && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Resposta do Provedor</h4>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                {JSON.stringify(details.providerResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryStatus;
