import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Video, 
  DollarSign,
  FileText,
  Save,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { usePatientStore } from '../../stores/usePatientStore';
import { useAppointmentStore } from '../../stores/useAppointmentStore';
import type { Appointment, AppointmentCreate, AppointmentUpdate, Patient } from '../../types';

interface AppointmentFormAdvancedProps {
  appointment?: Appointment;
  onSave?: (appointment: Appointment) => void;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
  psychologistId: number;
}

interface FormData {
  patientId: number | '';
  date: string;
  time: string;
  duration: number;
  type: 'initial' | 'followUp' | 'emergency' | 'supervision';
  modality: 'inPerson' | 'online';
  price: number;
  notes: string;
}

interface FormErrors {
  patientId?: string;
  date?: string;
  time?: string;
  duration?: string;
  price?: string;
}

export const AppointmentFormAdvanced: React.FC<AppointmentFormAdvancedProps> = ({
  appointment,
  onSave,
  onCancel,
  mode = 'create',
  psychologistId
}) => {
  const { patients, fetchPatients } = usePatientStore();
  const { createAppointment, updateAppointment } = useAppointmentStore();

  const [formData, setFormData] = useState<FormData>({
    patientId: appointment?.patientId || '',
    date: appointment?.date || '',
    time: appointment?.time || '',
    duration: appointment?.duration || 50,
    type: appointment?.type || 'initial',
    modality: appointment?.modality || 'inPerson',
    price: appointment?.price || 0,
    notes: appointment?.notes || ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.patientId) {
      newErrors.patientId = 'Selecione um paciente';
    }

    if (!formData.date) {
      newErrors.date = 'Selecione uma data';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'A data não pode ser no passado';
      }
    }

    if (!formData.time) {
      newErrors.time = 'Selecione um horário';
    }

    if (formData.duration < 15 || formData.duration > 180) {
      newErrors.duration = 'A duração deve ser entre 15 e 180 minutos';
    }

    if (formData.price < 0) {
      newErrors.price = 'O preço não pode ser negativo';
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePatientSelect = (patient: Patient) => {
    setFormData(prev => ({
      ...prev,
      patientId: patient.id,
      price: prev.price || (prev.type === 'initial' ? 150 : 120) // Preço padrão baseado no tipo
    }));
  };

  const handleTypeChange = (type: FormData['type']) => {
    setFormData(prev => ({
      ...prev,
      type,
      price: type === 'initial' ? 150 : type === 'emergency' ? 200 : 120
    }));
  };

  const handleModalityChange = (modality: FormData['modality']) => {
    setFormData(prev => ({
      ...prev,
      modality,
      price: modality === 'online' ? prev.price * 0.9 : prev.price * 1.1 // Ajuste de preço por modalidade
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        const appointmentData: AppointmentCreate = {
          patientId: formData.patientId as number,
          psychologistId,
          date: formData.date,
          time: formData.time,
          duration: formData.duration,
          type: formData.type,
          modality: formData.modality,
          price: formData.price,
          notes: formData.notes,
          status: 'scheduled',
          paymentStatus: 'pending'
        };

        const newAppointment = await createAppointment(appointmentData);
        onSave?.(newAppointment);
      } else if (appointment) {
        const appointmentData: AppointmentUpdate = {
          date: formData.date,
          time: formData.time,
          duration: formData.duration,
          type: formData.type,
          modality: formData.modality,
          price: formData.price,
          notes: formData.notes
        };

        const updatedAppointment = await updateAppointment(appointment.id, appointmentData);
        onSave?.(updatedAppointment);
      }
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPatient = patients.find(p => p.id === formData.patientId);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800">
          {mode === 'create' ? 'Novo Agendamento' : 'Editar Agendamento'}
        </h2>
        <p className="text-slate-600 mt-1">
          {mode === 'create' 
            ? 'Preencha os dados abaixo para criar um novo agendamento'
            : 'Atualize as informações do agendamento'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Seleção de Paciente */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <User className="h-4 w-4 inline mr-2" />
            Paciente *
          </label>
          <div className="relative">
            <select
              value={formData.patientId}
              onChange={(e) => handleInputChange('patientId', e.target.value ? parseInt(e.target.value) : '')}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.patientId ? 'border-red-300' : 'border-slate-300'
              }`}
              disabled={mode === 'edit'}
            >
              <option value="">Selecione um paciente</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} - {patient.email}
                </option>
              ))}
            </select>
            {errors.patientId && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.patientId}
              </p>
            )}
          </div>
          
          {selectedPatient && (
            <div className="mt-2 p-3 bg-slate-50 rounded-md">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">{selectedPatient.name}</p>
                  <p className="text-sm text-slate-600">{selectedPatient.email}</p>
                  <p className="text-sm text-slate-600">{selectedPatient.phone}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Data e Horário */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-2" />
              Data *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.date ? 'border-red-300' : 'border-slate-300'
              }`}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.date}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Clock className="h-4 w-4 inline mr-2" />
              Horário *
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.time ? 'border-red-300' : 'border-slate-300'
              }`}
            />
            {errors.time && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.time}
              </p>
            )}
          </div>
        </div>

        {/* Tipo e Modalidade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipo de Consulta
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'initial', label: 'Primeira consulta', price: 150 },
                { value: 'followUp', label: 'Retorno', price: 120 },
                { value: 'emergency', label: 'Emergência', price: 200 },
                { value: 'supervision', label: 'Supervisão', price: 100 }
              ].map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleTypeChange(type.value as FormData['type'])}
                  className={`p-3 text-left border rounded-md transition-colors ${
                    formData.type === type.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <div className="font-medium">{type.label}</div>
                  <div className="text-sm text-slate-600">R$ {type.price}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Modalidade
            </label>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleModalityChange('inPerson')}
                className={`w-full p-3 text-left border rounded-md transition-colors flex items-center space-x-3 ${
                  formData.modality === 'inPerson'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <MapPin className="h-5 w-5" />
                <div>
                  <div className="font-medium">Presencial</div>
                  <div className="text-sm text-slate-600">Consulta no consultório</div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => handleModalityChange('online')}
                className={`w-full p-3 text-left border rounded-md transition-colors flex items-center space-x-3 ${
                  formData.modality === 'online'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <Video className="h-5 w-5" />
                <div>
                  <div className="font-medium">Online</div>
                  <div className="text-sm text-slate-600">Videoconferência</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Duração e Preço */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Duração (minutos)
            </label>
            <select
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value={30}>30 minutos</option>
              <option value={45}>45 minutos</option>
              <option value={50}>50 minutos</option>
              <option value={60}>60 minutos</option>
              <option value={90}>90 minutos</option>
            </select>
            {errors.duration && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.duration}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <DollarSign className="h-4 w-4 inline mr-2" />
              Preço (R$)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.price ? 'border-red-300' : 'border-slate-300'
              }`}
              min="0"
              step="0.01"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.price}
              </p>
            )}
          </div>
        </div>

        {/* Observações */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <FileText className="h-4 w-4 inline mr-2" />
            Observações
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Observações sobre o agendamento..."
          />
        </div>

        {/* Resumo */}
        <div className="bg-slate-50 p-4 rounded-md">
          <h3 className="font-medium text-slate-800 mb-2">Resumo do Agendamento</h3>
          <div className="space-y-1 text-sm text-slate-600">
            <p><strong>Paciente:</strong> {selectedPatient?.name || 'Não selecionado'}</p>
            <p><strong>Data:</strong> {formData.date ? new Date(formData.date).toLocaleDateString('pt-BR') : 'Não selecionada'}</p>
            <p><strong>Horário:</strong> {formData.time || 'Não selecionado'}</p>
            <p><strong>Duração:</strong> {formData.duration} minutos</p>
            <p><strong>Tipo:</strong> {
              formData.type === 'initial' ? 'Primeira consulta' :
              formData.type === 'followUp' ? 'Retorno' :
              formData.type === 'emergency' ? 'Emergência' :
              'Supervisão'
            }</p>
            <p><strong>Modalidade:</strong> {formData.modality === 'inPerson' ? 'Presencial' : 'Online'}</p>
            <p><strong>Preço:</strong> R$ {formData.price.toFixed(2)}</p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <X className="h-4 w-4 inline mr-2" />
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`px-6 py-2 rounded-md font-medium transition-colors flex items-center ${
              isValid && !isSubmitting
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {mode === 'create' ? 'Criar Agendamento' : 'Salvar Alterações'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
