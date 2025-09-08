import React from 'react';
import { 
  CreditCard, 
  Smartphone, 
  FileText, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  amount: number;
  className?: string;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
  amount,
  className = ''
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const paymentMethods = [
    {
      id: 'pix',
      name: 'PIX',
      icon: <Smartphone className="h-5 w-5" />,
      description: 'Pagamento instantâneo',
      processingTime: 'Imediato',
      fees: 0,
      isAvailable: true,
      color: 'bg-green-50 border-green-200 text-green-800',
      selectedColor: 'bg-green-100 border-green-300'
    },
    {
      id: 'creditCard',
      name: 'Cartão de Crédito',
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Visa, Mastercard, Elo',
      processingTime: 'Imediato',
      fees: 0.0299, // 2.99%
      isAvailable: true,
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      selectedColor: 'bg-blue-100 border-blue-300'
    },
    {
      id: 'debitCard',
      name: 'Cartão de Débito',
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Débito online',
      processingTime: 'Imediato',
      fees: 0.0199, // 1.99%
      isAvailable: true,
      color: 'bg-purple-50 border-purple-200 text-purple-800',
      selectedColor: 'bg-purple-100 border-purple-300'
    },
    {
      id: 'boleto',
      name: 'Boleto Bancário',
      icon: <FileText className="h-5 w-5" />,
      description: 'Pagamento em até 3 dias úteis',
      processingTime: '1-3 dias úteis',
      fees: 0,
      isAvailable: true,
      color: 'bg-orange-50 border-orange-200 text-orange-800',
      selectedColor: 'bg-orange-100 border-orange-300'
    }
  ];

  const calculateTotalWithFees = (method: typeof paymentMethods[0]) => {
    if (method.fees === 0) return amount;
    return amount + (amount * method.fees);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-slate-800">Método de Pagamento</h4>
        <div className="text-sm text-slate-500">
          Total: <span className="font-medium text-slate-700">{formatPrice(amount)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {paymentMethods.map((method) => {
          const isSelected = selectedMethod === method.id;
          const totalWithFees = calculateTotalWithFees(method);
          const hasFees = method.fees > 0;

          return (
            <button
              key={method.id}
              onClick={() => onMethodChange(method.id)}
              disabled={!method.isAvailable}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200 text-left
                ${isSelected 
                  ? `${method.selectedColor} border-2` 
                  : `${method.color} border hover:border-opacity-60`
                }
                ${!method.isAvailable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${isSelected ? 'ring-2 ring-offset-2 ring-purple-500' : ''}
              `}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-white' : 'bg-white bg-opacity-50'}`}>
                  {method.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h5 className="font-medium text-sm">{method.name}</h5>
                    {isSelected && <CheckCircle className="h-4 w-4 text-green-600" />}
                  </div>
                  
                  <p className="text-xs text-slate-600 mt-1">{method.description}</p>
                  
                  <div className="flex items-center space-x-1 mt-2">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span className="text-xs text-slate-500">{method.processingTime}</span>
                  </div>

                  {hasFees && (
                    <div className="mt-2">
                      <div className="text-xs text-slate-600">
                        Taxa: {(method.fees * 100).toFixed(2)}%
                      </div>
                      <div className="text-sm font-medium">
                        Total: {formatPrice(totalWithFees)}
                      </div>
                    </div>
                  )}

                  {!hasFees && (
                    <div className="mt-2">
                      <div className="text-xs text-green-600 font-medium">
                        Sem taxas
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {!method.isAvailable && (
                <div className="absolute top-2 right-2">
                  <AlertCircle className="h-4 w-4 text-slate-400" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="bg-slate-50 rounded-lg p-3">
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <AlertCircle className="h-4 w-4 text-slate-400" />
          <span>
            Todos os pagamentos são processados de forma segura e criptografada.
          </span>
        </div>
      </div>
    </div>
  );
};

export { PaymentMethodSelector };
