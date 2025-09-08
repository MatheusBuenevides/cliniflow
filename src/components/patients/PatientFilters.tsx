import React, { useState } from 'react';
import { 
  Filter, 
  X, 
  Calendar, 
  Users, 
  CreditCard,
  Save,
  Trash2
} from 'lucide-react';
import type { PatientFilters, SavedFilter } from '../../types/patient';

interface PatientFiltersProps {
  filters: PatientFilters;
  onFiltersChange: (filters: PatientFilters) => void;
  onSaveFilter: (name: string, filters: PatientFilters) => void;
  onLoadFilter: (filter: SavedFilter) => void;
  onDeleteFilter: (filterId: string) => void;
  savedFilters: SavedFilter[];
  isOpen: boolean;
  onToggle: () => void;
}

const PatientFiltersComponent: React.FC<PatientFiltersProps> = ({
  filters,
  onFiltersChange,
  onSaveFilter,
  onLoadFilter,
  onDeleteFilter,
  savedFilters,
  isOpen,
  onToggle
}) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');

  const handleFilterChange = (key: keyof PatientFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handlePeriodChange = (type: 'start' | 'end', value: string) => {
    onFiltersChange({
      ...filters,
      period: {
        ...filters.period,
        [type]: value
      }
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const handleSaveFilter = () => {
    if (filterName.trim()) {
      onSaveFilter(filterName.trim(), filters);
      setFilterName('');
      setShowSaveDialog(false);
    }
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-slate-600" />
            <h3 className="font-semibold text-slate-800">Filtros</h3>
            {hasActiveFilters && (
              <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs font-medium rounded-full">
                {Object.keys(filters).length} ativo(s)
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                title="Limpar filtros"
              >
                <X size={16} />
              </button>
            )}
            <button
              onClick={onToggle}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 space-y-6">
          {/* Filtros salvos */}
          {savedFilters.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-3">Filtros salvos</h4>
              <div className="space-y-2">
                {savedFilters.map((savedFilter) => (
                  <div
                    key={savedFilter.id}
                    className="flex items-center justify-between p-2 bg-slate-50 rounded-lg"
                  >
                    <button
                      onClick={() => onLoadFilter(savedFilter)}
                      className="text-sm text-slate-700 hover:text-purple-600 transition-colors"
                    >
                      {savedFilter.name}
                    </button>
                    <button
                      onClick={() => onDeleteFilter(savedFilter.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Users size={16} className="inline mr-2" />
              Status
            </label>
            <select
              value={filters.status || 'all'}
              onChange={(e) => handleFilterChange('status', e.target.value === 'all' ? undefined : e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>

          {/* Status de pagamento */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <CreditCard size={16} className="inline mr-2" />
              Status de pagamento
            </label>
            <select
              value={filters.paymentStatus || 'all'}
              onChange={(e) => handleFilterChange('paymentStatus', e.target.value === 'all' ? undefined : e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todos</option>
              <option value="paid">Pago</option>
              <option value="pending">Pendente</option>
              <option value="cancelled">Cancelado</option>
              <option value="refunded">Reembolsado</option>
            </select>
          </div>

          {/* Período */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Calendar size={16} className="inline mr-2" />
              Período de consulta
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">De</label>
                <input
                  type="date"
                  value={filters.period?.start || ''}
                  onChange={(e) => handlePeriodChange('start', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Até</label>
                <input
                  type="date"
                  value={filters.period?.end || ''}
                  onChange={(e) => handlePeriodChange('end', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Ordenação */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Ordenar por
            </label>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={filters.sortBy || 'name'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="name">Nome</option>
                <option value="createdAt">Data de cadastro</option>
                <option value="lastAppointment">Última consulta</option>
              </select>
              <select
                value={filters.sortOrder || 'asc'}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="asc">Crescente</option>
                <option value="desc">Decrescente</option>
              </select>
            </div>
          </div>

          {/* Salvar filtro */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-slate-100">
              {!showSaveDialog ? (
                <button
                  onClick={() => setShowSaveDialog(true)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Save size={16} />
                  <span>Salvar filtro</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nome do filtro"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveFilter}
                      disabled={!filterName.trim()}
                      className="flex-1 px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => {
                        setShowSaveDialog(false);
                        setFilterName('');
                      }}
                      className="px-3 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientFiltersComponent;
