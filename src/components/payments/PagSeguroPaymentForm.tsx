import React, { useState } from 'react';
import { Smartphone, FileText, CreditCard, Loader2, CheckCircle, XCircle, Copy } from 'lucide-react';
import { realPaymentService } from '../../services/realPaymentService';
import type { PaymentRequest, PaymentMethod } from '../../types';

interface PagSeguroPaymentFormProps {
  amount: number;
  description: string;
  customerData: {
    name: string;
    email: string;
    document: string;
    phone?: string;
  };
  paymentMethod: PaymentMethod;
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentError: (error: string) => void;
  className?: string;
}

const PagSeguroPaymentForm: React.FC<PagSeguroPaymentFormProps> = ({
  amount,
  description,
  customerData,
  paymentMethod,
  onPaymentSuccess,
  onPaymentError,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setPaymentStatus('processing');

      const paymentRequest: PaymentRequest = {
        amount,
        currency: 'BRL',
        description,
        paymentMethod,
        customerData,
        metadata: {
          source: 'pagseguro_payment_form'
        }
      };

      const response = await realPaymentService.processPayment(paymentRequest);
      
      if (response.paymentLink) {
        setPaymentLink(response.paymentLink);
        setPaymentStatus('success');
        onPaymentSuccess(response.id);
      } else {
        throw new Error('Falha ao gerar link de pagamento');
      }
    } catch (err) {
      setPaymentStatus('error');
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar pagamento';
      setError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getPaymentMethodIcon = () => {
    switch (paymentMethod) {
      case 'pix':
        return <Smartphone className="h-6 w-6 text-green-600" />;
      case 'boleto':
        return <FileText className="h-6 w-6 text-orange-600" />;
      case 'creditCard':
      case 'debitCard':
        return <CreditCard className="h-6 w-6 text-blue-600" />;
      default:
        return <CreditCard className="h-6 w-6 text-gray-600" />;
    }
  };

  const getPaymentMethodName = () => {
    switch (paymentMethod) {
      case 'pix':
        return 'PIX';
      case 'boleto':
        return 'Boleto Bancário';
      case 'creditCard':
        return 'Cartão de Crédito';
      case 'debitCard':
        return 'Cartão de Débito';
      default:
        return 'Pagamento';
    }
  };

  if (error) {
    return (
      <div className={`p-6 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className="flex items-center mb-4">
          <XCircle className="h-5 w-5 text-red-600 mr-2" />
          <h3 className="text-lg font-semibold text-red-800">Erro no Pagamento</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={handlePayment}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (paymentStatus === 'success' && paymentLink) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
        {/* Header de Sucesso */}
        <div className="flex items-center mb-6">
          <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pagamento Gerado!</h3>
            <p className="text-sm text-gray-600">Siga as instruções abaixo para finalizar</p>
          </div>
        </div>

        {/* Resumo do Pagamento */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Valor:</span>
            <span className="text-lg font-semibold text-gray-900">{formatPrice(amount)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Método:</span>
            <span className="text-sm text-gray-700">{getPaymentMethodName()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Descrição:</span>
            <span className="text-sm text-gray-700">{description}</span>
          </div>
        </div>

        {/* Conteúdo específico do método de pagamento */}
        {paymentMethod === 'pix' && paymentLink.pixCode && (
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 mb-4">PIX - Pagamento Instantâneo</h4>
            
            {/* QR Code */}
            {paymentLink.qrCode && (
              <div className="text-center mb-4">
                <img 
                  src={paymentLink.qrCode} 
                  alt="QR Code PIX" 
                  className="mx-auto border border-gray-300 rounded-lg"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Escaneie o QR Code com seu app bancário
                </p>
              </div>
            )}

            {/* Código PIX */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Código PIX:</span>
                <button
                  onClick={() => copyToClipboard(paymentLink.pixCode)}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
              <div className="bg-white border border-gray-300 rounded p-3 font-mono text-sm break-all">
                {paymentLink.pixCode}
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'boleto' && paymentLink.boletoUrl && (
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 mb-4">Boleto Bancário</h4>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-orange-800">
                <strong>Vencimento:</strong> {new Date(paymentLink.expiresAt).toLocaleDateString('pt-BR')}
              </p>
              <p className="text-sm text-orange-700 mt-1">
                O boleto pode ser pago em qualquer banco, casa lotérica ou internet banking.
              </p>
            </div>
            <a
              href={paymentLink.boletoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors text-center block"
            >
              Visualizar e Imprimir Boleto
            </a>
          </div>
        )}

        {(paymentMethod === 'creditCard' || paymentMethod === 'debitCard') && (
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 mb-4">Pagamento com Cartão</h4>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                Você será redirecionado para o PagSeguro para inserir os dados do cartão.
              </p>
            </div>
            <a
              href={paymentLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
            >
              Pagar com Cartão
            </a>
          </div>
        )}

        {/* Instruções Gerais */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h5 className="text-sm font-semibold text-gray-900 mb-2">Instruções:</h5>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Após o pagamento, você receberá uma confirmação por email</li>
            <li>• O status será atualizado automaticamente em nossa plataforma</li>
            <li>• Em caso de dúvidas, entre em contato conosco</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center mb-6">
        {getPaymentMethodIcon()}
        <div className="ml-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Pagamento via {getPaymentMethodName()}
          </h3>
          <p className="text-sm text-gray-600">Processado de forma segura pelo PagSeguro</p>
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

      {/* Botão de Pagamento */}
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Processando...
          </div>
        ) : (
          `Gerar ${getPaymentMethodName()}`
        )}
      </button>

      {/* Informações de Segurança */}
      <div className="text-xs text-gray-500 text-center mt-4">
        <p>🔒 Seus dados são protegidos com criptografia de nível bancário</p>
        <p>Powered by PagSeguro</p>
      </div>
    </div>
  );
};

export default PagSeguroPaymentForm;
