import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash2, 
  MessageSquare, 
  CreditCard,
  Play,
  Clock,
  AlertTriangle,
  MoreVertical,
  Eye
} from 'lucide-react';
import type { Appointment, AppointmentStatus } from '../../types';

interface AppointmentActionsProps {
  appointment: Appointment;
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (appointment: Appointment) => void;
  onConfirm?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
  onComplete?: (appointment: Appointment) => void;
  onView?: (appointment: Appointment) => void;
  onContact?: (appointment: Appointment) => void;
  onPayment?: (appointment: Appointment) => void;
  onStart?: (appointment: Appointment) => void;
  onMarkNoShow?: (appointment: Appointment) => void;
  variant?: 'dropdown' | 'buttons' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export const AppointmentActions: React.FC<AppointmentActionsProps> = ({
  appointment,
  onEdit,
  onDelete,
  onConfirm,
  onCancel,
  onComplete,
  onView,
  onContact,
  onPayment,
  onStart,
  onMarkNoShow,
  variant = 'dropdown',
  size = 'md',
  showLabels = true
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const getAvailableActions = () => {
    const actions = [];

    // Ação de visualizar sempre disponível
    if (onView) {
      actions.push({
        key: 'view',
        label: 'Ver detalhes',
        icon: Eye,
        color: 'text-blue-600',
        onClick: () => onView(appointment)
      });
    }

    // Ações baseadas no status
    switch (appointment.status) {
      case 'scheduled':
        if (onConfirm) {
          actions.push({
            key: 'confirm',
            label: 'Confirmar',
            icon: CheckCircle,
            color: 'text-green-600',
            onClick: () => onConfirm(appointment)
          });
        }
        if (onStart) {
          actions.push({
            key: 'start',
            label: 'Iniciar sessão',
            icon: Play,
            color: 'text-blue-600',
            onClick: () => onStart(appointment)
          });
        }
        break;

      case 'confirmed':
        if (onStart) {
          actions.push({
            key: 'start',
            label: 'Iniciar sessão',
            icon: Play,
            color: 'text-blue-600',
            onClick: () => onStart(appointment)
          });
        }
        if (onComplete) {
          actions.push({
            key: 'complete',
            label: 'Finalizar',
            icon: CheckCircle,
            color: 'text-green-600',
            onClick: () => onComplete(appointment)
          });
        }
        break;

      case 'inProgress':
        if (onComplete) {
          actions.push({
            key: 'complete',
            label: 'Finalizar',
            icon: CheckCircle,
            color: 'text-green-600',
            onClick: () => onComplete(appointment)
          });
        }
        break;

      case 'completed':
        // Apenas ações de visualização e contato
        break;

      default:
        break;
    }

    // Ações de cancelamento (exceto para agendamentos já finalizados)
    if (appointment.status !== 'completed' && appointment.status !== 'cancelled' && onCancel) {
      actions.push({
        key: 'cancel',
        label: 'Cancelar',
        icon: XCircle,
        color: 'text-red-600',
        onClick: () => onCancel(appointment)
      });
    }

    // Marcar como falta (apenas para agendamentos confirmados ou em andamento)
    if ((appointment.status === 'confirmed' || appointment.status === 'inProgress') && onMarkNoShow) {
      actions.push({
        key: 'noShow',
        label: 'Marcar como falta',
        icon: AlertTriangle,
        color: 'text-orange-600',
        onClick: () => onMarkNoShow(appointment)
      });
    }

    // Ações de contato
    if (onContact) {
      actions.push({
        key: 'contact',
        label: 'Contatar paciente',
        icon: MessageSquare,
        color: 'text-green-600',
        onClick: () => onContact(appointment)
      });
    }

    // Ações de pagamento
    if (onPayment && appointment.paymentStatus === 'pending') {
      actions.push({
        key: 'payment',
        label: 'Gerenciar pagamento',
        icon: CreditCard,
        color: 'text-purple-600',
        onClick: () => onPayment(appointment)
      });
    }

    // Ações de edição (exceto para agendamentos finalizados)
    if (appointment.status !== 'completed' && appointment.status !== 'cancelled' && onEdit) {
      actions.push({
        key: 'edit',
        label: 'Editar',
        icon: Edit,
        color: 'text-blue-600',
        onClick: () => onEdit(appointment)
      });
    }

    // Ações de exclusão (apenas para agendamentos cancelados ou com mais de 30 dias)
    const appointmentDate = new Date(appointment.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if ((appointment.status === 'cancelled' || appointmentDate < thirtyDaysAgo) && onDelete) {
      actions.push({
        key: 'delete',
        label: 'Excluir',
        icon: Trash2,
        color: 'text-red-600',
        onClick: () => onDelete(appointment)
      });
    }

    return actions;
  };

  const handleAction = (action: any) => {
    action.onClick();
    setShowDropdown(false);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8 text-sm';
      case 'lg':
        return 'h-12 w-12 text-lg';
      default:
        return 'h-10 w-10 text-base';
    }
  };

  const getButtonSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1.5 text-sm';
    }
  };

  const actions = getAvailableActions();

  if (actions.length === 0) {
    return null;
  }

  if (variant === 'buttons') {
    return (
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.key}
              onClick={action.onClick}
              className={`
                flex items-center space-x-1 rounded-md border border-slate-300 
                bg-white hover:bg-slate-50 transition-colors
                ${getButtonSizeClasses()}
                ${action.color}
              `}
              title={action.label}
            >
              <Icon className="h-4 w-4" />
              {showLabels && <span>{action.label}</span>}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center space-x-1">
        {actions.slice(0, 3).map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.key}
              onClick={action.onClick}
              className={`
                p-1 rounded hover:bg-slate-100 transition-colors
                ${action.color}
              `}
              title={action.label}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
        {actions.length > 3 && (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1 rounded hover:bg-slate-100 transition-colors text-slate-500"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 top-8 z-10 bg-white border border-slate-200 rounded-md shadow-lg py-1 min-w-[140px]">
                {actions.slice(3).map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.key}
                      onClick={() => handleAction(action)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <Icon className="h-3 w-3" />
                      <span>{action.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Variant dropdown (padrão)
  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`
          flex items-center justify-center rounded-md border border-slate-300 
          bg-white hover:bg-slate-50 transition-colors
          ${getSizeClasses()}
        `}
      >
        <MoreVertical className="h-4 w-4 text-slate-500" />
      </button>

      {showDropdown && (
        <>
          {/* Overlay para fechar o dropdown */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute right-0 top-10 z-20 bg-white border border-slate-200 rounded-md shadow-lg py-1 min-w-[160px]">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.key}
                  onClick={() => handleAction(action)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center space-x-2"
                >
                  <Icon className={`h-3 w-3 ${action.color}`} />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default AppointmentActions;