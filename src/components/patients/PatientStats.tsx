import React from 'react';
import { Users, UserPlus, Calendar, TrendingUp } from 'lucide-react';
import type { PatientStats as PatientStatsType } from '../../types/patient';
import InfoCard from '../ui/InfoCard';

interface PatientStatsProps {
  stats: PatientStatsType;
  isLoading?: boolean;
}

const PatientStats: React.FC<PatientStatsProps> = ({ stats, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-full bg-slate-200 w-12 h-12"></div>
              <div className="flex-1">
                <div className="h-4 bg-slate-200 rounded w-20 mb-2"></div>
                <div className="h-6 bg-slate-200 rounded w-16 mb-1"></div>
                <div className="h-3 bg-slate-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total de pacientes */}
      <InfoCard
        icon={<Users size={24} />}
        title="Total de Pacientes"
        value={stats.total}
        subtitle="Cadastrados no sistema"
        colorClass="text-blue-600"
      />

      {/* Pacientes ativos */}
      <InfoCard
        icon={<TrendingUp size={24} />}
        title="Pacientes Ativos"
        value={stats.active}
        subtitle={`${((stats.active / stats.total) * 100).toFixed(1)}% do total`}
        colorClass="text-green-600"
      />

      {/* Novos este mês */}
      <InfoCard
        icon={<UserPlus size={24} />}
        title="Novos Este Mês"
        value={stats.newThisMonth}
        subtitle="Cadastros recentes"
        colorClass="text-purple-600"
      />

      {/* Última consulta */}
      <InfoCard
        icon={<Calendar size={24} />}
        title="Última Consulta"
        value={stats.lastAppointment ? formatDate(stats.lastAppointment.date) : 'Nenhuma'}
        subtitle={stats.lastAppointment ? stats.lastAppointment.patientName : 'Ainda não há consultas'}
        colorClass="text-orange-600"
      />
    </div>
  );
};

export default PatientStats;
