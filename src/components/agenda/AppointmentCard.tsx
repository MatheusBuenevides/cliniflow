import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  Video, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  CreditCard
} from 'lucide-react';
import type { Appointment } from '../../types';

interface AppointmentCardProps {
  appointment: Appointment;
  variant?: 'default' | 'compact' | 'detailed' | 'minimal';
  showActions?: boolean;
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (appointment: Appointment) => void;
  onConfirm?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
  onComplete?: (appointment: Appointment) => void;
  onView?: (appointment: Appointment) => void;
  onContact?: (appointment: Appointment) => void;
  onPayment?: (appointment: Appointment) => void;
  onClick?: (appointment: Appointment) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  variant = 'default',
  showActions = true,
  onEdit,
  onDelete,
  onConfirm,
  onCancel,
  onComplete,
  onView,
  onContact,
  onPayment,
  onClick
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getModalityIcon = (modality: string) => {
    return modality === 'online' ? Video : MapPin;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  const handleAction = (action: () => void) => {
    action();
    setShowMenu(false);
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'compact': return 'p-3';
      case 'detailed': return 'p-6';
      case 'minimal': return 'p-2';
      default: return 'p-4';
    }
  };

  const getTextSize = () => {
    switch (variant) {
      case 'compact': return 'text-sm';
      case 'detailed': return 'text-base';
      case 'minimal': return 'text-xs';
      default: return 'text-sm';
    }
  };

  if (variant === 'minimal') {
    return (
      <div
        className={`flex items-center space-x-3 p-2 rounded-lg border cursor-pointer hover:shadow-sm transition-all duration-200 ${getStatusColor(appointment.status)}`}
        onClick={() => onClick?.(appointment)}
      >
        <Clock className="h-4 w-4 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{appointment.patient.name}</div>
          <div className="text-xs opacity-75">{appointment.time}</div>
        </div>
        <div className={`w-2 h-2 rounded-full ${
          appointment.paymentStatus === 'paid' ? 'bg-green-500' :
          appointment.paymentStatus === 'pending' ? 'bg-yellow-500' :
          'bg-red-500'
        }`}></div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${getVariantClasses()}`}
      onClick={() => onClick?.(appointment)}
    >
      {/* Header do Card */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          {/* Data e Horário */}
          <div className="flex items-center space-x-2 mb-1">
            <Calendar className="h-4 w-4 text-slate-500" />
            <span className={`font-medium text-slate-800 ${getTextSize()}`}>
              {formatDate(appointment.date)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-slate-500" />
            <span className={`font-semibold text-slate-800 ${getTextSize()}`}>
              {formatTime(appointment.time)}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(appointment.status)}`}>
              {getStatusText(appointment.status)}
            </span>
          </div>
        </div>

        {/* Menu de Ações */}
        {showActions && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 rounded hover:bg-slate-100 transition-colors"
            >
              <MoreVertical className="h-4 w-4 text-slate-500" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-6 z-10 bg-white border border-slate-200 rounded-md shadow-lg py-1 min-w-[140px]">
                {onView && (
                  <button
                    onClick={() => handleAction(() => onView(appointment))}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center space-x-2"
                  >
                    <Eye className="h-3 w-3 text-blue-600" />
                    <span>Ver detalhes</span>
                  </button>
                )}
                
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
                
                {onContact && (
                  <button
                    onClick={() => handleAction(() => onContact(appointment))}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center space-x-2"
                  >
                    <MessageSquare className="h-3 w-3 text-green-600" />
                    <span>Contatar</span>
                  </button>
                )}
                
                {onPayment && appointment.paymentStatus === 'pending' && (
                  <button
                    onClick={() => handleAction(() => onPayment(appointment))}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center space-x-2"
                  >
                    <CreditCard className="h-3 w-3 text-purple-600" />
                    <span>Pagamento</span>
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

      {/* Informações do Paciente */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-slate-500" />
          <span className={`font-medium text-slate-800 ${getTextSize()}`}>
            {appointment.patient.name}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-slate-500" />
          <span className={`text-slate-600 ${getTextSize()}`}>
            {appointment.patient.email}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-slate-500" />
          <span className={`text-slate-600 ${getTextSize()}`}>
            {appointment.patient.phone}
          </span>
        </div>
      </div>

      {/* Detalhes da Consulta */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            {getModalityIcon(appointment.modality)}
            <span className={`text-slate-600 ${getTextSize()}`}>
              {appointment.modality === 'online' ? 'Online' : 'Presencial'}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-slate-500" />
            <span className={`text-slate-600 ${getTextSize()}`}>
              {appointment.duration}min
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`font-semibold text-slate-800 ${getTextSize()}`}>
            R$ {appointment.price}
          </div>
          <div className={`text-xs ${getPaymentStatusColor(appointment.paymentStatus)}`}>
            {getPaymentStatusText(appointment.paymentStatus)}
          </div>
        </div>
      </div>

      {/* Observações (apenas em variant detailed) */}
      {variant === 'detailed' && appointment.notes && (
        <div className="border-t border-slate-200 pt-3">
          <div className="text-sm text-slate-600">
            <span className="font-medium">Observações:</span>
            <p className="mt-1 text-slate-700">{appointment.notes}</p>
          </div>
        </div>
      )}

      {/* Indicadores de Status */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200">
        <div className="flex items-center space-x-2">
          <span className={`text-xs px-2 py-1 rounded-full ${
            appointment.type === 'initial' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
          }`}>
            {appointment.type === 'initial' ? 'Primeira consulta' : 'Retorno'}
          </span>
        </div>
        
        {appointment.videoRoomId && (
          <div className="flex items-center space-x-1 text-xs text-blue-600">
            <Video className="h-3 w-3" />
            <span>Sala virtual</span>
          </div>
        )}
      </div>
    </div>
  );
};
