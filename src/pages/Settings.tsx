import React, { useState } from 'react';
import { 
  User, 
  Clock, 
  DollarSign, 
  Bell, 
  Calendar, 
  CreditCard, 
  Shield,
  Settings as SettingsIcon,
  Check
} from 'lucide-react';
import { 
  ProfileForm, 
  WorkingHoursConfig, 
  PriceConfiguration,
  NotificationPreferences,
  AppointmentSettings as AppointmentSettingsComponent,
  PaymentSettings as PaymentSettingsComponent,
  PrivacySettings as PrivacySettingsComponent
} from '../components/settings';
import { useSettingsStore } from '../stores/useSettingsStore';
import type { Psychologist, WorkingHours, SessionPrices, NotificationSettings, AppointmentSettings, PaymentSettings, PrivacySettings } from '../types';

type SettingsTab = 'profile' | 'schedule' | 'pricing' | 'notifications' | 'appointments' | 'payments' | 'privacy';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const {
    settings,
    updateProfile,
    updateWorkingHours,
    updateSessionPrices,
    updateNotificationSettings,
    updateAppointmentSettings,
    updatePaymentSettings,
    updatePrivacySettings,
    isLoading,
    error
  } = useSettingsStore();

  const tabs = [
    { id: 'profile' as const, label: 'Perfil', icon: User },
    { id: 'schedule' as const, label: 'Horários', icon: Clock },
    { id: 'pricing' as const, label: 'Preços', icon: DollarSign },
    { id: 'notifications' as const, label: 'Notificações', icon: Bell },
    { id: 'appointments' as const, label: 'Agendamentos', icon: Calendar },
    { id: 'payments' as const, label: 'Pagamentos', icon: CreditCard },
    { id: 'privacy' as const, label: 'Privacidade', icon: Shield }
  ];

  const handleProfileChange = (profile: Psychologist) => {
    updateProfile(profile);
    setHasUnsavedChanges(false);
  };

  const handleWorkingHoursChange = (workingHours: WorkingHours) => {
    updateWorkingHours(workingHours);
    setHasUnsavedChanges(false);
  };

  const handlePricesChange = (prices: SessionPrices) => {
    updateSessionPrices(prices);
    setHasUnsavedChanges(false);
  };

  const handleNotificationSettingsChange = (notificationSettings: NotificationSettings) => {
    updateNotificationSettings(notificationSettings);
    setHasUnsavedChanges(false);
  };

  const handleAppointmentSettingsChange = (appointmentSettings: AppointmentSettings) => {
    updateAppointmentSettings(appointmentSettings);
    setHasUnsavedChanges(false);
  };

  const handlePaymentSettingsChange = (paymentSettings: PaymentSettings) => {
    updatePaymentSettings(paymentSettings);
    setHasUnsavedChanges(false);
  };

  const handlePrivacySettingsChange = (privacySettings: PrivacySettings) => {
    updatePrivacySettings(privacySettings);
    setHasUnsavedChanges(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileForm
            psychologist={settings.psychologist}
            onProfileChange={handleProfileChange}
          />
        );
      
      case 'schedule':
        return (
          <WorkingHoursConfig
            workingHours={settings.psychologist.workingHours}
            onWorkingHoursChange={handleWorkingHoursChange}
          />
        );
      
      case 'pricing':
        return (
          <PriceConfiguration
            sessionPrices={settings.psychologist.sessionPrices}
            onPricesChange={handlePricesChange}
          />
        );
      
      case 'notifications':
        return (
          <NotificationPreferences
            settings={settings.notifications}
            onSettingsChange={handleNotificationSettingsChange}
          />
        );
      
      case 'appointments':
        return (
          <AppointmentSettingsComponent
            settings={settings.appointment}
            onSettingsChange={handleAppointmentSettingsChange}
          />
        );
      
      case 'payments':
        return (
          <PaymentSettingsComponent
            settings={settings.payment}
            onSettingsChange={handlePaymentSettingsChange}
          />
        );
      
      case 'privacy':
        return (
          <PrivacySettingsComponent
            settings={settings.privacy}
            onSettingsChange={handlePrivacySettingsChange}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Configurações</h1>
          <p className="text-slate-600 mt-1">
            Gerencie suas configurações e preferências do sistema
          </p>
        </div>
        
        {hasUnsavedChanges && (
          <div className="flex items-center px-3 py-2 bg-amber-100 text-amber-800 rounded-lg">
            <span className="text-sm font-medium">Alterações não salvas</span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-slate-200 rounded-lg">
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-slate-600">Carregando...</span>
                </div>
              ) : (
                renderTabContent()
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-slate-800">Ações Rápidas</h4>
            <p className="text-xs text-slate-600">Ferramentas úteis para gerenciar sua conta</p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              <SettingsIcon size={16} className="mr-2" />
              Exportar Configurações
            </button>
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              <Check size={16} className="mr-2" />
              Salvar Tudo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
