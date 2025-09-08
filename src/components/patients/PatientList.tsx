import React, { useState, useEffect } from 'react';
import {  
  Plus,
  Users,
  Calendar,
  MessageCircle,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import type { Patient, PatientFilters, PatientViewMode, PatientStats, SavedFilter } from '../../types/patient';
import PatientCard from './PatientCard';
import PatientFiltersComponent from './PatientFilters';
import PatientSearch from './PatientSearch';
import PatientStatsComponent from './PatientStats';
import LoadingSpinner from '../ui/LoadingSpinner';

interface PatientListProps {
  patients: Patient[];
  stats: PatientStats;
  isLoading: boolean;
  error: string | null;
  filters: PatientFilters;
  savedFilters: SavedFilter[];
  onFiltersChange: (filters: PatientFilters) => void;
  onSearchChange: (term: string) => void;
  onViewRecord: (patient: Patient) => void;
  onSchedule: (patient: Patient) => void;
  onContact: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
  onExport: () => void;
  onSaveFilter: (name: string, filters: PatientFilters) => void;
  onLoadFilter: (filter: SavedFilter) => void;
  onDeleteFilter: (filterId: string) => void;
  onAddPatient: () => void;
}

const PatientList: React.FC<PatientListProps> = ({
  patients,
  stats,
  isLoading,
  error,
  filters,
  savedFilters,
  onFiltersChange,
  onSearchChange,
  onViewRecord,
  onSchedule,
  onContact,
  onEdit,
  onDelete,
  onExport,
  onSaveFilter,
  onLoadFilter,
  onDeleteFilter,
  onAddPatient
}) => {
  const [viewMode, setViewMode] = useState<PatientViewMode>('cards');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Patient | null>(null);

  // Sincronizar searchTerm com filters
  useEffect(() => {
    setSearchTerm(filters.search || '');
  }, [filters.search]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    onSearchChange(term);
  };

  const handleViewModeChange = (mode: PatientViewMode) => {
    setViewMode(mode);
  };

  const handleFiltersToggle = () => {
    setShowFilters(!showFilters);
  };

  const handleDeleteConfirm = (patient: Patient) => {
    setShowDeleteConfirm(patient);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
  };

  const handleDeleteConfirmAction = () => {
    if (showDeleteConfirm) {
      onDelete(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button 
              onClick={() => window.location.reload()}
              className="ml-2 text-red-800 underline"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <PatientStatsComponent stats={stats} isLoading={isLoading} />

      {/* Busca e controles */}
      <PatientSearch
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onFiltersToggle={handleFiltersToggle}
        onExport={onExport}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        resultsCount={patients.length}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Filtros */}
      {showFilters && (
        <PatientFiltersComponent
          filters={filters}
          onFiltersChange={onFiltersChange}
          onSaveFilter={onSaveFilter}
          onLoadFilter={onLoadFilter}
          onDeleteFilter={onDeleteFilter}
          savedFilters={savedFilters}
          isOpen={showFilters}
          onToggle={handleFiltersToggle}
        />
      )}

      {/* Header com ações */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Pacientes ({patients.length})
          </h2>
          {hasActiveFilters && (
            <span className="px-3 py-1 bg-purple-100 text-purple-600 text-sm font-medium rounded-full">
              Filtros ativos
            </span>
          )}
        </div>
        <button
          onClick={onAddPatient}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={16} />
          <span>Novo Paciente</span>
        </button>
      </div>

      {/* Lista de pacientes */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" text="Carregando pacientes..." />
        </div>
      ) : patients.length === 0 ? (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">
            {hasActiveFilters ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
          </h3>
          <p className="text-slate-500 mb-6">
            {hasActiveFilters 
              ? 'Tente ajustar os filtros ou limpar a busca para ver mais resultados.'
              : 'Comece adicionando seu primeiro paciente ao sistema.'
            }
          </p>
          {!hasActiveFilters && (
            <button
              onClick={onAddPatient}
              className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mx-auto"
            >
              <Plus size={16} />
              <span>Adicionar Primeiro Paciente</span>
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Visualização em cards */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onViewRecord={onViewRecord}
                  onSchedule={onSchedule}
                  onContact={onContact}
                  onEdit={onEdit}
                />
              ))}
            </div>
          )}

          {/* Visualização em lista */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Paciente
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Última Consulta
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Total Consultas
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Pagamento
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {patients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            {patient.avatar ? (
                              <img
                                src={patient.avatar}
                                alt={patient.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <span className="text-purple-600 font-semibold text-sm">
                                  {patient.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                </span>
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-slate-800">{patient.name}</div>
                              <div className="text-sm text-slate-500">{patient.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            patient.status === 'active' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {patient.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {patient.lastAppointment 
                            ? new Date(patient.lastAppointment).toLocaleDateString('pt-BR')
                            : 'Nunca'
                          }
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {patient.totalAppointments}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            patient.paymentStatus === 'paid' 
                              ? 'bg-green-100 text-green-600'
                              : patient.paymentStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {patient.paymentStatus === 'paid' ? 'Pago' : 
                             patient.paymentStatus === 'pending' ? 'Pendente' : 'Não informado'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => onViewRecord(patient)}
                              className="p-2 text-slate-400 hover:text-purple-600 transition-colors"
                              title="Ver prontuário"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => onSchedule(patient)}
                              className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                              title="Agendar consulta"
                            >
                              <Calendar size={16} />
                            </button>
                            <button
                              onClick={() => onContact(patient)}
                              className="p-2 text-slate-400 hover:text-green-600 transition-colors"
                              title="Contatar"
                            >
                              <MessageCircle size={16} />
                            </button>
                            <button
                              onClick={() => onEdit(patient)}
                              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                              title="Editar"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteConfirm(patient)}
                              className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                              title="Excluir"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal de confirmação de exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Confirmar exclusão
            </h3>
            <p className="text-slate-600 mb-6">
              Tem certeza que deseja excluir o paciente <strong>{showDeleteConfirm.name}</strong>? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteConfirmAction}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Excluir
              </button>
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;
