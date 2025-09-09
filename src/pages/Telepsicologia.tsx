import React, { useState } from 'react';
import { SessionManager } from '../components/sessions';
import { InfoCard } from '../components/ui';

const Telepsicologia: React.FC = () => {
  const [showSession, setShowSession] = useState(false);
  const [sessionType, setSessionType] = useState<'psychologist' | 'patient'>('psychologist');
  const [appointmentId] = useState(123); // Mock appointment ID

  const handleStartSession = (type: 'psychologist' | 'patient') => {
    setSessionType(type);
    setShowSession(true);
  };

  const handleEndSession = () => {
    setShowSession(false);
  };

  if (showSession) {
    return (
      <SessionManager
        appointmentId={appointmentId}
        isPsychologist={sessionType === 'psychologist'}
        onSessionEnd={handleEndSession}
      />
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Telepsicologia
        </h1>
        <p className="text-slate-600">
          Sistema completo de videoconferência para sessões de psicologia online
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <InfoCard
          icon="video"
          title="Sessões Hoje"
          value="12"
          subtitle="+3 vs ontem"
        />
        <InfoCard
          icon="clock"
          title="Tempo Médio"
          value="45 min"
          subtitle="Por sessão"
        />
        <InfoCard
          icon="users"
          title="Pacientes Ativos"
          value="28"
          subtitle="Este mês"
        />
        <InfoCard
          icon="wifi"
          title="Qualidade"
          value="98%"
          subtitle="Conexões estáveis"
        />
      </div>

      {/* Demonstração do Sistema */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Demonstração do Sistema
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Teste o sistema de telepsicologia simulando uma sessão real. 
            Escolha o tipo de usuário para experimentar diferentes perspectivas.
          </p>
        </div>

        {/* Opções de Demonstração */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Psicólogo */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Perspectiva do Psicólogo
              </h3>
              <p className="text-slate-600 mb-6">
                Experimente como psicólogo: inicie sessões, gerencie participantes, 
                grave sessões e acesse controles avançados.
              </p>
              <button
                onClick={() => handleStartSession('psychologist')}
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Iniciar como Psicólogo
              </button>
            </div>
          </div>

          {/* Paciente */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Perspectiva do Paciente
              </h3>
              <p className="text-slate-600 mb-6">
                Experimente como paciente: entre na sala de espera, 
                participe da sessão e use o chat integrado.
              </p>
              <button
                onClick={() => handleStartSession('patient')}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Entrar como Paciente
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recursos do Sistema */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
          Recursos da Telepsicologia
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Vídeo HD */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Vídeo HD
            </h3>
            <p className="text-slate-600">
              Qualidade de vídeo adaptativa até 1080p com otimização automática da conexão.
            </p>
          </div>

          {/* Áudio Cristalino */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Áudio Cristalino
            </h3>
            <p className="text-slate-600">
              Tecnologia de cancelamento de ruído e compressão inteligente para áudio perfeito.
            </p>
          </div>

          {/* Chat Integrado */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Chat Integrado
            </h3>
            <p className="text-slate-600">
              Mensagens em tempo real durante a sessão para complementar a comunicação.
            </p>
          </div>

          {/* Gravação Segura */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Gravação Segura
            </h3>
            <p className="text-slate-600">
              Gravação opcional com consentimento e criptografia end-to-end.
            </p>
          </div>

          {/* Sala de Espera */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Sala de Espera
            </h3>
            <p className="text-slate-600">
              Ambiente controlado onde pacientes aguardam o início da sessão.
            </p>
          </div>

          {/* Criptografia */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Criptografia Total
            </h3>
            <p className="text-slate-600">
              Todas as comunicações são criptografadas seguindo padrões médicos.
            </p>
          </div>
        </div>
      </div>

      {/* Conformidade e Segurança */}
      <div className="mt-12 bg-slate-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Conformidade e Segurança
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Resoluções do CFP
            </h3>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Resolução CFP nº 11/2018 - Telepsicologia</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Resolução CFP nº 12/2013 - Prontuário Eletrônico</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Resolução CFP nº 02/2003 - Código de Ética</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Segurança de Dados
            </h3>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Conformidade com LGPD</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Criptografia end-to-end</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Auditoria de acessos</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Backup seguro e criptografado</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Telepsicologia;