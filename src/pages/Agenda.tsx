import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { 
  AppointmentForm, 
  Calendar, 
  AppointmentFormAdvanced,
  CancellationModal,
  AppointmentCard
} from '../components/agenda';
import type { Appointment } from '../types';

const Agenda: React.FC = () => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const { 
    appointments, 
    isLoading, 
    error, 
    fetchAppointments, 
    clearError,
    updateAppointment,
    cancelAppointment,
    confirmAppointment,
    completeAppointment
  } = useAppointmentStore();

  useEffect(() => {
    // Carregar agendamentos dos próximos 30 dias
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30);
    
    fetchAppointments({ 
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });
  }, [fetchAppointments]);

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
          <button 
            onClick={clearError}
            className="ml-2 text-red-800 underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const handleBookingComplete = (appointment: any) => {
    console.log('Agendamento criado:', appointment);
    setShowBookingForm(false);
    // Recarregar a agenda
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30);
    
    fetchAppointments({ 
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    // Aqui você pode abrir um modal ou navegar para detalhes do agendamento
    console.log('Agendamento selecionado:', appointment);
  };

  const handleSlotClick = (date: string, time: string) => {
    console.log('Slot selecionado:', date, time);
    setShowBookingForm(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowEditForm(true);
  };

  const handleCancelAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowCancellationModal(true);
  };

  const handleConfirmAppointment = async (appointment: Appointment) => {
    try {
      await confirmAppointment(appointment.id);
      await refreshAppointments();
    } catch (error) {
      console.error('Erro ao confirmar agendamento:', error);
    }
  };

  const handleCompleteAppointment = async (appointment: Appointment) => {
    try {
      await completeAppointment(appointment.id);
      await refreshAppointments();
    } catch (error) {
      console.error('Erro ao finalizar agendamento:', error);
    }
  };

  const handleCancellationConfirm = async (appointment: Appointment, reason: string, notifyPatient: boolean) => {
    try {
      await cancelAppointment(appointment.id, reason);
      await refreshAppointments();
      setShowCancellationModal(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
    }
  };

  const refreshAppointments = async () => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30);
    
    await fetchAppointments({ 
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });
  };

  if (showBookingForm) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-6">
            <button
              onClick={() => setShowBookingForm(false)}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar para Agenda</span>
            </button>
            <h1 className="text-3xl font-bold text-slate-800">Novo Agendamento</h1>
            <p className="text-slate-600 mt-2">
              Preencha os dados abaixo para agendar uma nova consulta
            </p>
          </div>

          <AppointmentFormAdvanced
            mode="create"
            psychologistId={1} // Mock ID
            onSave={(appointment) => {
              console.log('Agendamento criado:', appointment);
              setShowBookingForm(false);
              refreshAppointments();
            }}
            onCancel={() => setShowBookingForm(false)}
          />
        </div>
      </div>
    );
  }

  if (showEditForm && selectedAppointment) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-6">
            <button
              onClick={() => {
                setShowEditForm(false);
                setSelectedAppointment(null);
              }}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar para Agenda</span>
            </button>
            <h1 className="text-3xl font-bold text-slate-800">Editar Agendamento</h1>
            <p className="text-slate-600 mt-2">
              Atualize as informações do agendamento
            </p>
          </div>

          <AppointmentFormAdvanced
            appointment={selectedAppointment}
            mode="edit"
            psychologistId={1} // Mock ID
            onSave={(appointment) => {
              console.log('Agendamento atualizado:', appointment);
              setShowEditForm(false);
              setSelectedAppointment(null);
              refreshAppointments();
            }}
            onCancel={() => {
              setShowEditForm(false);
              setSelectedAppointment(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header da Agenda */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Agenda</h1>
          <p className="text-slate-600 mt-1">
            Gerencie seus agendamentos e visualize sua agenda de forma intuitiva
          </p>
        </div>
        <button
          onClick={() => setShowBookingForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Agendamento</span>
        </button>
      </div>

      {/* Calendário Avançado */}
      <Calendar
        appointments={appointments}
        onSlotClick={handleSlotClick}
        onAppointmentClick={handleAppointmentClick}
        availableSlots={[]}
        blockedSlots={[]}
      />

      {/* Modal de Cancelamento */}
      {selectedAppointment && (
        <CancellationModal
          appointment={selectedAppointment}
          isOpen={showCancellationModal}
          onClose={() => {
            setShowCancellationModal(false);
            setSelectedAppointment(null);
          }}
          onConfirm={handleCancellationConfirm}
        />
      )}
    </div>
  );
};

export default Agenda;
