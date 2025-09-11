import React, { useState } from 'react';
import { 
  Clock, 
  Shield,
  Check,
  AlertTriangle,
  Globe
} from 'lucide-react';
import type { AppointmentSettings as AppointmentSettingsType } from '../../types';

interface AppointmentSettingsProps {
  settings: AppointmentSettingsType;
  onSettingsChange: (settings: AppointmentSettingsType) => void;
}

const AppointmentSettings: React.FC<AppointmentSettingsProps> = ({
  settings,
  onSettingsChange
}) => {
  const [localSettings, setLocalSettings] = useState<AppointmentSettingsType>(settings);

  const handleToggle = (field: keyof AppointmentSettingsType) => {
    const newSettings = {
      ...localSettings,
      [field]: !localSettings[field]
    };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleNumberChange = (field: keyof AppointmentSettingsType, value: number) => {
    const newSettings = {
      ...localSettings,
      [field]: value
    };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          Configurações de Agendamento
        </h3>
        <p className="text-sm text-slate-600">
          Configure as regras e políticas para agendamentos online e presenciais.
        </p>
      </div>

      {/* Booking Availability */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Globe className="h-5 w-5 text-blue-600 mr-3" />
          <h4 className="text-base font-medium text-slate-800">Disponibilidade de Agendamento</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Permitir agendamento online
              </label>
              <p className="text-xs text-slate-500">
                Pacientes podem agendar consultas online através da sua página pública
              </p>
            </div>
            <button
              onClick={() => handleToggle('allowOnlineBooking')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.allowOnlineBooking ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.allowOnlineBooking ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Confirmação automática
              </label>
              <p className="text-xs text-slate-500">
                Agendamentos são confirmados automaticamente sem necessidade de aprovação manual
              </p>
            </div>
            <button
              onClick={() => handleToggle('automaticConfirmation')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.automaticConfirmation ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.automaticConfirmation ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Time Settings */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Clock className="h-5 w-5 text-amber-600 mr-3" />
          <h4 className="text-base font-medium text-slate-800">Configurações de Tempo</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Antecedência máxima para agendamento (dias)
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={localSettings.bookingAdvanceDays}
              onChange={(e) => handleNumberChange('bookingAdvanceDays', Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              Quantos dias à frente os pacientes podem agendar
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Horas mínimas para cancelamento
            </label>
            <input
              type="number"
              min="1"
              max="168"
              value={localSettings.cancellationHours}
              onChange={(e) => handleNumberChange('cancellationHours', Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              Tempo mínimo antes da consulta para cancelar
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Intervalo entre consultas (minutos)
            </label>
            <input
              type="number"
              min="0"
              max="120"
              step="15"
              value={localSettings.bufferMinutes}
              onChange={(e) => handleNumberChange('bufferMinutes', Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              Tempo de pausa entre uma consulta e outra
            </p>
          </div>
        </div>
      </div>

      {/* Booking Policies */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Shield className="h-5 w-5 text-green-600 mr-3" />
          <h4 className="text-base font-medium text-slate-800">Políticas de Agendamento</h4>
        </div>
        
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <h5 className="text-sm font-medium text-slate-700 mb-2">Política de Cancelamento</h5>
            <p className="text-xs text-slate-600">
              Cancelamentos com menos de {localSettings.cancellationHours} horas de antecedência 
              podem estar sujeitos a cobrança de taxa de cancelamento.
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <h5 className="text-sm font-medium text-slate-700 mb-2">Política de Reagendamento</h5>
            <p className="text-xs text-slate-600">
              Reagendamentos podem ser feitos até {localSettings.cancellationHours} horas antes 
              da consulta original, sujeito à disponibilidade.
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <h5 className="text-sm font-medium text-slate-700 mb-2">Política de Faltas</h5>
            <p className="text-xs text-slate-600">
              Faltas sem aviso prévio podem resultar em cobrança integral da consulta.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Check className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 mb-1">
              Configurações Aplicadas
            </h4>
            <p className="text-xs text-blue-700">
              Suas configurações de agendamento estão ativas e serão aplicadas a todos os novos agendamentos.
            </p>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-amber-800 mb-1">
              Importante
            </h4>
            <p className="text-xs text-amber-700">
              Alterações nas políticas de cancelamento e reagendamento se aplicam apenas a novos agendamentos. 
              Consulte o Código de Ética Profissional do Psicólogo para orientações sobre políticas de cobrança.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSettings;
