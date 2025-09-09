import React, { useState } from 'react';
import { 
  AlertTriangle, 
  X, 
  Clock, 
  User, 
  Calendar,
  MessageSquare,
  Send
} from 'lucide-react';
import type { Appointment } from '../../types';

interface CancellationModalProps {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (appointment: Appointment, reason: string, notifyPatient: boolean) => void;
}

const cancellationReasons = [
  { value: 'patient_request', label: 'Solicitação do paciente' },
  { value: 'psychologist_unavailable', label: 'Psicólogo indisponível' },
  { value: 'emergency', label: 'Emergência' },
  { value: 'weather', label: 'Condições climáticas' },
  { value: 'technical_issues', label: 'Problemas técnicos (online)' },
  { value: 'reschedule', label: 'Reagendamento' },
  { value: 'other', label: 'Outro motivo' }
];

export const CancellationModal: React.FC<CancellationModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [notifyPatient, setNotifyPatient] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedReason) return;

    setIsSubmitting(true);

    try {
      const reason = selectedReason === 'other' ? customReason : 
        cancellationReasons.find(r => r.value === selectedReason)?.label || selectedReason;
      
      await onConfirm(appointment, reason, notifyPatient);
      onClose();
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setCustomReason('');
    setNotifyPatient(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Cancelar Agendamento
                </h3>
                <p className="text-sm text-slate-600">
                  Esta ação não pode ser desfeita
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-100 rounded-md transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {/* Informações do Agendamento */}
          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-slate-800 mb-3">Detalhes do Agendamento</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-slate-500" />
                <span className="text-slate-700">{appointment.patient.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                <span className="text-slate-700">
                  {new Date(appointment.date).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-slate-500" />
                <span className="text-slate-700">{appointment.time}</span>
              </div>
            </div>
          </div>

          {/* Formulário de Cancelamento */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Motivo do Cancelamento */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Motivo do cancelamento *
              </label>
              <div className="space-y-2">
                {cancellationReasons.map((reason) => (
                  <label
                    key={reason.value}
                    className="flex items-center space-x-3 p-3 border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={reason.value}
                      checked={selectedReason === reason.value}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-slate-700">{reason.label}</span>
                  </label>
                ))}
              </div>

              {/* Campo para motivo personalizado */}
              {selectedReason === 'other' && (
                <div className="mt-3">
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Descreva o motivo do cancelamento..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>
              )}
            </div>

            {/* Notificação ao Paciente */}
            <div>
              <label className="flex items-center space-x-3 p-3 border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={notifyPatient}
                  onChange={(e) => setNotifyPatient(e.target.checked)}
                  className="text-red-600 focus:ring-red-500"
                />
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-700">
                    Notificar o paciente sobre o cancelamento
                  </span>
                </div>
              </label>
              <p className="text-xs text-slate-500 mt-1 ml-6">
                O paciente receberá um email e/ou SMS informando sobre o cancelamento
              </p>
            </div>

            {/* Aviso Importante */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Atenção:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• O agendamento será permanentemente cancelado</li>
                    <li>• O paciente poderá reagendar em outro horário</li>
                    <li>• Esta ação não pode ser desfeita</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Manter agendamento
              </button>
              
              <button
                type="submit"
                disabled={!selectedReason || (selectedReason === 'other' && !customReason.trim()) || isSubmitting}
                className={`px-6 py-2 rounded-md font-medium transition-colors flex items-center ${
                  selectedReason && (selectedReason !== 'other' || customReason.trim()) && !isSubmitting
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Cancelando...
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar Agendamento
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
