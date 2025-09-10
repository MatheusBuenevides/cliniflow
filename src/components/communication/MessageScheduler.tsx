import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Send, X, Plus } from 'lucide-react';
import type { Patient, Appointment } from '../../types';

interface ScheduledMessage {
  id: string;
  type: 'email' | 'sms' | 'whatsapp';
  recipient: {
    name: string;
    email?: string;
    phone?: string;
  };
  subject?: string;
  content: string;
  scheduledFor: string;
  status: 'scheduled' | 'sent' | 'failed' | 'cancelled';
  trigger?: MessageTrigger;
  recurrence?: RecurrenceConfig;
  createdAt: string;
  sentAt?: string;
  errorMessage?: string;
}

interface MessageTrigger {
  type: 'appointment_reminder' | 'payment_reminder' | 'follow_up' | 'custom';
  appointmentId?: number;
  hoursBefore?: number;
  customDate?: string;
}

interface RecurrenceConfig {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  endDate?: string;
  daysOfWeek?: number[];
}

interface MessageSchedulerProps {
  patients: Patient[];
  appointments: Appointment[];
  onSchedule: (message: Omit<ScheduledMessage, 'id' | 'createdAt'>) => Promise<void>;
  onCancel: (messageId: string) => Promise<void>;
  onEdit: (messageId: string, updates: Partial<ScheduledMessage>) => Promise<void>;
  scheduledMessages: ScheduledMessage[];
}

const MessageScheduler: React.FC<MessageSchedulerProps> = ({
  patients,
  appointments,
  onSchedule,
  onCancel,
  scheduledMessages
}) => {
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [messageType, setMessageType] = useState<'email' | 'sms' | 'whatsapp'>('email');
  const [messageContent, setMessageContent] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [triggerType, setTriggerType] = useState<MessageTrigger['type']>('custom');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [hoursBefore, setHoursBefore] = useState(24);
  const [recurrence, setRecurrence] = useState<RecurrenceConfig | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);

  // Filtrar mensagens por status
  const scheduledMessagesList = scheduledMessages.filter(m => m.status === 'scheduled');
  const sentMessages = scheduledMessages.filter(m => m.status === 'sent');
  const failedMessages = scheduledMessages.filter(m => m.status === 'failed');

  // Obter mensagens do paciente selecionado (comentado para evitar warning)
  // const patientMessages = selectedPatient 
  //   ? scheduledMessages.filter(m => m.recipient.name === selectedPatient.name)
  //   : [];

  // Calcular data/hora sugerida baseada no trigger
  useEffect(() => {
    if (triggerType === 'appointment_reminder' && selectedAppointment) {
      const appointmentDate = new Date(selectedAppointment.date + 'T' + selectedAppointment.time);
      const reminderDate = new Date(appointmentDate.getTime() - (hoursBefore * 60 * 60 * 1000));
      
      setScheduledDate(reminderDate.toISOString().split('T')[0]);
      setScheduledTime(reminderDate.toTimeString().slice(0, 5));
    }
  }, [triggerType, selectedAppointment, hoursBefore]);

  // Agendar mensagem
  const handleSchedule = async () => {
    if (!selectedPatient || !messageContent || !scheduledDate || !scheduledTime) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const scheduledFor = new Date(scheduledDate + 'T' + scheduledTime).toISOString();

    const message: Omit<ScheduledMessage, 'id' | 'createdAt'> = {
      type: messageType,
      recipient: {
        name: selectedPatient.name,
        email: selectedPatient.email,
        phone: selectedPatient.phone
      },
      subject: messageSubject,
      content: messageContent,
      scheduledFor,
      status: 'scheduled',
      trigger: triggerType !== 'custom' ? {
        type: triggerType,
        appointmentId: selectedAppointment?.id,
        hoursBefore: hoursBefore
      } : undefined,
      recurrence: recurrence || undefined
    };

    setIsScheduling(true);
    try {
      await onSchedule(message);
      setShowScheduler(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao agendar mensagem:', error);
      alert('Erro ao agendar mensagem. Tente novamente.');
    } finally {
      setIsScheduling(false);
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setSelectedPatient(null);
    setMessageType('email');
    setMessageContent('');
    setMessageSubject('');
    setScheduledDate('');
    setScheduledTime('');
    setTriggerType('custom');
    setSelectedAppointment(null);
    setHoursBefore(24);
    setRecurrence(null);
  };

  // Cancelar mensagem agendada
  const handleCancel = async (messageId: string) => {
    if (confirm('Tem certeza que deseja cancelar esta mensagem?')) {
      await onCancel(messageId);
    }
  };

  // Obter ícone do tipo de mensagem
  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return '📧';
      case 'sms':
        return '📱';
      case 'whatsapp':
        return '💬';
      default:
        return '📄';
    }
  };

  // Obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Formatar data/hora
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Agendamento de Mensagens</h2>
          <p className="text-sm text-gray-600">Gerencie mensagens automáticas e lembretes</p>
        </div>
        <button
          onClick={() => setShowScheduler(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Mensagem
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Agendadas</span>
          </div>
          <div className="text-2xl font-bold text-blue-900 mt-1">
            {scheduledMessagesList.length}
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-900">Enviadas</span>
          </div>
          <div className="text-2xl font-bold text-green-900 mt-1">
            {sentMessages.length}
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <X className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-900">Falharam</span>
          </div>
          <div className="text-2xl font-bold text-red-900 mt-1">
            {failedMessages.length}
          </div>
        </div>
      </div>

      {/* Lista de Mensagens Agendadas */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Mensagens Agendadas</h3>
        {scheduledMessagesList.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <div>Nenhuma mensagem agendada</div>
            <button
              onClick={() => setShowScheduler(true)}
              className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
            >
              Agendar primeira mensagem
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {scheduledMessagesList.map(message => (
              <div key={message.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{getMessageTypeIcon(message.type)}</span>
                      <span className="font-medium text-gray-900">{message.recipient.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                        {message.status}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-1">
                      {message.subject && <div>Assunto: {message.subject}</div>}
                      <div>Agendado para: {formatDateTime(message.scheduledFor)}</div>
                      {message.trigger && (
                        <div>Trigger: {message.trigger.type.replace('_', ' ')}</div>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {message.content}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() => handleCancel(message.id)}
                      className="p-1 hover:bg-red-100 rounded transition-colors"
                      title="Cancelar"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Agendamento */}
      {showScheduler && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold">Agendar Mensagem</h3>
              </div>
              <button
                onClick={() => setShowScheduler(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulário */}
            <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Paciente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paciente *
                </label>
                <select
                  value={selectedPatient?.id || ''}
                  onChange={(e) => {
                    const patient = patients.find(p => p.id === parseInt(e.target.value));
                    setSelectedPatient(patient || null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione um paciente</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} - {patient.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tipo de Mensagem */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Mensagem *
                </label>
                <div className="flex gap-2">
                  {(['email', 'sms', 'whatsapp'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setMessageType(type)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                        messageType === type
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <span>{getMessageTypeIcon(type)}</span>
                      {type.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trigger */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Trigger
                </label>
                <select
                  value={triggerType}
                  onChange={(e) => setTriggerType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="custom">Data/Hora personalizada</option>
                  <option value="appointment_reminder">Lembrete de consulta</option>
                  <option value="payment_reminder">Lembrete de pagamento</option>
                  <option value="follow_up">Follow-up</option>
                </select>
              </div>

              {/* Consulta (se trigger for appointment_reminder) */}
              {triggerType === 'appointment_reminder' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Consulta
                  </label>
                  <select
                    value={selectedAppointment?.id || ''}
                    onChange={(e) => {
                      const appointment = appointments.find(a => a.id === parseInt(e.target.value));
                      setSelectedAppointment(appointment || null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione uma consulta</option>
                    {appointments
                      .filter(a => a.patientId === selectedPatient?.id)
                      .map(appointment => (
                        <option key={appointment.id} value={appointment.id}>
                          {new Date(appointment.date).toLocaleDateString('pt-BR')} às {appointment.time}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Horas antes (se trigger for appointment_reminder) */}
              {triggerType === 'appointment_reminder' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horas antes da consulta
                  </label>
                  <select
                    value={hoursBefore}
                    onChange={(e) => setHoursBefore(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>1 hora antes</option>
                    <option value={2}>2 horas antes</option>
                    <option value={24}>24 horas antes</option>
                    <option value={48}>48 horas antes</option>
                    <option value={168}>1 semana antes</option>
                  </select>
                </div>
              )}

              {/* Data e Hora */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data *
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora *
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Assunto (apenas para email) */}
              {messageType === 'email' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assunto
                  </label>
                  <input
                    type="text"
                    value={messageSubject}
                    onChange={(e) => setMessageSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Assunto do email"
                  />
                </div>
              )}

              {/* Conteúdo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conteúdo *
                </label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Digite o conteúdo da mensagem..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 p-6 border-t">
              <button
                onClick={() => setShowScheduler(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSchedule}
                disabled={isScheduling}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                {isScheduling ? 'Agendando...' : 'Agendar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageScheduler;
