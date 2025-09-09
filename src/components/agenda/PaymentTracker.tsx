import React, { useState, useEffect, useCallback } from 'react';
import { 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle,
  CreditCard,
  Smartphone,
  FileText,
  DollarSign,
  ExternalLink
} from 'lucide-react';
import { LoadingButton } from '../ui';
import { usePayment } from '../../hooks/usePayment';
import type { PaymentStatus, PaymentMethod } from '../../types';

interface PaymentTrackerProps {
  paymentId: string;
  paymentMethod: PaymentMethod;
  amount: number;
  onPaymentComplete: (status: PaymentStatus) => void;
  onPaymentError: (error: string) => void;
  className?: string;
}

interface PaymentHistory {
  id: string;
  status: PaymentStatus;
  timestamp: string;
  message: string;
  details?: string;
}

const PaymentTracker: React.FC<PaymentTrackerProps> = ({
  paymentId,
  paymentMethod,
  amount,
  onPaymentComplete,
  onPaymentError,
  className = ''
}) => {
  const [currentStatus, setCurrentStatus] = useState<PaymentStatus>('pending');
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { checkPaymentStatus, loading, error } = usePayment();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'pix':
        return <Smartphone className="h-5 w-5" />;
      case 'creditCard':
      case 'debitCard':
        return <CreditCard className="h-5 w-5" />;
      case 'boleto':
        return <FileText className="h-5 w-5" />;
      default:
        return <DollarSign className="h-5 w-5" />;
    }
  };

  const getPaymentMethodName = (method: PaymentMethod) => {
    switch (method) {
      case 'pix':
        return 'PIX';
      case 'creditCard':
        return 'Cartão de Crédito';
      case 'debitCard':
        return 'Cartão de Débito';
      case 'boleto':
        return 'Boleto Bancário';
      default:
        return 'Pagamento';
    }
  };

  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case 'paid':
        return {
          icon: <CheckCircle className="h-6 w-6" />,
          title: 'Pagamento Confirmado',
          message: 'Seu pagamento foi processado com sucesso!',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      
      case 'pending':
        return {
          icon: <Clock className="h-6 w-6" />,
          title: 'Aguardando Pagamento',
          message: 'Aguardando confirmação do pagamento...',
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200'
        };
      
      case 'cancelled':
        return {
          icon: <XCircle className="h-6 w-6" />,
          title: 'Pagamento Cancelado',
          message: 'O pagamento foi cancelado ou expirou.',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      
      case 'refunded':
        return {
          icon: <RefreshCw className="h-6 w-6" />,
          title: 'Pagamento Estornado',
          message: 'O pagamento foi estornado com sucesso.',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      
      default:
        return {
          icon: <AlertCircle className="h-6 w-6" />,
          title: 'Status Desconhecido',
          message: 'Não foi possível determinar o status do pagamento.',
          color: 'text-slate-600',
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-200'
        };
    }
  };

  const addToHistory = useCallback((status: PaymentStatus, message: string, details?: string) => {
    const historyItem: PaymentHistory = {
      id: `history_${Date.now()}`,
      status,
      timestamp: new Date().toISOString(),
      message,
      details
    };

    setPaymentHistory(prev => [historyItem, ...prev]);
  }, []);

  const checkStatus = useCallback(async () => {
    if (!paymentId) return;

    try {
      const status = await checkPaymentStatus(paymentId);
      
      if (status !== currentStatus) {
        setCurrentStatus(status);
        addToHistory(status, `Status alterado para: ${status}`);
        
        if (status === 'paid') {
          onPaymentComplete(status);
        } else if (status === 'cancelled') {
          onPaymentError('Pagamento cancelado');
        }
      }
      
      setLastChecked(new Date());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao verificar status';
      onPaymentError(errorMessage);
      addToHistory(currentStatus, 'Erro ao verificar status', errorMessage);
    }
  }, [paymentId, currentStatus, checkPaymentStatus, onPaymentComplete, onPaymentError, addToHistory]);

  // Verificação automática a cada 10 segundos
  useEffect(() => {
    if (!autoRefresh || !isTracking) return;

    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, isTracking, checkStatus]);

  // Verificação inicial
  useEffect(() => {
    if (paymentId) {
      setIsTracking(true);
      checkStatus();
    }
  }, [paymentId, checkStatus]);

  const handleManualCheck = () => {
    checkStatus();
  };

  const statusConfig = getStatusConfig(currentStatus);

  return (
    <div className={`bg-white rounded-lg border border-slate-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            {getPaymentMethodIcon(paymentMethod)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              Rastreamento de Pagamento
            </h3>
            <p className="text-sm text-slate-600">
              {getPaymentMethodName(paymentMethod)} • {formatPrice(amount)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span>Auto-refresh</span>
          </label>
        </div>
      </div>

      {/* Status Atual */}
      <div className={`${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-lg p-4 mb-6`}>
        <div className="flex items-center space-x-3">
          <div className={statusConfig.color}>
            {statusConfig.icon}
          </div>
          <div>
            <h4 className={`font-semibold ${statusConfig.color}`}>
              {statusConfig.title}
            </h4>
            <p className="text-sm text-slate-600">
              {statusConfig.message}
            </p>
          </div>
        </div>

        {lastChecked && (
          <div className="mt-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Última verificação:</span>
              <span>{formatTime(lastChecked)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Informações do Pagamento */}
      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-600">ID do Pagamento:</span>
            <p className="font-mono text-slate-800">{paymentId}</p>
          </div>
          <div>
            <span className="text-slate-600">Método:</span>
            <p className="text-slate-800">{getPaymentMethodName(paymentMethod)}</p>
          </div>
          <div>
            <span className="text-slate-600">Valor:</span>
            <p className="font-semibold text-slate-800">{formatPrice(amount)}</p>
          </div>
          <div>
            <span className="text-slate-600">Status:</span>
            <p className={`font-medium ${statusConfig.color}`}>
              {statusConfig.title}
            </p>
          </div>
        </div>
      </div>

      {/* Histórico de Status */}
      {paymentHistory.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-slate-700 mb-3">Histórico de Status</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {paymentHistory.map((item) => {
              const itemConfig = getStatusConfig(item.status);
              return (
                <div key={item.id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                  <div className={`${itemConfig.color} mt-1`}>
                    {itemConfig.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{item.message}</p>
                    {item.details && (
                      <p className="text-xs text-slate-600 mt-1">{item.details}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      {formatTime(new Date(item.timestamp))}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Botões de Ação */}
      <div className="flex space-x-3">
        <LoadingButton
          onClick={handleManualCheck}
          loading={loading}
          loadingText="Verificando..."
          className="flex-1"
          leftIcon={<RefreshCw className="h-4 w-4" />}
        >
          Verificar Agora
        </LoadingButton>

        {currentStatus === 'pending' && (
          <button
            onClick={() => window.open(`/payment/${paymentId}`, '_blank')}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Abrir Pagamento</span>
          </button>
        )}
      </div>

      {/* Erro */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Informações de Ajuda */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Dicas:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>O status é atualizado automaticamente a cada 10 segundos</li>
              <li>Você pode desabilitar o auto-refresh se preferir</li>
              <li>Use "Verificar Agora" para uma verificação imediata</li>
              <li>Em caso de problemas, entre em contato conosco</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PaymentTracker };
