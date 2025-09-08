import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { AppointmentForm } from '../components/agenda';

const Agenda: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showBookingForm, setShowBookingForm] = useState(false);
  const { 
    appointments, 
    isLoading, 
    error, 
    fetchAppointments, 
    clearError 
  } = useAppointmentStore();

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();

  const daysInMonth = [];
  for (let i = 1; i <= endOfMonth.getDate(); i++) {
    daysInMonth.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const today = new Date();

  useEffect(() => {
    const startDate = startOfMonth.toISOString().split('T')[0];
    const endDate = endOfMonth.toISOString().split('T')[0];
    fetchAppointments({ startDate, endDate });
  }, [currentDate, fetchAppointments]);

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
    const startDate = startOfMonth.toISOString().split('T')[0];
    const endDate = endOfMonth.toISOString().split('T')[0];
    fetchAppointments({ startDate, endDate });
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

          <AppointmentForm
            psychologistId={1} // Mock ID
            onBookingComplete={handleBookingComplete}
            onCancel={() => setShowBookingForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Agenda</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowBookingForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Agendamento</span>
          </button>
          <div className="flex items-center space-x-2">
            <button onClick={prevMonth} className="p-2 rounded-md hover:bg-slate-200">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-semibold text-slate-700 w-40 text-center">
              {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={nextMonth} className="p-2 rounded-md hover:bg-slate-200">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="grid grid-cols-7 gap-2 text-center font-semibold text-slate-500 text-sm mb-4">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => <div key={day}>{day}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array(startDay).fill(null).map((_, i) => <div key={`empty-${i}`}></div>)}
            {daysInMonth.map(day => {
              const dateString = day.toISOString().split('T')[0];
              const dayAppointments = appointments.filter(apt => apt.date === dateString);
              const isToday = day.toDateString() === today.toDateString();

              return (
                <div key={day.toString()} className={`p-2 border rounded-lg h-32 flex flex-col ${isToday ? 'border-purple-500 bg-purple-50' : 'border-slate-200'}`}>
                  <span className={`font-bold ${isToday ? 'text-purple-600' : 'text-slate-600'}`}>{day.getDate()}</span>
                  <div className="mt-1 space-y-1 overflow-y-auto">
                    {dayAppointments.map(apt => (
                      <div key={apt.id} className={`text-xs p-1 rounded ${
                        apt.status === 'completed' ? 'bg-green-200 text-green-800' :
                        apt.status === 'cancelled' ? 'bg-red-200 text-red-800' :
                        apt.status === 'confirmed' ? 'bg-blue-200 text-blue-800' :
                        'bg-purple-200 text-purple-800'
                      }`}>
                        {apt.time} - {apt.patient.name.split(' ')[0]}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Agenda;
