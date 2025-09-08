import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Edit, 
  Trash2, 
  User,
  FileText,
  CreditCard,
  Clock,
  Shield,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  PlusCircle
} from 'lucide-react';
import type { Appointment, SessionRecord } from '../types';
import { usePatientStore } from '../stores/usePatientStore';
import { useSessionStore } from '../stores/useSessionStore';
import { SessionEditor, SessionHistory } from '../components/sessions';

type TabType = 'personal' | 'history' | 'sessions' | 'financial';

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionRecord | null>(null);
  const [showSessionEditor, setShowSessionEditor] = useState(false);
  
  // Usar os stores
  const { getPatientById } = usePatientStore();
  const { 
    sessions, 
    fetchSessions, 
    createSession, 
    fetchTags 
  } = useSessionStore();
  
  // Buscar paciente pelo ID
  const patient = id ? getPatientById(parseInt(id)) : null;
  
  // Carregar dados quando o componente monta
  useEffect(() => {
    if (id) {
      fetchSessions({ patientId: parseInt(id) });
      fetchTags();
    }
  }, [id, fetchSessions, fetchTags]);
  
  // Funções para gerenciar sessões
  const handleSessionSelect = (session: SessionRecord) => {
    setSelectedSession(session);
    setShowSessionEditor(true);
  };

  const handleSessionEdit = (session: SessionRecord) => {
    setSelectedSession(session);
    setShowSessionEditor(true);
  };

  const handleSessionDelete = (sessionId: number) => {
    // A sessão já foi deletada pelo store
    if (selectedSession?.id === sessionId) {
      setSelectedSession(null);
      setShowSessionEditor(false);
    }
  };

  const handleCreateNewSession = () => {
    // Criar uma nova sessão baseada no último agendamento
    const lastAppointment = appointments[0]; // Mock - seria o último agendamento
    if (lastAppointment && patient) {
      const newSession: SessionRecord = {
        id: 0, // Será definido pelo store
        appointmentId: lastAppointment.id,
        patientId: patient.id,
        psychologistId: 1,
        sessionNumber: sessions.length + 1,
        date: lastAppointment.date,
        duration: lastAppointment.duration,
        mainComplaint: '',
        clinicalObservations: '',
        therapeuticPlan: '',
        evolution: '',
        homeworkAssigned: '',
        tags: [],
        attachments: [],
        isEncrypted: true,
        lastModified: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setSelectedSession(newSession);
      setShowSessionEditor(true);
    }
  };

  const handleSessionSave = async (session: SessionRecord) => {
    try {
      if (session.id === 0) {
        // Nova sessão
        await createSession({
          appointmentId: session.appointmentId,
          patientId: session.patientId,
          psychologistId: session.psychologistId,
          date: session.date,
          duration: session.duration,
          mainComplaint: session.mainComplaint,
          clinicalObservations: session.clinicalObservations,
          therapeuticPlan: session.therapeuticPlan,
          evolution: session.evolution,
          homeworkAssigned: session.homeworkAssigned,
          tags: session.tags,
          attachments: session.attachments
        });
      }
      
      setShowSessionEditor(false);
      setSelectedSession(null);
    } catch (error) {
      console.error('Erro ao salvar sessão:', error);
    }
  };

  const handleSessionCancel = () => {
    setShowSessionEditor(false);
    setSelectedSession(null);
  };
  
  // Mock de appointments para o paciente (simulando dados do backend)
  const [appointments] = useState<Appointment[]>([
    {
      id: 1,
      patientId: parseInt(id || '0'),
      patient: { id: parseInt(id || '0'), name: patient?.name || '', phone: patient?.phone || '', email: patient?.email || '' },
      psychologistId: 1,
      date: '2024-02-15',
      time: '10:00',
      duration: 50,
      type: 'initial',
      modality: 'inPerson',
      status: 'scheduled',
      price: 150,
      notes: 'Primeira consulta',
      paymentStatus: 'pending',
      createdAt: '2024-01-15T10:00:00.000Z',
      updatedAt: '2024-01-15T10:00:00.000Z'
    },
    {
      id: 2,
      patientId: parseInt(id || '0'),
      patient: { id: parseInt(id || '0'), name: patient?.name || '', phone: patient?.phone || '', email: patient?.email || '' },
      psychologistId: 1,
      date: '2024-01-20',
      time: '14:00',
      duration: 50,
      type: 'followUp',
      modality: 'online',
      status: 'completed',
      price: 120,
      notes: 'Sessão de acompanhamento',
      paymentStatus: 'paid',
      createdAt: '2024-01-15T10:00:00.000Z',
      updatedAt: '2024-01-20T14:00:00.000Z'
    }
  ]);

  if (!patient) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Paciente não encontrado</h2>
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


  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const maskSensitiveData = (data: string) => {
    if (!showSensitiveData) {
      return '••••••••••';
    }
    return data;
  };

  const tabs = [
    { id: 'personal' as TabType, label: 'Dados Pessoais', icon: User },
    { id: 'history' as TabType, label: 'Histórico', icon: Calendar },
    { id: 'sessions' as TabType, label: 'Prontuário', icon: BookOpen },
    { id: 'financial' as TabType, label: 'Financeiro', icon: CreditCard },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header com navegação */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/pacientes')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Ficha do Paciente</h1>
            <p className="text-slate-600">Informações completas e seguras</p>
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

      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-start space-x-6">
          {patient.avatar ? (
            <img
              src={patient.avatar}
              alt={patient.name}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-purple-600 font-semibold text-2xl">
                {getInitials(patient.name)}
              </span>
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-slate-800">{patient.name}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                patient.status === 'active' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {patient.status === 'active' ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600">{patient.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600">{patient.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600">
                  {patient.totalAppointments} consultas
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-500" />
            <span className="text-sm text-green-600 font-medium">Dados Criptografados</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navegação em Tabs */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
            {/* Tab Navigation */}
            <div className="border-b border-slate-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                      {tab.id === 'sessions' && sessions.length > 0 && (
                        <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
                          {sessions.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  {/* Controle de visualização de dados sensíveis */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-600">
                        Dados sensíveis protegidos por criptografia
                      </span>
                    </div>
                    <button
                      onClick={() => setShowSensitiveData(!showSensitiveData)}
                      className="flex items-center space-x-2 px-3 py-1 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      {showSensitiveData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span>{showSensitiveData ? 'Ocultar' : 'Mostrar'} dados</span>
                    </button>
                  </div>

                  {/* Informações Pessoais */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Informações Básicas</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-slate-600">Nome Completo</label>
                          <p className="text-slate-800">{patient.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-600">Email</label>
                          <p className="text-slate-800">{patient.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-600">Telefone</label>
                          <p className="text-slate-800">{patient.phone}</p>
                        </div>
                        {patient.birthDate && (
                          <div>
                            <label className="text-sm font-medium text-slate-600">Data de Nascimento</label>
                            <p className="text-slate-800">{formatDate(patient.birthDate)}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Documentos</h3>
                      <div className="space-y-4">
                        {patient.cpf && (
                          <div>
                            <label className="text-sm font-medium text-slate-600">CPF</label>
                            <p className="text-slate-800 font-mono">
                              {maskSensitiveData(patient.cpf)}
                            </p>
                          </div>
                        )}
                        {patient.rg && (
                          <div>
                            <label className="text-sm font-medium text-slate-600">RG</label>
                            <p className="text-slate-800 font-mono">
                              {maskSensitiveData(patient.rg)}
                            </p>
                          </div>
                        )}
                        {patient.maritalStatus && (
                          <div>
                            <label className="text-sm font-medium text-slate-600">Estado Civil</label>
                            <p className="text-slate-800">{patient.maritalStatus}</p>
                          </div>
                        )}
                        {patient.profession && (
                          <div>
                            <label className="text-sm font-medium text-slate-600">Profissão</label>
                            <p className="text-slate-800">{patient.profession}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Endereço */}
                  {patient.address && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Endereço</h3>
                      <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
                        <MapPin className="h-5 w-5 text-slate-400 mt-1" />
                        <div>
                          <p className="font-medium text-slate-800">
                            {patient.address.street}, {patient.address.number}
                            {patient.address.complement && `, ${patient.address.complement}`}
                          </p>
                          <p className="text-slate-600">
                            {patient.address.neighborhood} - {patient.address.city}/{patient.address.state}
                          </p>
                          <p className="text-slate-600">CEP: {patient.address.zipCode}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-800">Histórico Médico</h3>
                  {patient.medicalHistory ? (
                    <div className="space-y-6">
                      {patient.medicalHistory.medications && patient.medicalHistory.medications.length > 0 && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-2">Medicamentos</h4>
                          <div className="flex flex-wrap gap-2">
                            {patient.medicalHistory.medications.map((med, index) => (
                              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                {med}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {patient.medicalHistory.allergies && patient.medicalHistory.allergies.length > 0 && (
                        <div className="p-4 bg-red-50 rounded-lg">
                          <h4 className="font-medium text-red-800 mb-2">Alergias</h4>
                          <div className="flex flex-wrap gap-2">
                            {patient.medicalHistory.allergies.map((allergy, index) => (
                              <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                                {allergy}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {patient.medicalHistory.psychiatricHistory && (
                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <h4 className="font-medium text-yellow-800 mb-2">Histórico Psiquiátrico</h4>
                          <p className="text-yellow-700">{patient.medicalHistory.psychiatricHistory}</p>
                        </div>
                      )}
                      {patient.medicalHistory.observations && (
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <h4 className="font-medium text-slate-800 mb-2">Observações</h4>
                          <p className="text-slate-700">{patient.medicalHistory.observations}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">Nenhum histórico médico registrado</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'sessions' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">Prontuário Eletrônico</h3>
                      <p className="text-sm text-slate-600 mt-1">
                        Sistema seguro de registro de sessões com criptografia end-to-end
                      </p>
                    </div>
                    <button 
                      onClick={handleCreateNewSession}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Nova Sessão</span>
                    </button>
                  </div>

                  {/* Editor de Sessão */}
                  {showSessionEditor && selectedSession && (
                    <SessionEditor
                      session={selectedSession}
                      onSave={handleSessionSave}
                      onCancel={handleSessionCancel}
                    />
                  )}

                  {/* Histórico de Sessões */}
                  {!showSessionEditor && (
                    <SessionHistory
                      patientId={parseInt(id || '0')}
                      onSessionSelect={handleSessionSelect}
                      onSessionEdit={handleSessionEdit}
                      onSessionDelete={handleSessionDelete}
                    />
                  )}
                </div>
              )}

              {activeTab === 'financial' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-800">Informações Financeiras</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Status de Pagamento</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        patient.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' :
                        patient.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {patient.paymentStatus === 'paid' ? 'Em dia' :
                         patient.paymentStatus === 'pending' ? 'Pendente' : 'Não informado'}
                      </span>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Total de Consultas</h4>
                      <p className="text-2xl font-bold text-blue-600">{patient.totalAppointments}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-800 mb-2">Última Consulta</h4>
                      <p className="text-purple-600">
                        {patient.lastAppointment ? formatDate(patient.lastAppointment) : 'Nunca'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contato de Emergência */}
          {patient.emergencyContact && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Contato de Emergência</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-slate-800">{patient.emergencyContact.name}</p>
                  <p className="text-sm text-slate-600">{patient.emergencyContact.relationship}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-600">{patient.emergencyContact.phone}</span>
                </div>
                {patient.emergencyContact.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">{patient.emergencyContact.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ações Rápidas */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Ações Rápidas</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-left bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="text-blue-800 font-medium">Agendar Consulta</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-left bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <Phone className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">Contatar Paciente</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-left bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <FileText className="h-5 w-5 text-purple-600" />
                <span className="text-purple-800 font-medium">Nova Anotação</span>
              </button>
            </div>
          </div>

          {/* Próxima Consulta */}
          {patient.nextAppointment && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Próxima Consulta</h3>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">Agendada</p>
                  <p className="text-blue-800 font-semibold">
                    {formatDate(patient.nextAppointment)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
