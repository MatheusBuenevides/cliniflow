import React, { useState } from 'react';
import { 
  CreditCard, 
  Lock, 
  Calendar, 
  User, 
  Mail, 
  Phone,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { FormInput, LoadingButton } from '../ui';
import type { PaymentMethod } from '../../types';

interface PaymentFormProps {
  amount: number;
  paymentMethod: PaymentMethod;
  onPaymentSubmit: (paymentData: PaymentFormData) => Promise<void>;
  onCancel: () => void;
  className?: string;
}

interface PaymentFormData {
  method: PaymentMethod;
  amount: number;
  // Cartão de crédito/débito
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  installments?: number;
  // PIX
  pixKey?: string;
  // Boleto
  payerName?: string;
  payerDocument?: string;
  payerEmail?: string;
  payerPhone?: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  paymentMethod,
  onPaymentSubmit,
  onCancel,
  className = ''
}) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    method: paymentMethod,
    amount,
    installments: 1
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (paymentMethod === 'creditCard' || paymentMethod === 'debitCard') {
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Número do cartão é obrigatório';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Número do cartão deve ter 16 dígitos';
      }

      if (!formData.cardHolder) {
        newErrors.cardHolder = 'Nome do portador é obrigatório';
      }

      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Data de validade é obrigatória';
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Formato deve ser MM/AA';
      }

      if (!formData.cvv) {
        newErrors.cvv = 'CVV é obrigatório';
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'CVV deve ter 3 ou 4 dígitos';
      }

      if (paymentMethod === 'creditCard' && (!formData.installments || formData.installments < 1)) {
        newErrors.installments = 'Número de parcelas é obrigatório';
      }
    }

    if (paymentMethod === 'boleto') {
      if (!formData.payerName) {
        newErrors.payerName = 'Nome do pagador é obrigatório';
      }
      if (!formData.payerDocument) {
        newErrors.payerDocument = 'CPF/CNPJ é obrigatório';
      }
      if (!formData.payerEmail) {
        newErrors.payerEmail = 'Email é obrigatório';
      }
      if (!formData.payerPhone) {
        newErrors.payerPhone = 'Telefone é obrigatório';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PaymentFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.slice(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onPaymentSubmit(formData);
    } catch (error) {
      console.error('Erro no pagamento:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInstallmentOptions = () => {
    const maxInstallments = Math.min(12, Math.floor(amount / 50)); // Mínimo R$ 50 por parcela
    return Array.from({ length: maxInstallments }, (_, i) => i + 1);
  };

  const calculateInstallmentValue = (installments: number) => {
    const totalWithInterest = amount * Math.pow(1.0299, installments - 1); // 2.99% ao mês
    return totalWithInterest / installments;
  };

  return (
    <div className={`bg-white rounded-lg border border-slate-200 p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
          <CreditCard className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            Pagamento - {formatPrice(amount)}
          </h3>
          <p className="text-sm text-slate-600">
            Método: {paymentMethod === 'creditCard' ? 'Cartão de Crédito' : 
                     paymentMethod === 'debitCard' ? 'Cartão de Débito' : 
                     paymentMethod === 'pix' ? 'PIX' : 'Boleto Bancário'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cartão de Crédito/Débito */}
        {(paymentMethod === 'creditCard' || paymentMethod === 'debitCard') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-slate-700">Dados do Cartão</h4>
              <button
                type="button"
                onClick={() => setShowCardDetails(!showCardDetails)}
                className="flex items-center space-x-1 text-sm text-slate-600 hover:text-slate-800"
              >
                {showCardDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span>{showCardDetails ? 'Ocultar' : 'Mostrar'}</span>
              </button>
            </div>

            <FormInput
              id="cardNumber"
              name="cardNumber"
              type="text"
              label="Número do Cartão"
              value={formData.cardNumber || ''}
              onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
              error={errors.cardNumber}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              leftIcon={<CreditCard className="h-5 w-5" />}
            />

            <FormInput
              id="cardHolder"
              name="cardHolder"
              type="text"
              label="Nome do Portador"
              value={formData.cardHolder || ''}
              onChange={(e) => handleInputChange('cardHolder', e.target.value.toUpperCase())}
              error={errors.cardHolder}
              placeholder="JOÃO SILVA"
              leftIcon={<User className="h-5 w-5" />}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                id="expiryDate"
                name="expiryDate"
                type="text"
                label="Validade"
                value={formData.expiryDate || ''}
                onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                error={errors.expiryDate}
                placeholder="MM/AA"
                maxLength={5}
                leftIcon={<Calendar className="h-5 w-5" />}
              />

              <FormInput
                id="cvv"
                name="cvv"
                type="text"
                label="CVV"
                value={formData.cvv || ''}
                onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                error={errors.cvv}
                placeholder="123"
                maxLength={4}
                leftIcon={<Lock className="h-5 w-5" />}
              />
            </div>

            {paymentMethod === 'creditCard' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Parcelamento
                </label>
                <select
                  value={formData.installments || 1}
                  onChange={(e) => handleInputChange('installments', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  {getInstallmentOptions().map(installments => (
                    <option key={installments} value={installments}>
                      {installments}x de {formatPrice(calculateInstallmentValue(installments))} 
                      {installments > 1 && ` (Total: ${formatPrice(calculateInstallmentValue(installments) * installments)})`}
                    </option>
                  ))}
                </select>
                {errors.installments && (
                  <p className="text-sm text-red-600 mt-1">{errors.installments}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Boleto Bancário */}
        {paymentMethod === 'boleto' && (
          <div className="space-y-4">
            <h4 className="font-medium text-slate-700">Dados do Pagador</h4>

            <FormInput
              id="payerName"
              name="payerName"
              type="text"
              label="Nome Completo"
              value={formData.payerName || ''}
              onChange={(e) => handleInputChange('payerName', e.target.value)}
              error={errors.payerName}
              placeholder="João Silva"
              leftIcon={<User className="h-5 w-5" />}
            />

            <FormInput
              id="payerDocument"
              name="payerDocument"
              type="text"
              label="CPF/CNPJ"
              value={formData.payerDocument || ''}
              onChange={(e) => handleInputChange('payerDocument', e.target.value)}
              error={errors.payerDocument}
              placeholder="000.000.000-00"
              leftIcon={<User className="h-5 w-5" />}
            />

            <FormInput
              id="payerEmail"
              name="payerEmail"
              type="email"
              label="Email"
              value={formData.payerEmail || ''}
              onChange={(e) => handleInputChange('payerEmail', e.target.value)}
              error={errors.payerEmail}
              placeholder="joao@email.com"
              leftIcon={<Mail className="h-5 w-5" />}
            />

            <FormInput
              id="payerPhone"
              name="payerPhone"
              type="tel"
              label="Telefone"
              value={formData.payerPhone || ''}
              onChange={(e) => handleInputChange('payerPhone', e.target.value)}
              error={errors.payerPhone}
              placeholder="(11) 99999-9999"
              leftIcon={<Phone className="h-5 w-5" />}
            />
          </div>
        )}

        {/* PIX */}
        {paymentMethod === 'pix' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="font-medium text-slate-700 mb-2">Pagamento via PIX</h4>
            <p className="text-sm text-slate-600">
              O QR Code e código PIX serão gerados após confirmar o pagamento.
            </p>
          </div>
        )}

        {/* Informações de Segurança */}
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Lock className="h-5 w-5 text-slate-400 mt-0.5" />
            <div className="text-sm text-slate-600">
              <p className="font-medium mb-1">Pagamento Seguro</p>
              <p>
                Seus dados são criptografados e protegidos. Não armazenamos informações do cartão.
              </p>
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
            leftIcon={<CheckCircle className="h-4 w-4" />}
          >
            Confirmar Pagamento
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export { PaymentForm };
