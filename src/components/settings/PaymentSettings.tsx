import React, { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  FileText, 
  Settings,
  Check,
  AlertTriangle,
  Shield,
  DollarSign
} from 'lucide-react';
import type { PaymentSettings as PaymentSettingsType, PaymentMethod } from '../../types';

interface PaymentSettingsProps {
  settings: PaymentSettingsType;
  onSettingsChange: (settings: PaymentSettingsType) => void;
}

const PaymentSettings: React.FC<PaymentSettingsProps> = ({
  settings,
  onSettingsChange
}) => {
  const [localSettings, setLocalSettings] = useState<PaymentSettingsType>(settings);

  const handleToggle = (field: keyof PaymentSettingsType) => {
    const newSettings = {
      ...localSettings,
      [field]: !localSettings[field]
    };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleGatewayChange = (provider: 'stripe' | 'pagseguro' | 'mercadopago') => {
    const newSettings = {
      ...localSettings,
      gatewayProvider: provider
    };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handlePaymentMethodToggle = (method: PaymentMethod) => {
    const currentMethods = localSettings.acceptedMethods;
    const newMethods = currentMethods.includes(method)
      ? currentMethods.filter(m => m !== method)
      : [...currentMethods, method];
    
    const newSettings = {
      ...localSettings,
      acceptedMethods: newMethods
    };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleInstallmentsToggle = (enabled: boolean) => {
    const newSettings = {
      ...localSettings,
      installments: {
        ...localSettings.installments,
        enabled
      }
    };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleMaxInstallmentsChange = (maxInstallments: number) => {
    const newSettings = {
      ...localSettings,
      installments: {
        ...localSettings.installments,
        maxInstallments
      }
    };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const paymentMethods: { method: PaymentMethod; label: string; icon: React.ReactNode; description: string }[] = [
    {
      method: 'creditCard',
      label: 'Cartão de Crédito',
      icon: <CreditCard className="h-4 w-4" />,
      description: 'Visa, Mastercard, American Express'
    },
    {
      method: 'debitCard',
      label: 'Cartão de Débito',
      icon: <CreditCard className="h-4 w-4" />,
      description: 'Débito online'
    },
    {
      method: 'pix',
      label: 'PIX',
      icon: <Smartphone className="h-4 w-4" />,
      description: 'Pagamento instantâneo'
    },
    {
      method: 'boleto',
      label: 'Boleto Bancário',
      icon: <FileText className="h-4 w-4" />,
      description: 'Pagamento em até 3 dias úteis'
    },
    {
      method: 'transfer',
      label: 'Transferência',
      icon: <DollarSign className="h-4 w-4" />,
      description: 'Transferência bancária'
    }
  ];

  const gatewayProviders = [
    {
      id: 'stripe' as const,
      name: 'Stripe',
      description: 'Gateway internacional com suporte a cartões internacionais',
      features: ['Cartões internacionais', 'PIX', 'Boleto', 'Apple Pay', 'Google Pay']
    },
    {
      id: 'pagseguro' as const,
      name: 'PagSeguro',
      description: 'Gateway brasileiro com ampla aceitação no mercado nacional',
      features: ['PIX', 'Boleto', 'Cartões nacionais', 'Parcelamento']
    },
    {
      id: 'mercadopago' as const,
      name: 'Mercado Pago',
      description: 'Solução completa de pagamentos do Mercado Livre',
      features: ['PIX', 'Boleto', 'Cartões', 'Mercado Pago Credits']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          Configurações de Pagamento
        </h3>
        <p className="text-sm text-slate-600">
          Configure gateways de pagamento e métodos aceitos para suas consultas.
        </p>
      </div>

      {/* Gateway Provider */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Settings className="h-5 w-5 text-blue-600 mr-3" />
          <h4 className="text-base font-medium text-slate-800">Gateway de Pagamento</h4>
        </div>
        
        <div className="space-y-3">
          {gatewayProviders.map((provider) => (
            <div
              key={provider.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                localSettings.gatewayProvider === provider.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => handleGatewayChange(provider.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      name="gateway"
                      checked={localSettings.gatewayProvider === provider.id}
                      onChange={() => handleGatewayChange(provider.id)}
                      className="mr-3"
                    />
                    <h5 className="text-sm font-medium text-slate-800">{provider.name}</h5>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">{provider.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {provider.features.map((feature) => (
                      <span
                        key={feature}
                        className="inline-flex items-center px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                {localSettings.gatewayProvider === provider.id && (
                  <Check className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <CreditCard className="h-5 w-5 text-green-600 mr-3" />
          <h4 className="text-base font-medium text-slate-800">Métodos de Pagamento Aceitos</h4>
        </div>
        
        <div className="space-y-3">
          {paymentMethods.map(({ method, label, icon, description }) => (
            <div
              key={method}
              className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
            >
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-slate-100 rounded-lg mr-3">
                  {icon}
                </div>
                <div>
                  <h5 className="text-sm font-medium text-slate-800">{label}</h5>
                  <p className="text-xs text-slate-500">{description}</p>
                </div>
              </div>
              <button
                onClick={() => handlePaymentMethodToggle(method)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.acceptedMethods.includes(method) ? 'bg-green-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.acceptedMethods.includes(method) ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Installments */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <DollarSign className="h-5 w-5 text-purple-600 mr-3" />
          <h4 className="text-base font-medium text-slate-800">Parcelamento</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Permitir parcelamento
              </label>
              <p className="text-xs text-slate-500">
                Pacientes podem parcelar o valor das consultas
              </p>
            </div>
            <button
              onClick={() => handleInstallmentsToggle(!localSettings.installments.enabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.installments.enabled ? 'bg-purple-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.installments.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {localSettings.installments.enabled && (
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Número máximo de parcelas
              </label>
              <select
                value={localSettings.installments.maxInstallments}
                onChange={(e) => handleMaxInstallmentsChange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {[2, 3, 4, 5, 6, 10, 12].map((num) => (
                  <option key={num} value={num}>
                    {num}x
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">
                Máximo de parcelas permitidas para pagamento
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Auto Send Payment Links */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Shield className="h-5 w-5 text-amber-600 mr-3" />
          <h4 className="text-base font-medium text-slate-800">Automação</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Envio automático de links de pagamento
              </label>
              <p className="text-xs text-slate-500">
                Links de pagamento são enviados automaticamente após agendamento
              </p>
            </div>
            <button
              onClick={() => handleToggle('autoSendPaymentLinks')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.autoSendPaymentLinks ? 'bg-amber-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.autoSendPaymentLinks ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-green-800 mb-1">
              Segurança dos Pagamentos
            </h4>
            <p className="text-xs text-green-700">
              Todos os pagamentos são processados de forma segura através de gateways certificados 
              com criptografia SSL e conformidade PCI DSS.
            </p>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-amber-800 mb-1">
              Configuração de Gateway
            </h4>
            <p className="text-xs text-amber-700">
              Para ativar os pagamentos, você precisará configurar as credenciais do gateway 
              selecionado nas configurações avançadas. Entre em contato com o suporte para assistência.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;
