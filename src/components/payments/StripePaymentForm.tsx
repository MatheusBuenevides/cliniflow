import React, { useState, useEffect } from 'react';
import { CreditCard, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { realPaymentService } from '../../services/realPaymentService';
import type { PaymentRequest } from '../../types';

interface StripePaymentFormProps {
  amount: number;
  description: string;
  customerData: {
    name: string;
    email: string;
    document: string;
    phone?: string;
  };
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentError: (error: string) => void;
  className?: string;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  description,
  customerData,
  onPaymentSuccess,
  onPaymentError,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  useEffect(() => {
    initializePayment();
  }, []);

  const initializePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Criar PaymentIntent no backend (simulado)
      const paymentRequest: PaymentRequest = {
        amount,
        currency: 'BRL',
        description,
        paymentMethod: 'creditCard',
        customerData,
        metadata: {
          source: 'stripe_payment_form'
        }
      };

      const response = await realPaymentService.processPayment(paymentRequest);
      
      if (response.gatewayResponse?.clientSecret) {
        setClientSecret(response.gatewayResponse.clientSecret);
        setIsInitialized(true);
      } else {
        throw new Error('Falha ao inicializar pagamento');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao inicializar pagamento';
      setError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!clientSecret) {
      setError('Pagamento não inicializado');
      return;
    }

    try {
      setPaymentStatus('processing');
      setError(null);

      const result = await realPaymentService.confirmStripePayment(clientSecret);
      
      if (result.success) {
        setPaymentStatus('success');
        onPaymentSuccess(clientSecret);
      } else {
        setPaymentStatus('error');
        setError(result.error || 'Erro ao processar pagamento');
        onPaymentError(result.error || 'Erro ao processar pagamento');
      }
    } catch (err) {
      setPaymentStatus('error');
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar pagamento';
      setError(errorMessage);
      onPaymentError(errorMessage);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Inicializando pagamento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className="flex items-center mb-4">
          <XCircle className="h-5 w-5 text-red-600 mr-2" />
          <h3 className="text-lg font-semibold text-red-800">Erro no Pagamento</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={initializePayment}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className={`p-6 bg-green-50 border border-green-200 rounded-lg ${className}`}>
        <div className="flex items-center mb-4">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-green-800">Pagamento Aprovado!</h3>
        </div>
        <p className="text-green-700">
          Seu pagamento de {formatPrice(amount)} foi processado com sucesso.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center mb-6">
        <CreditCard className="h-6 w-6 text-blue-600 mr-3" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Pagamento com Cartão</h3>
          <p className="text-sm text-gray-600">Processado de forma segura pelo Stripe</p>
        </div>
      </div>

      {/* Resumo do Pagamento */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Valor:</span>
          <span className="text-lg font-semibold text-gray-900">{formatPrice(amount)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Descrição:</span>
          <span className="text-sm text-gray-700">{description}</span>
        </div>
      </div>

      {/* Container para elementos do Stripe */}
      {isInitialized && clientSecret && (
        <div className="mb-6">
          <div id="stripe-payment-element" className="mb-4">
            {/* Os elementos do Stripe serão montados aqui */}
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <p className="text-sm text-gray-600 text-center">
                Elementos de pagamento do Stripe serão carregados aqui
              </p>
              <p className="text-xs text-gray-500 text-center mt-2">
                Client Secret: {clientSecret.substring(0, 20)}...
              </p>
            </div>
          </div>

          {/* Botão de Pagamento */}
          <button
            onClick={handlePaymentSubmit}
            disabled={paymentStatus === 'processing'}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
              paymentStatus === 'processing'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {paymentStatus === 'processing' ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processando...
              </div>
            ) : (
              `Pagar ${formatPrice(amount)}`
            )}
          </button>
        </div>
      )}

      {/* Informações de Segurança */}
      <div className="text-xs text-gray-500 text-center">
        <p>🔒 Seus dados são protegidos com criptografia de nível bancário</p>
        <p>Powered by Stripe</p>
      </div>
    </div>
  );
};

export default StripePaymentForm;
