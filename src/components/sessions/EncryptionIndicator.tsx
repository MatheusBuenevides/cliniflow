import React from 'react';
import { Lock, Unlock, Shield, AlertTriangle } from 'lucide-react';

interface EncryptionIndicatorProps {
  isEncrypted: boolean;
  status: 'encrypted' | 'unencrypted' | 'encrypting';
  showTooltip?: boolean;
}

const EncryptionIndicator: React.FC<EncryptionIndicatorProps> = ({
  isEncrypted,
  status,
  showTooltip = true
}) => {
  const getIndicatorConfig = () => {
    switch (status) {
      case 'encrypted':
        return {
          icon: Lock,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          label: 'Criptografado',
          description: 'Dados protegidos com criptografia'
        };
      case 'unencrypted':
        return {
          icon: Unlock,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          label: 'Não criptografado',
          description: 'Dados não estão protegidos'
        };
      case 'encrypting':
        return {
          icon: Shield,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          label: 'Criptografando...',
          description: 'Aplicando criptografia aos dados'
        };
      default:
        return {
          icon: AlertTriangle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          label: 'Status desconhecido',
          description: 'Não foi possível verificar o status de criptografia'
        };
    }
  };

  const config = getIndicatorConfig();
  const Icon = config.icon;

  return (
    <div className="relative group">
      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${config.bgColor}`}>
        <Icon className={`h-4 w-4 ${config.color}`} />
        <span className={`text-sm font-medium ${config.color}`}>
          {config.label}
        </span>
      </div>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          {config.description}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
        </div>
      )}
    </div>
  );
};

export { EncryptionIndicator };
