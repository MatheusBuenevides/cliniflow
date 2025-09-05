import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Phone, Mail, MapPin, Edit, Trash2, Plus } from 'lucide-react';
import { Patient, Appointment } from '../types';
import { patientService } from '../services';

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const patientData = await patientService.getPatient(parseInt(id));
        setPatient(patientData);
        
        // Buscar agendamentos do paciente
        const patientAppointments = await patientService.getPatientAppointments(parseInt(id));
        setAppointments(patientAppointments);
      } catch (error) {
        console.error('Erro ao carregar dados do paciente:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Paciente não encontrado</h2>
        <button
          onClick={() => navigate('/pacientes')}
          className="text-purple-600 hover:text-purple-700"
        >
          Voltar para lista de pacientes
        </button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/pacientes')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
            <p className="text-gray-600">Detalhes do paciente</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Edit className="h-4 w-4" />
            <span>Editar</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            <Trash2 className="h-4 w-4" />
            <span>Excluir</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Pessoais */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Pessoais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{patient.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="font-medium">{patient.phone}</p>
                </div>
              </div>
              {patient.birthDate && (
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Data de Nascimento</p>
                    <p className="font-medium">{formatDate(patient.birthDate)}</p>
                  </div>
                </div>
              )}
              {patient.cpf && (
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 text-gray-400">📄</div>
                  <div>
                    <p className="text-sm text-gray-500">CPF</p>
                    <p className="font-medium">{patient.cpf}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Endereço */}
          {patient.address && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h2>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium">
                    {patient.address.street}, {patient.address.number}
                    {patient.address.complement && `, ${patient.address.complement}`}
                  </p>
                  <p className="text-gray-600">
                    {patient.address.neighborhood} - {patient.address.city}/{patient.address.state}
                  </p>
                  <p className="text-gray-600">CEP: {patient.address.zipCode}</p>
                </div>
              </div>
            </div>
          )}

          {/* Histórico Médico */}
          {patient.medicalHistory && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Histórico Médico</h2>
              <div className="space-y-3">
                {patient.medicalHistory.medications && patient.medicalHistory.medications.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Medicamentos:</p>
                    <p className="text-gray-600">{patient.medicalHistory.medications.join(', ')}</p>
                  </div>
                )}
                {patient.medicalHistory.allergies && patient.medicalHistory.allergies.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Alergias:</p>
                    <p className="text-gray-600">{patient.medicalHistory.allergies.join(', ')}</p>
                  </div>
                )}
                {patient.medicalHistory.observations && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Observações:</p>
                    <p className="text-gray-600">{patient.medicalHistory.observations}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contato de Emergência */}
          {patient.emergencyContact && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contato de Emergência</h3>
              <div className="space-y-2">
                <p className="font-medium">{patient.emergencyContact.name}</p>
                <p className="text-sm text-gray-600">{patient.emergencyContact.relationship}</p>
                <p className="text-sm text-gray-600">{patient.emergencyContact.phone}</p>
                {patient.emergencyContact.email && (
                  <p className="text-sm text-gray-600">{patient.emergencyContact.email}</p>
                )}
              </div>
            </div>
          )}

          {/* Próximos Agendamentos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Próximos Agendamentos</h3>
              <button className="flex items-center space-x-1 text-purple-600 hover:text-purple-700">
                <Plus className="h-4 w-4" />
                <span className="text-sm">Novo</span>
              </button>
            </div>
            <div className="space-y-3">
              {appointments.length > 0 ? (
                appointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-3">
                    <p className="font-medium text-sm">{formatDate(appointment.date)}</p>
                    <p className="text-sm text-gray-600">{formatTime(appointment.time)}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status === 'scheduled' ? 'Agendado' :
                       appointment.status === 'confirmed' ? 'Confirmado' :
                       appointment.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Nenhum agendamento encontrado</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
