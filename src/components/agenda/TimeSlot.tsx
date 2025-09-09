import React, { useState } from 'react';
import { Clock, MapPin, Video, User, MoreVertical, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import type { Appointment, TimeSlot as TimeSlotType } from '../../types';

interface TimeSlotProps {
  appointment?: Appointment;
  timeSlot?: TimeSlotType;
  isAvailable?: boolean;
  isBlocked?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (appointment: Appointment) => void;
  onConfirm?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
  onComplete?: (appointment: Appointment) => void;
  showActions?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'compact' | 'detailed';
}

export const TimeSlot: React.FC<TimeSlotProps> = ({
  appointment,
  timeSlot,
  isAvailable = false,
  isBlocked = false,
  isSelected = false,
  onClick,
  onEdit,
  onDelete,
  onConfirm,
  onCancel,
  onComplete,
  showActions = true,
  size = 'medium',
  variant = 'default'
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 border-green-300 text-green-800';
      case 'confirmed': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'scheduled': return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'cancelled': return 'bg-red-100 border-red-300 text-red-800';
      case 'inProgress': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default: return 'bg-slate-100 border-slate-300 text-slate-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Realizada';
      case 'confirmed': return 'Confirmada';
      case 'scheduled': return 'Agendada';
      case 'cancelled': return 'Cancelada';
      case 'inProgress': return 'Em andamento';
      default: return status;
    }
  };

  const getModalityIcon = (modality: string) => {
    return modality === 'online' ? Video : MapPin;
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small': return 'p-2 text-xs';
      case 'large': return 'p-4 text-base';
      default: return 'p-3 text-sm';
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleAction = (action: () => void) => {
    action();
    setShowMenu(false);
  };

  if (appointment) {
    const ModalityIcon = getModalityIcon(appointment.modality);
    
    return (
      <div
        className={`relative rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${getStatusColor(appointment.status)} ${
          isSelected ? 'ring-2 ring-purple-500 ring-offset-2' : ''
        } ${getSizeClasses()}`}
        onClick={handleClick}
      >
        {/* Conteúdo Principal */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Horário e Status */}
            <div className="flex items-center space-x-2 mb-1">
              <Clock className="h-3 w-3 flex-shrink-0" />
              <span className="font-medium">{appointment.time}</span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                appointment.status === 'completed' ? 'bg-green-200 text-green-800' :
                appointment.status === 'confirmed' ? 'bg-blue-200 text-blue-800' :
                appointment.status === 'scheduled' ? 'bg-purple-200 text-purple-800' :
                appointment.status === 'cancelled' ? 'bg-red-200 text-red-800' :
                'bg-yellow-200 text-yellow-800'
              }`}>
                {getStatusText(appointment.status)}
              </span>
            </div>

            {/* Paciente */}
            <div className="flex items-center space-x-2 mb-1">
              <User className="h-3 w-3 flex-shrink-0" />
              <span className="font-medium truncate">{appointment.patient.name}</span>
            </div>

            {/* Modalidade e Detalhes */}
            <div className="flex items-center space-x-2 text-xs opacity-75">
              <ModalityIcon className="h-3 w-3 flex-shrink-0" />
              <span>{appointment.modality === 'online' ? 'Online' : 'Presencial'}</span>
              <span>•</span>
              <span>{appointment.duration}min</span>
              <span>•</span>
              <span>R$ {appointment.price}</span>
            </div>

            {/* Observações (apenas em variant detailed) */}
            {variant === 'detailed' && appointment.notes && (
              <div className="mt-2 text-xs opacity-75 line-clamp-2">
                {appointment.notes}
              </div>
            )}
          </div>

          {/* Menu de Ações */}
          {showActions && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1 rounded hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                <MoreVertical className="h-3 w-3" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-6 z-10 bg-white border border-slate-200 rounded-md shadow-lg py-1 min-w-[120px]">
                  {appointment.status === 'scheduled' && onConfirm && (
                    <button
                      onClick={() => handleAction(() => onConfirm(appointment))}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Confirmar</span>
                    </button>
                  )}
                  
                  {appointment.status === 'confirmed' && onComplete && (
                    <button
                      onClick={() => handleAction(() => onComplete(appointment))}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Finalizar</span>
                    </button>
                  )}
                  
                  {appointment.status !== 'completed' && appointment.status !== 'cancelled' && onCancel && (
                    <button
                      onClick={() => handleAction(() => onCancel(appointment))}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <XCircle className="h-3 w-3 text-red-600" />
                      <span>Cancelar</span>
                    </button>
                  )}
                  
                  {onEdit && (
                    <button
                      onClick={() => handleAction(() => onEdit(appointment))}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <Edit className="h-3 w-3 text-blue-600" />
                      <span>Editar</span>
                    </button>
                  )}
                  
                  {onDelete && (
                    <button
                      onClick={() => handleAction(() => onDelete(appointment))}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center space-x-2 text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Excluir</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Indicador de Pagamento */}
        {appointment.paymentStatus && (
          <div className="absolute top-2 right-2">
            <div className={`w-2 h-2 rounded-full ${
              appointment.paymentStatus === 'paid' ? 'bg-green-500' :
              appointment.paymentStatus === 'pending' ? 'bg-yellow-500' :
              'bg-red-500'
            }`} title={
              appointment.paymentStatus === 'paid' ? 'Pago' :
              appointment.paymentStatus === 'pending' ? 'Pendente' :
              'Não pago'
            }></div>
          </div>
        )}
      </div>
    );
  }

  if (timeSlot) {
    return (
      <div
        className={`rounded-lg border transition-all duration-200 ${
          isAvailable
            ? 'bg-white border-slate-200 hover:border-purple-300 hover:bg-purple-50 cursor-pointer'
            : isBlocked
            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
            : 'bg-slate-50 border-slate-100 text-slate-400'
        } ${isSelected ? 'ring-2 ring-purple-500 ring-offset-2' : ''} ${getSizeClasses()}`}
        onClick={isAvailable ? handleClick : undefined}
      >
        <div className="flex items-center space-x-2">
          <Clock className="h-3 w-3" />
          <span className="font-medium">{timeSlot.time}</span>
        </div>
        
        {isAvailable && (
          <div className="mt-1 text-xs opacity-75">
            Disponível • {timeSlot.duration}min • R$ {timeSlot.price}
          </div>
        )}
        
        {isBlocked && timeSlot.reason && (
          <div className="mt-1 text-xs">
            {timeSlot.reason}
          </div>
        )}
      </div>
    );
  }

  // Slot vazio
  return (
    <div
      className={`rounded-lg border border-slate-200 bg-slate-50 ${getSizeClasses()}`}
    >
      <div className="flex items-center space-x-2 text-slate-400">
        <Clock className="h-3 w-3" />
        <span>Horário livre</span>
      </div>
    </div>
  );
};
