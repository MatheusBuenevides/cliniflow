import React, { useState } from 'react';
import { 
  Shield, 
  Database, 
  Lock, 
  Eye,
  Download,
  Trash2,
  AlertTriangle,
  Check,
  Clock,
  HardDrive
} from 'lucide-react';
import type { PrivacySettings as PrivacySettingsType } from '../../types';

interface PrivacySettingsProps {
  settings: PrivacySettingsType;
  onSettingsChange: (settings: PrivacySettingsType) => void;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  settings,
  onSettingsChange
}) => {
  const [localSettings, setLocalSettings] = useState<PrivacySettingsType>(settings);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleToggle = (field: keyof PrivacySettingsType) => {
    const newSettings = {
      ...localSettings,
      [field]: !localSettings[field]
    };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleNumberChange = (field: keyof PrivacySettingsType, value: number) => {
    const newSettings = {
      ...localSettings,
      [field]: value
    };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleBackupFrequencyChange = (frequency: 'daily' | 'weekly' | 'monthly') => {
    const newSettings = {
      ...localSettings,
      backupFrequency: frequency
    };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleExportData = () => {
    // Simular exportação de dados
    const data = {
      timestamp: new Date().toISOString(),
      settings: localSettings,
      message: 'Dados exportados conforme LGPD'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cliniFlow-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowExportModal(false);
  };

  const handleDeleteData = () => {
    // Simular exclusão de dados
    alert('Funcionalidade de exclusão será implementada com confirmação de segurança.');
    setShowDeleteModal(false);
  };

  const retentionOptions = [
    { value: 6, label: '6 meses' },
    { value: 12, label: '12 meses' },
    { value: 24, label: '24 meses' },
    { value: 36, label: '36 meses' },
    { value: 60, label: '60 meses' }
  ];

  const backupFrequencies = [
    { value: 'daily' as const, label: 'Diário', description: 'Backup todos os dias às 02:00' },
    { value: 'weekly' as const, label: 'Semanal', description: 'Backup toda segunda-feira às 02:00' },
    { value: 'monthly' as const, label: 'Mensal', description: 'Backup no primeiro dia do mês às 02:00' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          Configurações de Privacidade e Segurança
        </h3>
        <p className="text-sm text-slate-600">
          Gerencie a privacidade, segurança e retenção dos dados dos seus pacientes.
        </p>
      </div>

      {/* Data Encryption */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Lock className="h-5 w-5 text-green-600 mr-3" />
          <h4 className="text-base font-medium text-slate-800">Criptografia de Dados</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Criptografia end-to-end ativada
              </label>
              <p className="text-xs text-slate-500">
                Dados sensíveis dos pacientes são criptografados antes do armazenamento
              </p>
            </div>
            <div className="flex items-center">
              <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full mr-3">
                <Check className="h-3 w-3 mr-1" />
                <span className="text-xs font-medium">Ativo</span>
              </div>
              <button
                onClick={() => handleToggle('encryptionEnabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.encryptionEnabled ? 'bg-green-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.encryptionEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <Shield className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
              <div>
                <h5 className="text-sm font-medium text-green-800 mb-1">
                  Proteção de Dados Sensíveis
                </h5>
                <p className="text-xs text-green-700">
                  Prontuários, anotações clínicas e dados pessoais são criptografados usando 
                  algoritmos AES-256, garantindo máxima segurança.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Retention */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Clock className="h-5 w-5 text-amber-600 mr-3" />
          <h4 className="text-base font-medium text-slate-800">Retenção de Dados</h4>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Período de retenção de dados (LGPD)
            </label>
            <select
              value={localSettings.dataRetentionMonths}
              onChange={(e) => handleNumberChange('dataRetentionMonths', Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              {retentionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">
              Dados serão automaticamente excluídos após este período, conforme LGPD
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
              <div>
                <h5 className="text-sm font-medium text-amber-800 mb-1">
                  Importante sobre Retenção
                </h5>
                <p className="text-xs text-amber-700">
                  O período de retenção deve seguir as diretrizes do CFP e LGPD. 
                  Dados de prontuários podem ter períodos de retenção específicos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Eye className="h-5 w-5 text-blue-600 mr-3" />
          <h4 className="text-base font-medium text-slate-800">Log de Auditoria</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Registro de acessos ativado
              </label>
              <p className="text-xs text-slate-500">
                Todas as ações nos prontuários são registradas para auditoria
              </p>
            </div>
            <button
              onClick={() => handleToggle('auditLogEnabled')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.auditLogEnabled ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.auditLogEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {localSettings.auditLogEnabled && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Eye className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h5 className="text-sm font-medium text-blue-800 mb-1">
                    Logs Registrados
                  </h5>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Acessos aos prontuários</li>
                    <li>• Criação e edição de sessões</li>
                    <li>• Exportação de dados</li>
                    <li>• Alterações de configurações</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backup Settings */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <HardDrive className="h-5 w-5 text-purple-600 mr-3" />
          <h4 className="text-base font-medium text-slate-800">Backup Automático</h4>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Frequência de backup
            </label>
            <div className="space-y-2">
              {backupFrequencies.map((freq) => (
                <div
                  key={freq.value}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    localSettings.backupFrequency === freq.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => handleBackupFrequencyChange(freq.value)}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="backupFrequency"
                      checked={localSettings.backupFrequency === freq.value}
                      onChange={() => handleBackupFrequencyChange(freq.value)}
                      className="mr-3"
                    />
                    <div>
                      <h5 className="text-sm font-medium text-slate-800">{freq.label}</h5>
                      <p className="text-xs text-slate-500">{freq.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Database className="h-5 w-5 text-slate-600 mr-3" />
          <h4 className="text-base font-medium text-slate-800">Gerenciamento de Dados</h4>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center justify-center px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Download className="h-4 w-4 text-slate-600 mr-2" />
              <span className="text-sm font-medium text-slate-700">Exportar Dados</span>
            </button>
            
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center justify-center px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Excluir Dados</span>
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h5 className="text-sm font-medium text-slate-700 mb-2">Direitos do Titular (LGPD)</h5>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>• Acesso aos dados pessoais</li>
              <li>• Correção de dados incompletos ou inexatos</li>
              <li>• Anonimização, bloqueio ou eliminação</li>
              <li>• Portabilidade dos dados</li>
              <li>• Revogação do consentimento</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Compliance Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-green-800 mb-1">
              Conformidade Regulatória
            </h4>
            <p className="text-xs text-green-700">
              Suas configurações estão em conformidade com a LGPD e as resoluções do CFP 
              sobre proteção de dados e prontuário eletrônico.
            </p>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Exportar Dados</h3>
            <p className="text-sm text-slate-600 mb-6">
              Você está prestes a exportar todos os seus dados conforme a LGPD. 
              O arquivo será baixado em formato JSON.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleExportData}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Exportar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Excluir Dados</h3>
            <p className="text-sm text-slate-600 mb-6">
              <strong>Atenção:</strong> Esta ação é irreversível. Todos os dados dos pacientes 
              e configurações serão permanentemente excluídos.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteData}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacySettings;
