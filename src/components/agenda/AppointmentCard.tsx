import React from 'react';
import { 
  Clock, 
  MapPin, 
  Video, 
  User, 
  Phone, 
  Mail, 
  Calendar as CalendarIcon
} from 'lucide-react';
import type { Appointment } from '../../types';
import { StatusBadge } from './StatusBadge';
import { AppointmentActions } from './AppointmentActions';

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
        className="flex items-center space-x-3 p-2 rounded-lg border cursor-pointer hover:shadow-sm transition-all duration-200 bg-slate-100"
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
            <CalendarIcon className="h-4 w-4 text-slate-500" />
            <span className={`font-medium text-slate-800 ${getTextSize()}`}>
              {formatDate(appointment.date)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-slate-500" />
            <span className={`font-semibold text-slate-800 ${getTextSize()}`}>
              {formatTime(appointment.time)}
            </span>
            <StatusBadge status={appointment.status} size="sm" />
          </div>
        </div>

        {/* Menu de Ações */}
        {showActions && (
          <div onClick={(e) => e.stopPropagation()}>
            <AppointmentActions
              appointment={appointment}
              onEdit={onEdit}
              onDelete={onDelete}
              onConfirm={onConfirm}
              onCancel={onCancel}
              onComplete={onComplete}
              onView={onView}
              onContact={onContact}
              onPayment={onPayment}
              variant="dropdown"
              size="md"
            />
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
            {appointment.modality === 'online' ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
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
          <StatusBadge status={appointment.paymentStatus} type="payment" size="sm" />
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
