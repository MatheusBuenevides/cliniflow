import React, { useEffect } from 'react';
import { usePatientStore } from '../stores/usePatientStore';
import { PatientList } from '../components/patients';
import type { Patient } from '../types/patient';

const Patients: React.FC = () => {
  const { 
    patients,
    stats,
    isLoading,
    error,
    filters,
    savedFilters,
    fetchPatients,
    fetchStats,
    fetchSavedFilters,
    setFilters,
    setSearchTerm,
    saveFilter,
    loadSavedFilter,
    deleteSavedFilter,
    exportPatients,
  } = usePatientStore();

  useEffect(() => {
    fetchPatients();
    fetchStats();
    fetchSavedFilters();
  }, []);

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    fetchPatients(newFilters);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    const newFilters = { ...filters, search: term };
    setFilters(newFilters);
    fetchPatients(newFilters);
  };

  const handleViewRecord = (patient: Patient) => {
    // TODO: Implementar navegação para prontuário
    console.log('Ver prontuário:', patient);
  };

  const handleSchedule = (patient: Patient) => {
    // TODO: Implementar navegação para agendamento
    console.log('Agendar consulta:', patient);
  };

  const handleContact = (patient: Patient) => {
    // TODO: Implementar funcionalidade de contato
    console.log('Contatar paciente:', patient);
  };

  const handleEdit = (patient: Patient) => {
    // TODO: Implementar edição de paciente
    console.log('Editar paciente:', patient);
  };

  const handleDelete = (patient: Patient) => {
    // TODO: Implementar exclusão de paciente
    console.log('Excluir paciente:', patient);
  };

  const handleAddPatient = () => {
    // TODO: Implementar adição de paciente
    console.log('Adicionar novo paciente');
  };

  const handleSaveFilter = (name: string, filterData: any) => {
    saveFilter(name, filterData);
  };

  const handleLoadFilter = (filter: any) => {
    loadSavedFilter(filter);
    fetchPatients(filter.filters);
  };

  const handleDeleteFilter = (filterId: string) => {
    deleteSavedFilter(filterId);
  };

  const handleExport = () => {
    exportPatients('csv');
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Gestão de Pacientes</h1>
        <p className="text-slate-600">
          Gerencie seus pacientes, visualize estatísticas e acesse informações importantes.
        </p>
      </div>

      <PatientList
        patients={patients}
        stats={stats || { total: 0, active: 0, newThisMonth: 0, lastAppointment: null }}
        isLoading={isLoading}
        error={error}
        filters={filters}
        savedFilters={savedFilters}
        onFiltersChange={handleFiltersChange}
        onSearchChange={handleSearchChange}
        onViewRecord={handleViewRecord}
        onSchedule={handleSchedule}
        onContact={handleContact}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        onSaveFilter={handleSaveFilter}
        onLoadFilter={handleLoadFilter}
        onDeleteFilter={handleDeleteFilter}
        onAddPatient={handleAddPatient}
      />
    </div>
  );
};

export default Patients;
