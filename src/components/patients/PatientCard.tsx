import React from 'react';
import { 
  Phone, 
  Mail, 
  Calendar,  
  FileText, 
  MessageCircle, 
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import type { Patient, PaymentStatus } from '../../types/patient';

interface PatientCardProps {
  patient: Patient;
  onViewRecord: (patient: Patient) => void;
  onSchedule: (patient: Patient) => void;
  onContact: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  onViewRecord,
  onSchedule,
  onContact,
  onEdit
}) => {
  const getPaymentStatusInfo = (status?: PaymentStatus) => {
    switch (status) {
      case 'paid':
        return { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle, text: 'Pago' };
      case 'pending':
        return { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock, text: 'Pendente' };
      case 'cancelled':
        return { color: 'text-red-600', bg: 'bg-red-100', icon: XCircle, text: 'Cancelado' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100', icon: Clock, text: 'Não informado' };
    }
  };

  const getStatusInfo = (status: 'active' | 'inactive') => {
    return status === 'active' 
      ? { color: 'text-green-600', bg: 'bg-green-100', text: 'Ativo' }
      : { color: 'text-gray-600', bg: 'bg-gray-100', text: 'Inativo' };
  };

  const paymentInfo = getPaymentStatusInfo(patient.paymentStatus);
  const statusInfo = getStatusInfo(patient.status);
  const PaymentIcon = paymentInfo.icon;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200">
      {/* Header com avatar e status */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {patient.avatar ? (
              <img
                src={patient.avatar}
                alt={patient.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 font-semibold text-lg">
                  {getInitials(patient.name)}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-slate-800">{patient.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                  {statusInfo.text}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentInfo.bg} ${paymentInfo.color} flex items-center space-x-1`}>
                  <PaymentIcon size={12} />
                  <span>{paymentInfo.text}</span>
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onEdit(patient)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Informações de contato */}
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-3 text-slate-600">
          <Phone size={16} className="text-slate-400" />
          <span className="text-sm">{patient.phone}</span>
        </div>
        <div className="flex items-center space-x-3 text-slate-600">
          <Mail size={16} className="text-slate-400" />
          <span className="text-sm">{patient.email}</span>
        </div>
        
        {/* Informações de consultas */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-3">
            <Calendar size={16} className="text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Última consulta</p>
              <p className="text-sm font-medium text-slate-800">
                {formatDate(patient.lastAppointment)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FileText size={16} className="text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Total consultas</p>
              <p className="text-sm font-medium text-slate-800">
                {patient.totalAppointments}
              </p>
            </div>
          </div>
        </div>

        {/* Próxima consulta */}
        {patient.nextAppointment && (
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <Clock size={16} className="text-blue-500" />
            <div>
              <p className="text-xs text-blue-600 font-medium">Próxima consulta</p>
              <p className="text-sm text-blue-800">
                {formatDate(patient.nextAppointment)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Ações rápidas */}
      <div className="p-6 pt-0">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onViewRecord(patient)}
            className="flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <FileText size={16} />
            <span>Prontuário</span>
          </button>
          <button
            onClick={() => onSchedule(patient)}
            className="flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Calendar size={16} />
            <span>Agendar</span>
          </button>
          <button
            onClick={() => onContact(patient)}
            className="flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <MessageCircle size={16} />
            <span>Contato</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientCard;
