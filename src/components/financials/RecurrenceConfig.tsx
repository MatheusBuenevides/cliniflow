import React, { useState, useEffect } from 'react';
import { 
  Repeat, 
  AlertCircle,
  Info
} from 'lucide-react';
import type { RecurrenceConfig as RecurrenceConfigType } from '../../types';

interface RecurrenceConfigProps {
  config?: RecurrenceConfigType;
  onChange: (config: RecurrenceConfigType | null) => void;
  disabled?: boolean;
}

const FREQUENCY_OPTIONS = [
  { 
    value: 'daily', 
    label: 'Diário', 
    description: 'Repetir todos os dias',
    icon: '📅'
  },
  { 
    value: 'weekly', 
    label: 'Semanal', 
    description: 'Repetir semanalmente',
    icon: '📆'
  },
  { 
    value: 'monthly', 
    label: 'Mensal', 
    description: 'Repetir mensalmente',
    icon: '🗓️'
  },
  { 
    value: 'yearly', 
    label: 'Anual', 
    description: 'Repetir anualmente',
    icon: '📅'
  }
];

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo', short: 'Dom' },
  { value: 1, label: 'Segunda', short: 'Seg' },
  { value: 2, label: 'Terça', short: 'Ter' },
  { value: 3, label: 'Quarta', short: 'Qua' },
  { value: 4, label: 'Quinta', short: 'Qui' },
  { value: 5, label: 'Sexta', short: 'Sex' },
  { value: 6, label: 'Sábado', short: 'Sáb' }
];

const MONTH_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export const RecurrenceConfig: React.FC<RecurrenceConfigProps> = ({
  config,
  onChange,
  disabled = false
}) => {
  const [isEnabled, setIsEnabled] = useState(!!config);
  const [recurrenceData, setRecurrenceData] = useState<RecurrenceConfigType>({
    frequency: 'monthly',
    interval: 1,
    endDate: '',
    maxOccurrences: undefined,
    daysOfWeek: [],
    dayOfMonth: 1,
    isActive: true,
    ...config
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEnabled) {
      onChange(recurrenceData);
    } else {
      onChange(null);
    }
  }, [isEnabled, recurrenceData, onChange]);

  const updateRecurrenceData = (updates: Partial<RecurrenceConfigType>) => {
    setRecurrenceData(prev => ({ ...prev, ...updates }));
    setErrors({});
  };

  const validateConfig = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (recurrenceData.interval < 1) {
      newErrors.interval = 'Intervalo deve ser maior que zero';
    }

    if (recurrenceData.frequency === 'weekly' && recurrenceData.daysOfWeek?.length === 0) {
      newErrors.daysOfWeek = 'Selecione pelo menos um dia da semana';
    }

    if (recurrenceData.frequency === 'monthly' && !recurrenceData.dayOfMonth) {
      newErrors.dayOfMonth = 'Selecione um dia do mês';
    }

    if (recurrenceData.endDate && recurrenceData.maxOccurrences) {
      newErrors.endCondition = 'Selecione apenas uma condição de fim (data ou número de ocorrências)';
    }

    if (recurrenceData.maxOccurrences && recurrenceData.maxOccurrences < 1) {
      newErrors.maxOccurrences = 'Número de ocorrências deve ser maior que zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFrequencyChange = (frequency: string) => {
    const updates: Partial<RecurrenceConfigType> = { frequency: frequency as any };
    
    // Limpar configurações específicas quando mudar a frequência
    if (frequency !== 'weekly') {
      updates.daysOfWeek = [];
    }
    if (frequency !== 'monthly') {
      updates.dayOfMonth = undefined;
    }
    
    updateRecurrenceData(updates);
  };

  const handleDayOfWeekToggle = (day: number) => {
    const currentDays = recurrenceData.daysOfWeek || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    
    updateRecurrenceData({ daysOfWeek: newDays });
  };

  const getNextOccurrences = (): string[] => {
    if (!isEnabled || !validateConfig()) return [];

    const occurrences: string[] = [];
    const startDate = new Date();
    let currentDate = new Date(startDate);
    
    for (let i = 0; i < 5; i++) {
      switch (recurrenceData.frequency) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + recurrenceData.interval);
          break;
        case 'weekly':
          if (recurrenceData.daysOfWeek && recurrenceData.daysOfWeek.length > 0) {
            const nextDay = recurrenceData.daysOfWeek[0];
            const daysUntilNext = (nextDay - currentDate.getDay() + 7) % 7;
            currentDate.setDate(currentDate.getDate() + daysUntilNext + (recurrenceData.interval - 1) * 7);
          }
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + recurrenceData.interval);
          if (recurrenceData.dayOfMonth) {
            currentDate.setDate(recurrenceData.dayOfMonth);
          }
          break;
        case 'yearly':
          currentDate.setFullYear(currentDate.getFullYear() + recurrenceData.interval);
          break;
      }
      
      occurrences.push(currentDate.toLocaleDateString('pt-BR'));
    }
    
    return occurrences;
  };

  const getFrequencyDescription = (): string => {
    const { frequency, interval } = recurrenceData;
    
    switch (frequency) {
      case 'daily':
        return interval === 1 ? 'Todos os dias' : `A cada ${interval} dias`;
      case 'weekly':
        return interval === 1 ? 'Toda semana' : `A cada ${interval} semanas`;
      case 'monthly':
        return interval === 1 ? 'Todo mês' : `A cada ${interval} meses`;
      case 'yearly':
        return interval === 1 ? 'Todo ano' : `A cada ${interval} anos`;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Toggle de Ativação */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="recurrence-enabled"
          checked={isEnabled}
          onChange={(e) => setIsEnabled(e.target.checked)}
          disabled={disabled}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="recurrence-enabled" className="flex items-center text-sm font-medium text-gray-700">
          <Repeat className="w-4 h-4 mr-2" />
          Configurar Recorrência
        </label>
      </div>

      {isEnabled && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
          {/* Frequência */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequência
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FREQUENCY_OPTIONS.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleFrequencyChange(option.value)}
                  disabled={disabled}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    recurrenceData.frequency === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{option.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Intervalo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intervalo
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">A cada</span>
              <input
                type="number"
                min="1"
                value={recurrenceData.interval}
                onChange={(e) => updateRecurrenceData({ interval: parseInt(e.target.value) || 1 })}
                disabled={disabled}
                className={`w-20 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.interval ? 'border-red-500' : 'border-gray-300'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <span className="text-sm text-gray-600">
                {recurrenceData.frequency === 'daily' && 'dia(s)'}
                {recurrenceData.frequency === 'weekly' && 'semana(s)'}
                {recurrenceData.frequency === 'monthly' && 'mês(es)'}
                {recurrenceData.frequency === 'yearly' && 'ano(s)'}
              </span>
            </div>
            {errors.interval && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.interval}
              </p>
            )}
          </div>

          {/* Configurações específicas por frequência */}
          {recurrenceData.frequency === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dias da Semana
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map(day => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => handleDayOfWeekToggle(day.value)}
                    disabled={disabled}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      recurrenceData.daysOfWeek?.includes(day.value)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {day.short}
                  </button>
                ))}
              </div>
              {errors.daysOfWeek && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.daysOfWeek}
                </p>
              )}
            </div>
          )}

          {recurrenceData.frequency === 'monthly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dia do Mês
              </label>
              <select
                value={recurrenceData.dayOfMonth || 1}
                onChange={(e) => updateRecurrenceData({ dayOfMonth: parseInt(e.target.value) })}
                disabled={disabled}
                className={`w-32 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.dayOfMonth ? 'border-red-500' : 'border-gray-300'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {MONTH_DAYS.map(day => (
                  <option key={day} value={day}>
                    Dia {day}
                  </option>
                ))}
              </select>
              {errors.dayOfMonth && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.dayOfMonth}
                </p>
              )}
            </div>
          )}

          {/* Condições de Fim */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condição de Fim
            </label>
            <div className="space-y-3">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="endCondition"
                    checked={!!recurrenceData.endDate && !recurrenceData.maxOccurrences}
                    onChange={() => updateRecurrenceData({ endDate: '', maxOccurrences: undefined })}
                    disabled={disabled}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Data específica</span>
                </label>
                {recurrenceData.endDate && (
                  <input
                    type="date"
                    value={recurrenceData.endDate}
                    onChange={(e) => updateRecurrenceData({ endDate: e.target.value, maxOccurrences: undefined })}
                    disabled={disabled}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="endCondition"
                    checked={!!recurrenceData.maxOccurrences && !recurrenceData.endDate}
                    onChange={() => updateRecurrenceData({ maxOccurrences: undefined, endDate: '' })}
                    disabled={disabled}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Número de ocorrências</span>
                </label>
                {recurrenceData.maxOccurrences && (
                  <input
                    type="number"
                    min="1"
                    value={recurrenceData.maxOccurrences}
                    onChange={(e) => updateRecurrenceData({ maxOccurrences: parseInt(e.target.value) || undefined, endDate: '' })}
                    disabled={disabled}
                    className={`mt-2 w-32 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.maxOccurrences ? 'border-red-500' : 'border-gray-300'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                )}
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="endCondition"
                    checked={!recurrenceData.endDate && !recurrenceData.maxOccurrences}
                    onChange={() => updateRecurrenceData({ endDate: '', maxOccurrences: undefined })}
                    disabled={disabled}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Sem fim definido</span>
                </label>
              </div>
            </div>
            {errors.endCondition && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.endCondition}
              </p>
            )}
          </div>

          {/* Resumo e Próximas Ocorrências */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Info className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-gray-900">Resumo da Recorrência</h4>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-700">
                <strong>Frequência:</strong> {getFrequencyDescription()}
              </p>
              
              {recurrenceData.frequency === 'weekly' && recurrenceData.daysOfWeek && recurrenceData.daysOfWeek.length > 0 && (
                <p className="text-sm text-gray-700">
                  <strong>Dias:</strong> {recurrenceData.daysOfWeek.map(day => DAYS_OF_WEEK[day].label).join(', ')}
                </p>
              )}
              
              {recurrenceData.frequency === 'monthly' && recurrenceData.dayOfMonth && (
                <p className="text-sm text-gray-700">
                  <strong>Dia do mês:</strong> {recurrenceData.dayOfMonth}
                </p>
              )}
              
              {(recurrenceData.endDate || recurrenceData.maxOccurrences) && (
                <p className="text-sm text-gray-700">
                  <strong>Fim:</strong> {
                    recurrenceData.endDate 
                      ? `Em ${new Date(recurrenceData.endDate).toLocaleDateString('pt-BR')}`
                      : `Após ${recurrenceData.maxOccurrences} ocorrência(s)`
                  }
                </p>
              )}
            </div>

            {/* Próximas Ocorrências */}
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Próximas Ocorrências:</h5>
              <div className="flex flex-wrap gap-2">
                {getNextOccurrences().map((date, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {date}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
