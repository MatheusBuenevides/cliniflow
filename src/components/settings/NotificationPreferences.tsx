import React, { useState } from 'react';
import { 
  Bell, 
  Mail, 
  MessageCircle, 
  Clock, 
  AlertTriangle
} from 'lucide-react';
import type { NotificationSettings } from '../../types';

interface NotificationPreferencesProps {
  settings: NotificationSettings;
  onSettingsChange: (settings: NotificationSettings) => void;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  settings,
  onSettingsChange
}) => {
  const [localSettings, setLocalSettings] = useState<NotificationSettings>(settings);

  const handleToggle = (field: keyof NotificationSettings) => {
    const newSettings = {
      ...localSettings,
      [field]: !localSettings[field]
    };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleReminderHoursChange = (hours: number) => {
    const newSettings = {
      ...localSettings,
      reminderHours: hours
    };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const reminderOptions = [
    { value: 1, label: '1 hora antes' },
    { value: 2, label: '2 horas antes' },
    { value: 6, label: '6 horas antes' },
    { value: 12, label: '12 horas antes' },
    { value: 24, label: '24 horas antes' },
    { value: 48, label: '48 horas antes' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          Configurações de Notificações
        </h3>
        <p className="text-sm text-slate-600">
          Configure como e quando você deseja receber notificações sobre agendamentos e pagamentos.
        </p>
      </div>

      {/* Email Notifications */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Mail className="h-5 w-5 text-blue-600 mr-3" />
          <h4 className="text-base font-medium text-slate-800">Notificações por Email</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Lembretes de consulta por email
              </label>
              <p className="text-xs text-slate-500">
                Receba emails de lembrete antes das consultas
              </p>
            </div>
            <button
              onClick={() => handleToggle('emailReminders')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.emailReminders ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.emailReminders ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Lembretes de pagamento
              </label>
              <p className="text-xs text-slate-500">
                Notificações sobre pagamentos pendentes e recebidos
              </p>
            </div>
            <button
              onClick={() => handleToggle('paymentReminders')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.paymentReminders ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.paymentReminders ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp Notifications */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <MessageCircle className="h-5 w-5 text-green-600 mr-3" />
          <h4 className="text-base font-medium text-slate-800">Notificações por WhatsApp</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Lembretes de consulta por WhatsApp
              </label>
              <p className="text-xs text-slate-500">
                Receba mensagens de lembrete no WhatsApp
              </p>
            </div>
            <button
              onClick={() => handleToggle('whatsappReminders')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.whatsappReminders ? 'bg-green-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.whatsappReminders ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* System Notifications */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Bell className="h-5 w-5 text-purple-600 mr-3" />
          <h4 className="text-base font-medium text-slate-800">Notificações do Sistema</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Notificações internas
              </label>
              <p className="text-xs text-slate-500">
                Receba notificações dentro da plataforma
              </p>
            </div>
            <button
              onClick={() => handleToggle('systemNotifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.systemNotifications ? 'bg-purple-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.systemNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Timing Settings */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Clock className="h-5 w-5 text-amber-600 mr-3" />
          <h4 className="text-base font-medium text-slate-800">Configurações de Tempo</h4>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Enviar lembretes com quantas horas de antecedência?
            </label>
            <select
              value={localSettings.reminderHours}
              onChange={(e) => handleReminderHoursChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {reminderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-amber-800 mb-1">
              Importante sobre Privacidade
            </h4>
            <p className="text-xs text-amber-700">
              Todas as notificações são enviadas de forma segura e respeitam a LGPD. 
              Você pode alterar essas configurações a qualquer momento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;
