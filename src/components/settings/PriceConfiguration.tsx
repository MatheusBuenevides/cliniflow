import React, { useState } from 'react';
import { DollarSign, Clock, Save, Edit3 } from 'lucide-react';
import type { SessionPrices } from '../../types';

interface PriceConfigurationProps {
  sessionPrices: SessionPrices;
  onPricesChange: (prices: SessionPrices) => void;
  className?: string;
}

const PriceConfiguration: React.FC<PriceConfigurationProps> = ({
  sessionPrices,
  onPricesChange,
  className = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempPrices, setTempPrices] = useState<SessionPrices>(sessionPrices);

  const handlePriceChange = (field: keyof SessionPrices, value: number) => {
    setTempPrices({
      ...tempPrices,
      [field]: value
    });
  };

  const handleSave = () => {
    onPricesChange(tempPrices);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempPrices(sessionPrices);
    setIsEditing(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDuration = (minutes: number) => {
    if (minutes === 60) return '1 hora';
    if (minutes === 45) return '45 minutos';
    if (minutes === 30) return '30 minutos';
    return `${minutes} minutos`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Preços das Sessões
          </h3>
          <p className="text-sm text-slate-600">
            Configure os valores para diferentes tipos de consulta.
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Edit3 size={16} className="mr-2" />
          {isEditing ? 'Cancelar' : 'Editar'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primeira Consulta */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <DollarSign size={20} className="text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800">Primeira Consulta</h4>
              <p className="text-sm text-slate-600">Consulta inicial</p>
            </div>
          </div>
          
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Valor
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">R$</span>
                  <input
                    type="number"
                    value={tempPrices.initial}
                    onChange={(e) => handlePriceChange('initial', Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-2xl font-bold text-slate-800">
              {formatCurrency(sessionPrices.initial)}
            </div>
          )}
        </div>

        {/* Consulta de Retorno */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <DollarSign size={20} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800">Consulta de Retorno</h4>
              <p className="text-sm text-slate-600">Sessões de acompanhamento</p>
            </div>
          </div>
          
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Valor
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">R$</span>
                  <input
                    type="number"
                    value={tempPrices.followUp}
                    onChange={(e) => handlePriceChange('followUp', Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-2xl font-bold text-slate-800">
              {formatCurrency(sessionPrices.followUp)}
            </div>
          )}
        </div>

        {/* Telepsicologia */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <DollarSign size={20} className="text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800">Telepsicologia</h4>
              <p className="text-sm text-slate-600">Consultas online</p>
            </div>
          </div>
          
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Valor
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">R$</span>
                  <input
                    type="number"
                    value={tempPrices.online}
                    onChange={(e) => handlePriceChange('online', Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-2xl font-bold text-slate-800">
              {formatCurrency(sessionPrices.online)}
            </div>
          )}
        </div>

        {/* Duração da Sessão */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              <Clock size={20} className="text-orange-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-800">Duração Padrão</h4>
              <p className="text-sm text-slate-600">Tempo das sessões</p>
            </div>
          </div>
          
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Duração (minutos)
                </label>
                <select
                  value={tempPrices.duration}
                  onChange={(e) => handlePriceChange('duration', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={30}>30 minutos</option>
                  <option value={45}>45 minutos</option>
                  <option value={60}>60 minutos</option>
                  <option value={90}>90 minutos</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="text-2xl font-bold text-slate-800">
              {formatDuration(sessionPrices.duration)}
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save size={16} className="mr-2" />
            Salvar Alterações
          </button>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-amber-800 mb-2">
          ⚠️ Importante
        </h4>
        <p className="text-sm text-amber-700">
          Os preços configurados aqui serão exibidos na sua página pública de agendamento e utilizados para gerar links de pagamento automaticamente.
        </p>
      </div>
    </div>
  );
};

export default PriceConfiguration;
