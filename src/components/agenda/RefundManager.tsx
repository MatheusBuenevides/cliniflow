import React, { useState } from 'react';
import { 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Calendar,
  User,
  FileText,
  CreditCard,
  Smartphone
} from 'lucide-react';
import { LoadingButton } from '../ui';
import type { PaymentMethod } from '../../types';


interface RefundManagerProps {
  paymentId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  onRefundRequest: (refundData: RefundRequestData) => Promise<void>;
  onCancel: () => void;
  className?: string;
}

interface RefundRequestData {
  paymentId: string;
  amount: number;
  reason: string;
  refundMethod: PaymentMethod;
  notes?: string;
}

const RefundManager: React.FC<RefundManagerProps> = ({
  paymentId,
  amount,
  paymentMethod,
  onRefundRequest,
  onCancel,
  className = ''
}) => {
  const [refundData, setRefundData] = useState<RefundRequestData>({
    paymentId,
    amount,
    reason: '',
    refundMethod: paymentMethod,
    notes: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };


  const refundReasons = [
    { value: 'cancelled_appointment', label: 'Consulta cancelada' },
    { value: 'patient_request', label: 'Solicitação do paciente' },
    { value: 'technical_issue', label: 'Problema técnico' },
    { value: 'duplicate_payment', label: 'Pagamento duplicado' },
    { value: 'service_not_provided', label: 'Serviço não prestado' },
    { value: 'other', label: 'Outro motivo' }
  ];

  const getRefundMethodIcon = (method: PaymentMethod) => {
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

  const getRefundMethodName = (method: PaymentMethod) => {
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
        return 'Transferência';
    }
  };

  const getProcessingTime = (method: PaymentMethod) => {
    switch (method) {
      case 'pix':
        return 'Imediato';
      case 'creditCard':
        return '5-10 dias úteis';
      case 'debitCard':
        return '3-5 dias úteis';
      case 'boleto':
        return '5-10 dias úteis';
      default:
        return '3-5 dias úteis';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!refundData.reason) {
      newErrors.reason = 'Motivo do estorno é obrigatório';
    }

    if (refundData.amount <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }

    if (refundData.amount > amount) {
      newErrors.amount = 'Valor não pode ser maior que o pagamento original';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof RefundRequestData, value: string | number) => {
    setRefundData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmRefund = async () => {
    setLoading(true);
    try {
      await onRefundRequest(refundData);
    } catch (error) {
      console.error('Erro no estorno:', error);
    } finally {
      setLoading(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className={`bg-white rounded-lg border border-slate-200 p-6 ${className}`}>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Confirmar Estorno
          </h3>
          
          <p className="text-slate-600 text-sm">
            Esta ação não pode ser desfeita. Confirme os dados abaixo:
          </p>
        </div>

        {/* Resumo do Estorno */}
        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Valor do estorno:</span>
              <span className="font-bold text-lg text-slate-800">
                {formatPrice(refundData.amount)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Método:</span>
              <div className="flex items-center space-x-2">
                {getRefundMethodIcon(refundData.refundMethod)}
                <span className="text-slate-700">
                  {getRefundMethodName(refundData.refundMethod)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-600">Motivo:</span>
              <span className="text-slate-700 text-right max-w-48">
                {refundReasons.find(r => r.value === refundData.reason)?.label}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-600">Prazo:</span>
              <span className="text-slate-700">
                {getProcessingTime(refundData.refundMethod)}
              </span>
            </div>
          </div>
        </div>

        {/* Informações importantes */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="text-sm text-amber-700">
              <p className="font-medium mb-1">Importante:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>O estorno será processado automaticamente</li>
                <li>O paciente será notificado por email</li>
                <li>O valor será devolvido pelo mesmo método de pagamento</li>
                <li>Esta ação não pode ser desfeita</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setShowConfirmation(false)}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            Voltar
          </button>
          
          <LoadingButton
            onClick={handleConfirmRefund}
            loading={loading}
            loadingText="Processando..."
            className="flex-1"
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Confirmar Estorno
          </LoadingButton>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-slate-200 p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
          <RefreshCw className="h-6 w-6 text-amber-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            Solicitar Estorno
          </h3>
          <p className="text-sm text-slate-600">
            Valor original: {formatPrice(amount)}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Valor do Estorno */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Valor do Estorno
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0.01"
              max={amount}
              value={refundData.amount}
              onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 pl-10 border border-slate-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="0,00"
            />
            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
          </div>
          {errors.amount && (
            <p className="text-sm text-red-600 mt-1">{errors.amount}</p>
          )}
          <p className="text-xs text-slate-500 mt-1">
            Valor máximo: {formatPrice(amount)}
          </p>
        </div>

        {/* Motivo do Estorno */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Motivo do Estorno *
          </label>
          <select
            value={refundData.reason}
            onChange={(e) => handleInputChange('reason', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Selecione um motivo</option>
            {refundReasons.map(reason => (
              <option key={reason.value} value={reason.value}>
                {reason.label}
              </option>
            ))}
          </select>
          {errors.reason && (
            <p className="text-sm text-red-600 mt-1">{errors.reason}</p>
          )}
        </div>

        {/* Método de Estorno */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Método de Estorno
          </label>
          <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
            {getRefundMethodIcon(refundData.refundMethod)}
            <div>
              <p className="font-medium text-slate-700">
                {getRefundMethodName(refundData.refundMethod)}
              </p>
              <p className="text-sm text-slate-500">
                Prazo: {getProcessingTime(refundData.refundMethod)}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            O estorno será feito pelo mesmo método do pagamento original
          </p>
        </div>

        {/* Observações */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Observações (opcional)
          </label>
          <textarea
            value={refundData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Adicione informações adicionais sobre o estorno..."
          />
        </div>

        {/* Informações de Processamento */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Processamento do Estorno:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>O estorno será processado automaticamente</li>
                <li>O paciente receberá uma notificação por email</li>
                <li>O valor será devolvido em até {getProcessingTime(refundData.refundMethod).toLowerCase()}</li>
                <li>Você receberá uma confirmação quando o estorno for concluído</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          
          <LoadingButton
            type="submit"
            loading={loading}
            loadingText="Processando..."
            className="flex-1"
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Solicitar Estorno
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export { RefundManager };
