import React, { useState, useEffect } from 'react';
import { useVideoStore } from '../../stores/useVideoStore';
import { useAppointmentStore } from '../../stores/useAppointmentStore';
import { usePatientStore } from '../../stores/usePatientStore';
import type { Appointment, Patient } from '../../types';

interface SessionIntegrationProps {
  appointmentId: number;
  onSessionComplete?: (sessionData: any) => void;
}

export const SessionIntegration: React.FC<SessionIntegrationProps> = ({
  appointmentId,
  onSessionComplete
}) => {
  const { currentSession, getSessionReport } = useVideoStore();
  const { appointments, updateAppointment } = useAppointmentStore();
  const { patients, updatePatient } = usePatientStore();
  
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    // Buscar dados do agendamento
    const foundAppointment = appointments.find(apt => apt.id === appointmentId);
    if (foundAppointment) {
      setAppointment(foundAppointment);
      
      // Buscar dados do paciente
      const foundPatient = patients.find(p => p.id === foundAppointment.patientId);
      if (foundPatient) {
        setPatient(foundPatient);
      }
    }
  }, [appointmentId, appointments, patients]);

  // Atualizar status do agendamento quando a sessão inicia
  useEffect(() => {
    if (currentSession && appointment && currentSession.status === 'active') {
      updateAppointmentStatus('inProgress');
    }
  }, [currentSession, appointment]);

  // Atualizar status do agendamento quando a sessão termina
  useEffect(() => {
    if (currentSession && appointment && currentSession.status === 'ended') {
      handleSessionComplete();
    }
  }, [currentSession, appointment]);

  const updateAppointmentStatus = async (status: 'inProgress' | 'completed') => {
    if (!appointment) return;

    try {
      await updateAppointment(appointment.id, {
        status,
        ...(status === 'completed' && { 
          updatedAt: new Date().toISOString() 
        })
      });
    } catch (error) {
      console.error('Erro ao atualizar status do agendamento:', error);
    }
  };

  const handleSessionComplete = async () => {
    if (!appointment || !patient || !currentSession) return;

    setIsGeneratingReport(true);

    try {
      // Gerar relatório da sessão
      const sessionReport = await getSessionReport();
      
      // Atualizar agendamento como concluído
      await updateAppointmentStatus('completed');

      // Atualizar dados do paciente
      await updatePatient(patient.id, {
        lastAppointment: new Date().toISOString(),
        totalAppointments: patient.totalAppointments + 1
      });

      // Criar entrada no prontuário (simulado)
      const sessionRecord = {
        appointmentId: appointment.id,
        patientId: patient.id,
        sessionNumber: patient.totalAppointments + 1,
        date: new Date().toISOString(),
        duration: sessionReport?.duration || 0,
        mainComplaint: 'Sessão de telepsicologia',
        clinicalObservations: `Sessão realizada via telepsicologia. Duração: ${sessionReport?.duration || 0} minutos. Qualidade da conexão: ${sessionReport?.quality?.averageConnectionQuality?.video || 'boa'}.`,
        tags: ['telepsicologia', 'sessão-online'],
        isEncrypted: true,
        lastModified: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Notificar conclusão da sessão
      onSessionComplete?.({
        appointment,
        patient,
        sessionReport,
        sessionRecord
      });

      console.log('Sessão integrada com sucesso:', {
        appointment: appointment.id,
        patient: patient.id,
        duration: sessionReport?.duration,
        status: 'completed'
      });

    } catch (error) {
      console.error('Erro ao integrar sessão:', error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Componente de status da integração
  if (isGeneratingReport) {
    return (
      <div className="fixed bottom-4 right-4 bg-slate-800 text-white p-4 rounded-lg shadow-lg border border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="text-sm">Integrando sessão com prontuário...</span>
        </div>
      </div>
    );
  }

  // Componente de informações da sessão
  if (appointment && patient) {
    return (
      <div className="fixed bottom-4 right-4 bg-slate-800 text-white p-4 rounded-lg shadow-lg border border-slate-700 max-w-sm">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Sessão Ativa</h4>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          
          <div className="text-xs text-slate-300 space-y-1">
            <div className="flex justify-between">
              <span>Paciente:</span>
              <span>{patient.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Data:</span>
              <span>{new Date(appointment.date).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex justify-between">
              <span>Hora:</span>
              <span>{appointment.time}</span>
            </div>
            <div className="flex justify-between">
              <span>Modalidade:</span>
              <span className="capitalize">
                {appointment.modality === 'online' ? 'Online' : 'Presencial'}
              </span>
            </div>
          </div>

          {currentSession && (
            <div className="pt-2 border-t border-slate-600">
              <div className="text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="capitalize">
                    {currentSession.status === 'active' ? 'Ativa' : 
                     currentSession.status === 'waiting' ? 'Aguardando' : 
                     currentSession.status === 'ended' ? 'Finalizada' : 'Desconhecido'}
                  </span>
                </div>
                {currentSession.recordingEnabled && (
                  <div className="flex justify-between mt-1">
                    <span>Gravação:</span>
                    <span className="text-red-400">Ativa</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
