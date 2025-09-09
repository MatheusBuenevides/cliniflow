import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash2, 
  MessageSquare, 
  CreditCard,
  Clock,
  AlertTriangle,
  Info
} from 'lucide-react';
import type { Appointment } from '../../types';

interface AppointmentActionsProps {
  appointment: Appointment;
  onConfirm?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
  onComplete?: (appointment: Appointment) => void;
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (appointment: Appointment) => void;
  onContact?: (appointment: Appointment) => void;
  onPayment?: (appointment: Appointment) => void;
  onReschedule?: (appointment: Appointment) => void;
  variant?: 'default' | 'compact' | 'minimal';
  showLabels?: boolean;
}

export const AppointmentActions: React.FC<AppointmentActionsProps> = ({
  appointment,
  onConfirm,
  onCancel,
  onComplete,
  onEdit,
  onDelete,
  onContact,
  onPayment,
  onReschedule,
  variant = 'default',
  showLabels = true
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [actionType, setActionType] = useState<string>('');

  const handleAction = (action: () => void, type: string) => {
    if (type === 'delete' || type === 'cancel') {
      setActionType(type);
      if (type === 'delete') {
        setShowDeleteDialog(true);
      } else {
        setShowCancelDialog(true);
      }
    } else {
      action();
    }
  };

  const confirmAction = () => {
    switch (actionType) {
      case 'delete':
        onDelete?.(appointment);
        setShowDeleteDialog(false);
        break;
      case 'cancel':
        onCancel?.(appointment);
        setShowCancelDialog(false);
        break;
    }
    setActionType('');
  };

  const getAvailableActions = () => {
    const actions = [];

    switch (appointment.status) {
      case 'scheduled':
        if (onConfirm) {
          actions.push({
            id: 'confirm',
            label: 'Confirmar',
            icon: CheckCircle,
            color: 'text-green-600 hover:bg-green-50',
            action: () => onConfirm(appointment)
          });
        }
        if (onCancel) {
          actions.push({
            id: 'cancel',
            label: 'Cancelar',
            icon: XCircle,
            color: 'text-red-600 hover:bg-red-50',
            action: () => handleAction(() => onCancel(appointment), 'cancel')
          });
        }
        break;

      case 'confirmed':
        if (onComplete) {
          actions.push({
            id: 'complete',
            label: 'Finalizar',
            icon: CheckCircle,
            color: 'text-green-600 hover:bg-green-50',
            action: () => onComplete(appointment)
          });
        }
        if (onCancel) {
          actions.push({
            id: 'cancel',
            label: 'Cancelar',
            icon: XCircle,
            color: 'text-red-600 hover:bg-red-50',
            action: () => handleAction(() => onCancel(appointment), 'cancel')
          });
        }
        break;

      case 'inProgress':
        if (onComplete) {
          actions.push({
            id: 'complete',
            label: 'Finalizar',
            icon: CheckCircle,
            color: 'text-green-600 hover:bg-green-50',
            action: () => onComplete(appointment)
          });
        }
        break;
    }

    // Ações sempre disponíveis
    if (onEdit) {
      actions.push({
        id: 'edit',
        label: 'Editar',
        icon: Edit,
        color: 'text-blue-600 hover:bg-blue-50',
        action: () => onEdit(appointment)
      });
    }

    if (onContact) {
      actions.push({
        id: 'contact',
        label: 'Contatar',
        icon: MessageSquare,
        color: 'text-green-600 hover:bg-green-50',
        action: () => onContact(appointment)
      });
    }

    if (onPayment && appointment.paymentStatus === 'pending') {
      actions.push({
        id: 'payment',
        label: 'Pagamento',
        icon: CreditCard,
        color: 'text-purple-600 hover:bg-purple-50',
        action: () => onPayment(appointment)
      });
    }

    if (onReschedule && appointment.status !== 'completed' && appointment.status !== 'cancelled') {
      actions.push({
        id: 'reschedule',
        label: 'Reagendar',
        icon: Clock,
        color: 'text-orange-600 hover:bg-orange-50',
        action: () => onReschedule(appointment)
      });
    }

    if (onDelete) {
      actions.push({
        id: 'delete',
        label: 'Excluir',
        icon: Trash2,
        color: 'text-red-600 hover:bg-red-50',
        action: () => handleAction(() => onDelete(appointment), 'delete')
      });
    }

    return actions;
  };

  const actions = getAvailableActions();

  if (actions.length === 0) {
    return null;
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'compact': return 'space-x-1';
      case 'minimal': return 'space-x-0.5';
      default: return 'space-x-2';
    }
  };

  const getButtonSize = () => {
    switch (variant) {
      case 'compact': return 'p-1.5';
      case 'minimal': return 'p-1';
      default: return 'p-2';
    }
  };

  const getIconSize = () => {
    switch (variant) {
      case 'compact': return 'h-3 w-3';
      case 'minimal': return 'h-3 w-3';
      default: return 'h-4 w-4';
    }
  };

  const getTextSize = () => {
    switch (variant) {
      case 'compact': return 'text-xs';
      case 'minimal': return 'text-xs';
      default: return 'text-sm';
    }
  };

  return (
    <>
      <div className={`flex items-center ${getVariantClasses()}`}>
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.action}
              className={`flex items-center space-x-1 rounded-md transition-colors ${getButtonSize()} ${action.color}`}
              title={action.label}
            >
              <Icon className={getIconSize()} />
              {showLabels && variant !== 'minimal' && (
                <span className={getTextSize()}>{action.label}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Dialog de Confirmação de Cancelamento */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-slate-800">
                Cancelar Agendamento
              </h3>
            </div>
            
            <p className="text-slate-600 mb-6">
              Tem certeza que deseja cancelar o agendamento de{' '}
              <strong>{appointment.patient.name}</strong> para{' '}
              <strong>{appointment.date}</strong> às{' '}
              <strong>{appointment.time}</strong>?
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Não, manter
              </button>
              <button
                onClick={confirmAction}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Sim, cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog de Confirmação de Exclusão */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-slate-800">
                Excluir Agendamento
              </h3>
            </div>
            
            <p className="text-slate-600 mb-6">
              <strong>Atenção:</strong> Esta ação não pode ser desfeita. O agendamento de{' '}
              <strong>{appointment.patient.name}</strong> será permanentemente removido.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmAction}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
