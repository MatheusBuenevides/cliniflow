import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle,
  RefreshCw,
  CreditCard,
  Smartphone,
  FileText
} from 'lucide-react';
import type { PaymentStatus, PaymentMethod } from '../../types';

interface PaymentStatusProps {
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  amount: number;
  onRetry?: () => void;
  onCancel?: () => void;
  className?: string;
}

const PaymentStatusComponent: React.FC<PaymentStatusProps> = ({
  status,
  paymentMethod,
  amount,
  onRetry,
  onCancel,
  className = ''
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getPaymentMethodIcon = (method?: PaymentMethod) => {
    switch (method) {
      case 'pix':
        return <Smartphone className="h-5 w-5" />;
      case 'creditCard':
      case 'debitCard':
        return <CreditCard className="h-5 w-5" />;
      case 'boleto':
        return <FileText className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getPaymentMethodName = (method?: PaymentMethod) => {
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
          borderColor: 'border-green-200',
          nextSteps: [
            'Você receberá um email de confirmação',
            'O agendamento está confirmado',
            'Aguarde o lembrete antes da consulta'
          ],
          canRetry: false,
          canCancel: false
        };
      
      case 'pending':
        return {
          icon: <Clock className="h-6 w-6" />,
          title: 'Pagamento Pendente',
          message: 'Aguardando confirmação do pagamento...',
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          nextSteps: [
            'Complete o pagamento para confirmar o agendamento',
            'Você tem até 24 horas para pagar',
            'Após o pagamento, receberá a confirmação'
          ],
          canRetry: true,
          canCancel: true
        };
      
      case 'cancelled':
        return {
          icon: <XCircle className="h-6 w-6" />,
          title: 'Pagamento Cancelado',
          message: 'O pagamento foi cancelado ou expirou.',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          nextSteps: [
            'Você pode tentar pagar novamente',
            'Ou escolher outro método de pagamento',
            'O agendamento ainda não está confirmado'
          ],
          canRetry: true,
          canCancel: false
        };
      
      case 'refunded':
        return {
          icon: <RefreshCw className="h-6 w-6" />,
          title: 'Pagamento Estornado',
          message: 'O pagamento foi estornado com sucesso.',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          nextSteps: [
            'O valor será devolvido em até 5 dias úteis',
            'Você pode reagendar se desejar',
            'Entre em contato para mais informações'
          ],
          canRetry: false,
          canCancel: false
        };
      
      default:
        return {
          icon: <AlertCircle className="h-6 w-6" />,
          title: 'Status Desconhecido',
          message: 'Não foi possível determinar o status do pagamento.',
          color: 'text-slate-600',
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-200',
          nextSteps: [
            'Entre em contato conosco',
            'Verifique o status em seu banco',
            'Aguarde alguns minutos e tente novamente'
          ],
          canRetry: true,
          canCancel: true
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <div className={`${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className={`${statusConfig.color}`}>
          {statusConfig.icon}
        </div>
        <div>
          <h3 className={`font-semibold ${statusConfig.color}`}>
            {statusConfig.title}
          </h3>
          <p className="text-sm text-slate-600">
            {statusConfig.message}
          </p>
        </div>
      </div>

      {/* Detalhes do pagamento */}
      <div className="bg-white bg-opacity-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">Método:</span>
          <div className="flex items-center space-x-2">
            {getPaymentMethodIcon(paymentMethod)}
            <span className="text-sm font-medium text-slate-700">
              {getPaymentMethodName(paymentMethod)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Valor:</span>
          <span className="font-bold text-slate-800">
            {formatPrice(amount)}
          </span>
        </div>
      </div>

      {/* Próximos passos */}
      {statusConfig.nextSteps && statusConfig.nextSteps.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-slate-700 mb-2">
            Próximos passos:
          </h4>
          <ul className="space-y-1">
            {statusConfig.nextSteps.map((step, index) => (
              <li key={index} className="text-sm text-slate-600 flex items-start space-x-2">
                <span className="text-slate-400 mt-1">•</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Botões de ação */}
      {(statusConfig.canRetry || statusConfig.canCancel) && (
        <div className="flex space-x-3">
          {statusConfig.canRetry && onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Tentar Novamente</span>
            </button>
          )}
          
          {statusConfig.canCancel && onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-100 border border-red-300 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors"
            >
              <XCircle className="h-4 w-4" />
              <span>Cancelar</span>
            </button>
          )}
        </div>
      )}

      {/* Informações adicionais */}
      {status === 'pending' && (
        <div className="mt-4 p-3 bg-amber-100 border border-amber-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
            <div className="text-sm text-amber-700">
              <p className="font-medium">Importante:</p>
              <p>O agendamento só será confirmado após a confirmação do pagamento.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentStatusComponent;
