import React from 'react';
import { 
  Clock, 
  CheckCircle, 
  Play, 
  Check, 
  X, 
  AlertTriangle,
  Calendar
} from 'lucide-react';
import type { AppointmentStatus, PaymentStatus } from '../../types';

interface StatusBadgeProps {
  status: AppointmentStatus | PaymentStatus;
  type?: 'appointment' | 'payment';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = 'appointment',
  size = 'md',
  showIcon = true,
  className = ''
}) => {
  const getStatusConfig = () => {
    if (type === 'payment') {
      switch (status as PaymentStatus) {
        case 'pending':
          return {
            label: 'Pendente',
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            icon: Clock,
            iconColor: 'text-yellow-600'
          };
        case 'paid':
          return {
            label: 'Pago',
            color: 'bg-green-100 text-green-800 border-green-200',
            icon: CheckCircle,
            iconColor: 'text-green-600'
          };
        case 'cancelled':
          return {
            label: 'Cancelado',
            color: 'bg-red-100 text-red-800 border-red-200',
            icon: X,
            iconColor: 'text-red-600'
          };
        case 'refunded':
          return {
            label: 'Reembolsado',
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            icon: CheckCircle,
            iconColor: 'text-gray-600'
          };
        default:
          return {
            label: status,
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            icon: Clock,
            iconColor: 'text-gray-600'
          };
      }
    }

    // Appointment status
    switch (status as AppointmentStatus) {
      case 'scheduled':
        return {
          label: 'Agendado',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: Calendar,
          iconColor: 'text-blue-600'
        };
      case 'confirmed':
        return {
          label: 'Confirmado',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          iconColor: 'text-green-600'
        };
      case 'inProgress':
        return {
          label: 'Em Andamento',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Play,
          iconColor: 'text-yellow-600'
        };
      case 'completed':
        return {
          label: 'Realizado',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Check,
          iconColor: 'text-gray-600'
        };
      case 'cancelled':
        return {
          label: 'Cancelado',
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: X,
          iconColor: 'text-red-600'
        };
      case 'noShow':
        return {
          label: 'Faltou',
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: AlertTriangle,
          iconColor: 'text-orange-600'
        };
      default:
        return {
          label: status,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Clock,
          iconColor: 'text-gray-600'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-sm';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-3 w-3';
      case 'lg':
        return 'h-5 w-5';
      default:
        return 'h-4 w-4';
    }
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${config.color}
        ${getSizeClasses()}
        ${className}
      `}
    >
      {showIcon && (
        <Icon className={`${getIconSize()} mr-1 ${config.iconColor}`} />
      )}
      {config.label}
    </span>
  );
};

export default StatusBadge;
