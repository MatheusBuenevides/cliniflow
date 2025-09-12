import React, { useState } from 'react';
import { CreditCard, Smartphone, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import UnifiedPaymentForm from './UnifiedPaymentForm';
import { useRealPayment } from '../../hooks/useRealPayment';
import type { PaymentMethod } from '../../types';

interface PaymentGatewayDemoProps {
  className?: string;
}

const PaymentGatewayDemo: React.FC<PaymentGatewayDemoProps> = ({ className = '' }) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean;
    paymentId: string;
    method: PaymentMethod;
    message: string;
  } | null>(null);

  const { isLoading, error, clearError } = useRealPayment();

  const handlePaymentSuccess = (paymentId: string, method: PaymentMethod) => {
    setPaymentResult({
      success: true,
      paymentId,
      method,
      message: `Pagamento processado com sucesso via ${method.toUpperCase()}`
    });
    setShowPaymentForm(false);
  };

  const handlePaymentError = (errorMessage: string) => {
    setPaymentResult({
      success: false,
      paymentId: '',
      method: 'creditCard',
      message: errorMessage
    });
    setShowPaymentForm(false);
  };

  const resetDemo = () => {
    setShowPaymentForm(false);
    setPaymentResult(null);
    clearError();
  };

  const mockCustomerData = {
    name: 'João Silva',
    email: 'joao.silva@email.com',
    document: '123.456.789-00',
    phone: '(11) 99999-9999'
  };

  const mockAmount = 150.00;
  const mockDescription = 'Consulta de Psicologia - 50 minutos';

  if (paymentResult) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
        <div className="text-center">
          {paymentResult.success ? (
            <div className="flex flex-col items-center">
              <CheckCircle className="h-16 w-16 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Pagamento Processado!
              </h3>
              <p className="text-gray-600 mb-4">{paymentResult.message}</p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">
                  <strong>ID do Pagamento:</strong> {paymentResult.paymentId}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Método:</strong> {paymentResult.method.toUpperCase()}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Valor:</strong> R$ {mockAmount.toFixed(2)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <AlertCircle className="h-16 w-16 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Erro no Pagamento
              </h3>
              <p className="text-gray-600 mb-4">{paymentResult.message}</p>
            </div>
          )}
          
          <button
            onClick={resetDemo}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Testar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (showPaymentForm) {
    return (
      <div className={className}>
        <div className="mb-4">
          <button
            onClick={() => setShowPaymentForm(false)}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            ← Voltar para seleção
          </button>
        </div>
        
        <UnifiedPaymentForm
          amount={mockAmount}
          description={mockDescription}
          customerData={mockCustomerData}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Demonstração de Gateway de Pagamentos
        </h2>
        <p className="text-gray-600">
          Teste a integração com Stripe, PagSeguro e PIX
        </p>
      </div>

      {/* Resumo do Pagamento de Teste */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Pagamento de Teste</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Cliente:</span>
            <span className="text-sm text-gray-900">{mockCustomerData.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Email:</span>
            <span className="text-sm text-gray-900">{mockCustomerData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Valor:</span>
            <span className="text-sm font-semibold text-gray-900">
              R$ {mockAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Descrição:</span>
            <span className="text-sm text-gray-900">{mockDescription}</span>
          </div>
        </div>
      </div>

      {/* Status dos Gateways */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Status dos Gateways</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <CreditCard className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-900">Stripe</p>
              <p className="text-xs text-blue-700">Cartões internacionais</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
            <Smartphone className="h-5 w-5 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-900">PagSeguro</p>
              <p className="text-xs text-green-700">PIX, Boleto, Cartões</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <FileText className="h-5 w-5 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-orange-900">PIX Direto</p>
              <p className="text-xs text-orange-700">Pagamento instantâneo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Botão para Iniciar Teste */}
      <div className="text-center">
        <button
          onClick={() => setShowPaymentForm(true)}
          disabled={isLoading}
          className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Carregando...
            </div>
          ) : (
            'Iniciar Teste de Pagamento'
          )}
        </button>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Informações Técnicas */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Informações Técnicas</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Integração com Stripe para cartões internacionais</li>
          <li>• Integração com PagSeguro para mercado brasileiro</li>
          <li>• PIX nativo com QR Code gerado dinamicamente</li>
          <li>• Webhooks para notificações de status</li>
          <li>• Criptografia de nível bancário</li>
          <li>• Logs de auditoria completos</li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentGatewayDemo;
