import React, { useState } from 'react';
import { Search, X, Filter, Download, Grid, List } from 'lucide-react';
import type { PatientViewMode } from '../../types/patient';

interface PatientSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onFiltersToggle: () => void;
  onExport: () => void;
  viewMode: PatientViewMode;
  onViewModeChange: (mode: PatientViewMode) => void;
  resultsCount: number;
  hasActiveFilters: boolean;
}

const PatientSearch: React.FC<PatientSearchProps> = ({
  searchTerm,
  onSearchChange,
  onFiltersToggle,
  onExport,
  viewMode,
  onViewModeChange,
  resultsCount,
  hasActiveFilters
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleClearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Busca */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search 
              size={20} 
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                isSearchFocused ? 'text-purple-500' : 'text-slate-400'
              }`} 
            />
            <input
              type="text"
              placeholder="Buscar por nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none transition-colors ${
                isSearchFocused 
                  ? 'border-purple-500 ring-2 ring-purple-200' 
                  : 'border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
              }`}
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center space-x-3">
          {/* Contador de resultados */}
          <div className="text-sm text-slate-600">
            {resultsCount} {resultsCount === 1 ? 'paciente encontrado' : 'pacientes encontrados'}
          </div>

          {/* Filtros */}
          <button
            onClick={onFiltersToggle}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              hasActiveFilters
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-slate-300 text-slate-600 hover:border-slate-400'
            }`}
          >
            <Filter size={16} />
            <span className="text-sm font-medium">Filtros</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            )}
          </button>

          {/* Modo de visualização */}
          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 transition-colors ${
                viewMode === 'list'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
              title="Visualização em lista"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => onViewModeChange('cards')}
              className={`p-2 transition-colors ${
                viewMode === 'cards'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
              title="Visualização em cards"
            >
              <Grid size={16} />
            </button>
          </div>

          {/* Exportar */}
          <button
            onClick={onExport}
            className="flex items-center space-x-2 px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-colors"
            title="Exportar lista"
          >
            <Download size={16} />
            <span className="text-sm font-medium">Exportar</span>
          </button>
        </div>
      </div>

      {/* Sugestões de busca rápida */}
      {searchTerm && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-slate-500">Busca rápida:</span>
            <button
              onClick={() => onSearchChange('status:ativo')}
              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
            >
              Ativos
            </button>
            <button
              onClick={() => onSearchChange('status:inativo')}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              Inativos
            </button>
            <button
              onClick={() => onSearchChange('pagamento:pago')}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
            >
              Pagos
            </button>
            <button
              onClick={() => onSearchChange('pagamento:pendente')}
              className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition-colors"
            >
              Pendentes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientSearch;
