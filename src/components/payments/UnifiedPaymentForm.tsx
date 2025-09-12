import React, { useState } from 'react';
import { CreditCard, Smartphone, FileText, DollarSign } from 'lucide-react';
import StripePaymentForm from './StripePaymentForm';
import PagSeguroPaymentForm from './PagSeguroPaymentForm';
import type { PaymentMethod } from '../../types';

interface UnifiedPaymentFormProps {
  amount: number;
  description: string;
  customerData: {
    name: string;
    email: string;
    document: string;
    phone?: string;
  };
  onPaymentSuccess: (paymentId: string, method: PaymentMethod) => void;
  onPaymentError: (error: string) => void;
  className?: string;
}

const UnifiedPaymentForm: React.FC<UnifiedPaymentFormProps> = ({
  amount,
  description,
  customerData,
  onPaymentSuccess,
  onPaymentError,
  className = ''
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isLoading] = useState(false);

  const paymentMethods = [
    {
      id: 'pix' as PaymentMethod,
      name: 'PIX',
      icon: <Smartphone className="h-5 w-5" />,
      description: 'Pagamento instantâneo',
      processingTime: 'Imediato',
      fees: 0,
      gateway: 'pagseguro',
      color: 'bg-green-50 border-green-200 text-green-800',
      selectedColor: 'bg-green-100 border-green-300'
    },
    {
      id: 'creditCard' as PaymentMethod,
      name: 'Cartão de Crédito',
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Visa, Mastercard, Elo',
      processingTime: 'Imediato',
      fees: 0.0299, // 2.99%
      gateway: 'stripe',
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      selectedColor: 'bg-blue-100 border-blue-300'
    },
    {
      id: 'debitCard' as PaymentMethod,
      name: 'Cartão de Débito',
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Débito online',
      processingTime: 'Imediato',
      fees: 0.0199, // 1.99%
      gateway: 'stripe',
      color: 'bg-purple-50 border-purple-200 text-purple-800',
      selectedColor: 'bg-purple-100 border-purple-300'
    },
    {
      id: 'boleto' as PaymentMethod,
      name: 'Boleto Bancário',
      icon: <FileText className="h-5 w-5" />,
      description: 'Pagamento em até 3 dias úteis',
      processingTime: '1-3 dias úteis',
      fees: 0,
      gateway: 'pagseguro',
      color: 'bg-orange-50 border-orange-200 text-orange-800',
      selectedColor: 'bg-orange-100 border-orange-300'
    }
  ];

  const calculateTotalWithFees = (method: typeof paymentMethods[0]) => {
    if (method.fees === 0) return amount;
    return amount + (amount * method.fees);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handlePaymentSuccess = (paymentId: string, method: PaymentMethod) => {
    onPaymentSuccess(paymentId, method);
  };

  const handlePaymentError = (error: string) => {
    onPaymentError(error);
  };

  const renderPaymentForm = () => {
    if (!selectedMethod) return null;

    const method = paymentMethods.find(m => m.id === selectedMethod);
    if (!method) return null;

    if (method.gateway === 'stripe') {
      return (
        <StripePaymentForm
          amount={amount}
          description={description}
          customerData={customerData}
          onPaymentSuccess={(paymentId) => handlePaymentSuccess(paymentId, selectedMethod)}
          onPaymentError={handlePaymentError}
          className="mt-6"
        />
      );
    }

    if (method.gateway === 'pagseguro') {
      return (
        <PagSeguroPaymentForm
          amount={amount}
          description={description}
          customerData={customerData}
          paymentMethod={selectedMethod}
          onPaymentSuccess={(paymentId) => handlePaymentSuccess(paymentId, selectedMethod)}
          onPaymentError={handlePaymentError}
          className="mt-6"
        />
      );
    }

    return null;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Escolha a Forma de Pagamento</h2>
        <p className="text-gray-600">Selecione o método de pagamento mais conveniente para você</p>
      </div>

      {/* Resumo do Pagamento */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Valor Total:</span>
          <span className="text-xl font-bold text-gray-900">{formatPrice(amount)}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm text-gray-600">Descrição:</span>
          <span className="text-sm text-gray-700">{description}</span>
        </div>
      </div>

      {/* Seleção de Método de Pagamento */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Métodos de Pagamento</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {paymentMethods.map((method) => {
            const isSelected = selectedMethod === method.id;
            const totalWithFees = calculateTotalWithFees(method);
            
            return (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? `${method.selectedColor} border-current`
                    : `${method.color} border-gray-200 hover:border-gray-300`
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {method.icon}
                    <span className="ml-2 font-semibold">{method.name}</span>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 bg-current rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
                
                <p className="text-sm opacity-75 mb-2">{method.description}</p>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="opacity-75">
                    {method.fees > 0 ? `+ ${(method.fees * 100).toFixed(2)}%` : 'Sem taxa'}
                  </span>
                  <span className="font-semibold">
                    {formatPrice(totalWithFees)}
                  </span>
                </div>
                
                <div className="text-xs opacity-60 mt-1">
                  Processamento: {method.processingTime}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Formulário de Pagamento Específico */}
      {selectedMethod && (
        <div className="border-t pt-6">
          {renderPaymentForm()}
        </div>
      )}

      {/* Informações de Segurança */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <DollarSign className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">Pagamento Seguro</h4>
            <p className="text-sm text-blue-800">
              Todos os pagamentos são processados de forma segura com criptografia de nível bancário. 
              Seus dados financeiros nunca são armazenados em nossos servidores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedPaymentForm;
