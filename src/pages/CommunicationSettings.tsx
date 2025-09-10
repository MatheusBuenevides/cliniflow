import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Settings, 
  TestTube, 
  Save, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Shield,
  BarChart3
} from 'lucide-react';
import { communicationService } from '../services/communicationService';
import type { CommunicationConfig } from '../services/communicationService';
import { EmailComposer, TemplateSelector, MessageScheduler, CommunicationLog } from '../components/communication';

const CommunicationSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'settings' | 'templates' | 'scheduler' | 'log' | 'analytics'>('settings');
  const [settings, setSettings] = useState<CommunicationConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [testResults, setTestResults] = useState<{
    email: { success: boolean; message: string };
    sms: { success: boolean; message: string };
    whatsapp: { success: boolean; message: string };
  } | null>(null);
  const [showEmailComposer, setShowEmailComposer] = useState(false);

  // Carregar configurações
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const data = await communicationService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Salvar configurações
  const handleSaveSettings = async () => {
    if (!settings) return;

    try {
      setIsSaving(true);
      await communicationService.updateSettings(settings);
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Testar configurações
  const handleTestSettings = async () => {
    if (!settings) return;

    try {
      const results = await communicationService.testSettings(settings);
      setTestResults(results);
    } catch (error) {
      console.error('Erro ao testar configurações:', error);
      alert('Erro ao testar configurações. Tente novamente.');
    }
  };

  // Atualizar configuração
  const updateSetting = <K extends keyof CommunicationConfig>(
    key: K,
    value: CommunicationConfig[K]
  ) => {
    if (!settings) return;
    setSettings(prev => prev ? { ...prev, [key]: value } : null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-gray-600">Carregando configurações...</span>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar configurações</h3>
        <p className="text-gray-600 mb-4">Não foi possível carregar as configurações de comunicação.</p>
        <button
          onClick={loadSettings}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações de Comunicação</h1>
          <p className="text-gray-600">Gerencie templates, automações e configurações de comunicação</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleTestSettings}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <TestTube className="w-4 h-4" />
            Testar Configurações
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'settings', label: 'Configurações', icon: Settings },
            { id: 'templates', label: 'Templates', icon: Mail },
            { id: 'scheduler', label: 'Agendamento', icon: MessageSquare },
            { id: 'log', label: 'Log', icon: BarChart3 },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Resultados do Teste */}
      {testResults && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">Resultados do Teste</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-3 rounded-lg ${testResults.email.success ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                {testResults.email.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="font-medium">Email</span>
              </div>
              <p className="text-sm text-gray-600">{testResults.email.message}</p>
            </div>
            <div className={`p-3 rounded-lg ${testResults.sms.success ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                {testResults.sms.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="font-medium">SMS</span>
              </div>
              <p className="text-sm text-gray-600">{testResults.sms.message}</p>
            </div>
            <div className={`p-3 rounded-lg ${testResults.whatsapp.success ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                {testResults.whatsapp.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="font-medium">WhatsApp</span>
              </div>
              <p className="text-sm text-gray-600">{testResults.whatsapp.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo das Tabs */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Configurações de Email */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Configurações de Email
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provedor de Email
                </label>
                <select
                  value={settings.emailProvider}
                  onChange={(e) => updateSetting('emailProvider', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="sendgrid">SendGrid</option>
                  <option value="mailgun">Mailgun</option>
                  <option value="ses">AWS SES</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Remetente
                </label>
                <input
                  type="email"
                  value={settings.defaultFromEmail}
                  onChange={(e) => updateSetting('defaultFromEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="noreply@cliniflow.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Remetente
                </label>
                <input
                  type="text"
                  value={settings.defaultFromName}
                  onChange={(e) => updateSetting('defaultFromName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="CliniFlow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email de Resposta
                </label>
                <input
                  type="email"
                  value={settings.replyToEmail}
                  onChange={(e) => updateSetting('replyToEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="contato@cliniflow.com"
                />
              </div>
            </div>
          </div>

          {/* Configurações de SMS */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Configurações de SMS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provedor de SMS
                </label>
                <select
                  value={settings.smsProvider}
                  onChange={(e) => updateSetting('smsProvider', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="twilio">Twilio</option>
                  <option value="aws_sns">AWS SNS</option>
                </select>
              </div>
            </div>
          </div>

          {/* Configurações de WhatsApp */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Configurações de WhatsApp
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provedor de WhatsApp
                </label>
                <select
                  value={settings.whatsappProvider}
                  onChange={(e) => updateSetting('whatsappProvider', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="whatsapp_business">WhatsApp Business API</option>
                  <option value="twilio_whatsapp">Twilio WhatsApp</option>
                </select>
              </div>
            </div>
          </div>

          {/* Configurações de Retry */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações de Retry</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tentativas de Reenvio
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={settings.retryAttempts}
                  onChange={(e) => updateSetting('retryAttempts', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delay entre Tentativas (minutos)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.retryDelay}
                  onChange={(e) => updateSetting('retryDelay', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Configurações de Compliance */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Configurações de Compliance
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Tracking de Emails</div>
                  <div className="text-sm text-gray-600">Rastrear aberturas e cliques em emails</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableTracking}
                    onChange={(e) => updateSetting('enableTracking', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Link de Descadastro</div>
                  <div className="text-sm text-gray-600">Incluir link de descadastro em emails</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableUnsubscribe}
                    onChange={(e) => updateSetting('enableUnsubscribe', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">GDPR</div>
                    <div className="text-sm text-gray-600">Conformidade com GDPR</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.complianceSettings.gdprCompliant}
                      onChange={(e) => updateSetting('complianceSettings', {
                        ...settings.complianceSettings,
                        gdprCompliant: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">CASL</div>
                    <div className="text-sm text-gray-600">Conformidade com CASL</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.complianceSettings.canadaAntiSpam}
                      onChange={(e) => updateSetting('complianceSettings', {
                        ...settings.complianceSettings,
                        canadaAntiSpam: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">LGPD</div>
                    <div className="text-sm text-gray-600">Conformidade com LGPD</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.complianceSettings.brazilLGPD}
                      onChange={(e) => updateSetting('complianceSettings', {
                        ...settings.complianceSettings,
                        brazilLGPD: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Templates de Comunicação</h3>
            <button
              onClick={() => setShowEmailComposer(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Novo Template
            </button>
          </div>
          <TemplateSelector
            templates={[]} // TODO: Carregar templates reais
            onSelect={() => {}}
            onEdit={() => {}}
            onDelete={() => {}}
            onDuplicate={() => {}}
            onCreateNew={() => setShowEmailComposer(true)}
          />
        </div>
      )}

      {activeTab === 'scheduler' && (
        <div className="space-y-6">
          <MessageScheduler
            patients={[]} // TODO: Carregar pacientes reais
            appointments={[]} // TODO: Carregar agendamentos reais
            onSchedule={async () => {}}
            onCancel={async () => {}}
            onEdit={async () => {}}
            scheduledMessages={[]} // TODO: Carregar mensagens agendadas reais
          />
        </div>
      )}

      {activeTab === 'log' && (
        <div className="space-y-6">
          <CommunicationLog
            entries={[]} // TODO: Carregar log real
            onRefresh={async () => {}}
            onRetry={async () => {}}
            onExport={async () => {}}
          />
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <div>Analytics de Comunicação</div>
            <div className="text-sm">Em desenvolvimento</div>
          </div>
        </div>
      )}

      {/* Email Composer Modal */}
      {showEmailComposer && (
        <EmailComposer
          isOpen={showEmailComposer}
          onClose={() => setShowEmailComposer(false)}
          onSend={async () => {}}
          onSaveTemplate={async () => {}}
          templates={[]} // TODO: Carregar templates reais
          patients={[]} // TODO: Carregar pacientes reais
        />
      )}
    </div>
  );
};

export default CommunicationSettings;
