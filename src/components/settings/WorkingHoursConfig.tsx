import React, { useState } from 'react';
import { Clock, Save } from 'lucide-react';
import type { WorkingHours, DaySchedule } from '../../types';

interface WorkingHoursConfigProps {
  workingHours: WorkingHours;
  onWorkingHoursChange: (workingHours: WorkingHours) => void;
  className?: string;
}

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Segunda-feira' },
  { key: 'tuesday', label: 'Terça-feira' },
  { key: 'wednesday', label: 'Quarta-feira' },
  { key: 'thursday', label: 'Quinta-feira' },
  { key: 'friday', label: 'Sexta-feira' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' }
] as const;

const WorkingHoursConfig: React.FC<WorkingHoursConfigProps> = ({
  workingHours,
  onWorkingHoursChange,
  className = ''
}) => {
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [tempSchedule, setTempSchedule] = useState<DaySchedule | null>(null);

  const handleDayToggle = (day: string) => {
    const dayKey = day as keyof WorkingHours;
    if (workingHours[dayKey]) {
      // Desabilitar o dia
      const newWorkingHours = { ...workingHours };
      delete newWorkingHours[dayKey];
      onWorkingHoursChange(newWorkingHours);
    } else {
      // Habilitar o dia com horário padrão
      const newSchedule: DaySchedule = {
        start: '08:00',
        end: '18:00',
        lunchStart: '12:00',
        lunchEnd: '13:00'
      };
      onWorkingHoursChange({
        ...workingHours,
        [dayKey]: newSchedule
      });
    }
  };

  const handleEditDay = (day: string) => {
    const dayKey = day as keyof WorkingHours;
    const currentSchedule = workingHours[dayKey];
    setTempSchedule(currentSchedule || {
      start: '08:00',
      end: '18:00',
      lunchStart: '12:00',
      lunchEnd: '13:00'
    });
    setEditingDay(day);
  };

  const handleSaveDay = () => {
    if (editingDay && tempSchedule) {
      const dayKey = editingDay as keyof WorkingHours;
      onWorkingHoursChange({
        ...workingHours,
        [dayKey]: tempSchedule
      });
      setEditingDay(null);
      setTempSchedule(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingDay(null);
    setTempSchedule(null);
  };

  const handleScheduleChange = (field: keyof DaySchedule, value: string) => {
    if (tempSchedule) {
      setTempSchedule({
        ...tempSchedule,
        [field]: value
      });
    }
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5); // Remove segundos se houver
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          Horários de Funcionamento
        </h3>
        <p className="text-sm text-slate-600">
          Configure seus horários de atendimento para cada dia da semana.
        </p>
      </div>

      <div className="space-y-4">
        {DAYS_OF_WEEK.map(({ key, label }) => {
          const dayKey = key as keyof WorkingHours;
          const schedule = workingHours[dayKey];
          const isEnabled = !!schedule;
          const isEditing = editingDay === key;

          return (
            <div
              key={key}
              className="bg-white border border-slate-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={() => handleDayToggle(key)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-3 text-sm font-medium text-slate-700">
                    {label}
                  </label>
                </div>

                {isEnabled && !isEditing && (
                  <button
                    onClick={() => handleEditDay(key)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Editar
                  </button>
                )}
              </div>

              {isEnabled && (
                <div className="ml-7">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Início
                          </label>
                          <input
                            type="time"
                            value={tempSchedule?.start || '08:00'}
                            onChange={(e) => handleScheduleChange('start', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Fim
                          </label>
                          <input
                            type="time"
                            value={tempSchedule?.end || '18:00'}
                            onChange={(e) => handleScheduleChange('end', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Início do almoço
                          </label>
                          <input
                            type="time"
                            value={tempSchedule?.lunchStart || '12:00'}
                            onChange={(e) => handleScheduleChange('lunchStart', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Fim do almoço
                          </label>
                          <input
                            type="time"
                            value={tempSchedule?.lunchEnd || '13:00'}
                            onChange={(e) => handleScheduleChange('lunchEnd', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveDay}
                          className="inline-flex items-center px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <Save size={14} className="mr-1" />
                          Salvar
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="inline-flex items-center px-3 py-2 bg-slate-500 text-white text-sm rounded-lg hover:bg-slate-600 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center text-sm text-slate-600">
                      <Clock size={16} className="mr-2" />
                      <span>
                        {formatTime(schedule.start)} - {formatTime(schedule.end)}
                        {schedule.lunchStart && schedule.lunchEnd && (
                          <span className="text-slate-500 ml-2">
                            (Almoço: {formatTime(schedule.lunchStart)} - {formatTime(schedule.lunchEnd)})
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">
          💡 Dica
        </h4>
        <p className="text-sm text-blue-700">
          Configure seus horários de funcionamento para que os pacientes possam agendar consultas apenas nos horários disponíveis.
          O horário de almoço é opcional e pode ser usado para bloquear intervalos.
        </p>
      </div>
    </div>
  );
};

export default WorkingHoursConfig;
