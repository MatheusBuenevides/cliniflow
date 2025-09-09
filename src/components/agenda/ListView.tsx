import React, { useState } from 'react';
import { Clock, MapPin, Video, User, Filter, Search, Calendar as CalendarIcon } from 'lucide-react';
import type { Appointment, AvailableSlot } from '../../types';

interface ListViewProps {
  appointments: Appointment[];
  currentDate: Date;
  selectedDate: Date;
  onAppointmentClick: (appointment: Appointment) => void;
  onSlotClick: (date: string, time: string) => void;
  availableSlots?: AvailableSlot[];
  blockedSlots?: string[];
}

type SortBy = 'date' | 'time' | 'patient' | 'status' | 'price';
type SortOrder = 'asc' | 'desc';
type StatusFilter = 'all' | 'scheduled' | 'confirmed' | 'completed' | 'cancelled';

export const ListView: React.FC<ListViewProps> = ({
  appointments,
  currentDate,
  selectedDate,
  onAppointmentClick,
  onSlotClick,
  availableSlots = [],
  blockedSlots = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Filtrar e ordenar agendamentos
  const filteredAndSortedAppointments = appointments
    .filter(appointment => {
      // Filtro por status
      if (statusFilter !== 'all' && appointment.status !== statusFilter) {
        return false;
      }
      
      // Filtro por busca
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          appointment.patient.name.toLowerCase().includes(searchLower) ||
          appointment.patient.email.toLowerCase().includes(searchLower) ||
          appointment.patient.phone.includes(searchTerm) ||
          appointment.notes?.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'time':
          comparison = a.time.localeCompare(b.time);
          break;
        case 'patient':
          comparison = a.patient.name.localeCompare(b.patient.name);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 border-green-300 text-green-800';
      case 'confirmed': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'scheduled': return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'cancelled': return 'bg-red-100 border-red-300 text-red-800';
      case 'inProgress': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default: return 'bg-slate-100 border-slate-300 text-slate-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Realizada';
      case 'confirmed': return 'Confirmada';
      case 'scheduled': return 'Agendada';
      case 'cancelled': return 'Cancelada';
      case 'inProgress': return 'Em andamento';
      default: return status;
    }
  };

  const getModalityIcon = (modality: string) => {
    return modality === 'online' ? Video : MapPin;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  const handleSort = (field: SortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header da Lista */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">
            Lista de Agendamentos
          </h3>
          <p className="text-slate-600">
            {filteredAndSortedAppointments.length} de {appointments.length} agendamentos
          </p>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por paciente, email, telefone ou observações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtro por Status */}
          <div className="md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Todos os status</option>
              <option value="scheduled">Agendadas</option>
              <option value="confirmed">Confirmadas</option>
              <option value="completed">Realizadas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Agendamentos */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {/* Cabeçalho da Tabela */}
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-slate-700">
            <div className="col-span-3">
              <button
                onClick={() => handleSort('date')}
                className="flex items-center space-x-1 hover:text-purple-600 transition-colors"
              >
                <CalendarIcon className="h-4 w-4" />
                <span>Data</span>
                {sortBy === 'date' && (
                  <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
            </div>
            <div className="col-span-2">
              <button
                onClick={() => handleSort('time')}
                className="flex items-center space-x-1 hover:text-purple-600 transition-colors"
              >
                <Clock className="h-4 w-4" />
                <span>Horário</span>
                {sortBy === 'time' && (
                  <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
            </div>
            <div className="col-span-3">
              <button
                onClick={() => handleSort('patient')}
                className="flex items-center space-x-1 hover:text-purple-600 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Paciente</span>
                {sortBy === 'patient' && (
                  <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
            </div>
            <div className="col-span-2">
              <button
                onClick={() => handleSort('status')}
                className="flex items-center space-x-1 hover:text-purple-600 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Status</span>
                {sortBy === 'status' && (
                  <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
            </div>
            <div className="col-span-2">
              <button
                onClick={() => handleSort('price')}
                className="flex items-center space-x-1 hover:text-purple-600 transition-colors"
              >
                <span>Valor</span>
                {sortBy === 'price' && (
                  <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Agendamentos */}
        <div className="divide-y divide-slate-200">
          {filteredAndSortedAppointments.map((appointment) => {
            const ModalityIcon = getModalityIcon(appointment.modality);
            
            return (
              <div
                key={appointment.id}
                onClick={() => onAppointmentClick(appointment)}
                className="grid grid-cols-12 gap-4 p-4 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                {/* Data */}
                <div className="col-span-3">
                  <div className="text-sm font-medium text-slate-800">
                    {formatDate(appointment.date)}
                  </div>
                  <div className="text-xs text-slate-500">
                    {appointment.type === 'initial' ? 'Primeira consulta' : 'Retorno'}
                  </div>
                </div>

                {/* Horário */}
                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-800">
                      {formatTime(appointment.time)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {appointment.duration}min
                  </div>
                </div>

                {/* Paciente */}
                <div className="col-span-3">
                  <div className="text-sm font-medium text-slate-800">
                    {appointment.patient.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {appointment.patient.email}
                  </div>
                  <div className="text-xs text-slate-500">
                    {appointment.patient.phone}
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                  <div className="flex items-center space-x-1 mt-1">
                    <ModalityIcon className="h-3 w-3 text-slate-400" />
                    <span className="text-xs text-slate-500">
                      {appointment.modality === 'online' ? 'Online' : 'Presencial'}
                    </span>
                  </div>
                </div>

                {/* Valor */}
                <div className="col-span-2">
                  <div className="text-sm font-medium text-slate-800">
                    R$ {appointment.price}
                  </div>
                  <div className={`text-xs ${
                    appointment.paymentStatus === 'paid' ? 'text-green-600' :
                    appointment.paymentStatus === 'pending' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {appointment.paymentStatus === 'paid' ? 'Pago' :
                     appointment.paymentStatus === 'pending' ? 'Pendente' :
                     'Cancelado'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Estado vazio */}
        {filteredAndSortedAppointments.length === 0 && (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">
              Nenhum agendamento encontrado
            </h3>
            <p className="text-slate-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Não há agendamentos para exibir'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
