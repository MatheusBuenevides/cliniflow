import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Clock, 
  Users, 
  DollarSign,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Filter
} from 'lucide-react';
import type { Appointment, AppointmentStatus } from '../../types';

interface AppointmentStats {
  total: number;
  completed: number;
  cancelled: number;
  noShow: number;
  confirmed: number;
  scheduled: number;
  inProgress: number;
  attendanceRate: number;
  cancellationRate: number;
  averageDuration: number;
  totalRevenue: number;
  averageRevenue: number;
}

interface TimeSlotStats {
  hour: string;
  count: number;
  percentage: number;
}

interface MonthlyStats {
  month: string;
  appointments: number;
  revenue: number;
  attendanceRate: number;
}

interface AppointmentReportsProps {
  appointments: Appointment[];
  dateRange?: {
    start: string;
    end: string;
  };
  onExport?: (format: 'csv' | 'pdf') => void;
}

export const AppointmentReports: React.FC<AppointmentReportsProps> = ({
  appointments,
  dateRange,
  onExport
}) => {
  const [stats, setStats] = useState<AppointmentStats | null>(null);
  const [timeSlotStats, setTimeSlotStats] = useState<TimeSlotStats[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [cancellationReasons, setCancellationReasons] = useState<Record<string, number>>({});
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    calculateStats();
  }, [appointments, dateRange, selectedPeriod]);

  const calculateStats = () => {
    const filteredAppointments = filterAppointmentsByPeriod(appointments);
    
    const total = filteredAppointments.length;
    const completed = filteredAppointments.filter(a => a.status === 'completed').length;
    const cancelled = filteredAppointments.filter(a => a.status === 'cancelled').length;
    const noShow = filteredAppointments.filter(a => a.status === 'noShow').length;
    const confirmed = filteredAppointments.filter(a => a.status === 'confirmed').length;
    const scheduled = filteredAppointments.filter(a => a.status === 'scheduled').length;
    const inProgress = filteredAppointments.filter(a => a.status === 'inProgress').length;

    const attendanceRate = total > 0 ? ((completed + inProgress) / total) * 100 : 0;
    const cancellationRate = total > 0 ? (cancelled / total) * 100 : 0;
    
    const totalDuration = filteredAppointments.reduce((sum, a) => sum + a.duration, 0);
    const averageDuration = total > 0 ? totalDuration / total : 0;
    
    const totalRevenue = filteredAppointments
      .filter(a => a.status === 'completed' && a.paymentStatus === 'paid')
      .reduce((sum, a) => sum + a.price, 0);
    const averageRevenue = completed > 0 ? totalRevenue / completed : 0;

    setStats({
      total,
      completed,
      cancelled,
      noShow,
      confirmed,
      scheduled,
      inProgress,
      attendanceRate,
      cancellationRate,
      averageDuration,
      totalRevenue,
      averageRevenue
    });

    calculateTimeSlotStats(filteredAppointments);
    calculateMonthlyStats(filteredAppointments);
    calculateCancellationReasons(filteredAppointments);
  };

  const filterAppointmentsByPeriod = (appointments: Appointment[]) => {
    if (dateRange) {
      return appointments.filter(a => 
        a.date >= dateRange.start && a.date <= dateRange.end
      );
    }

    const now = new Date();
    let startDate = new Date();

    switch (selectedPeriod) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return appointments.filter(a => new Date(a.date) >= startDate);
  };

  const calculateTimeSlotStats = (appointments: Appointment[]) => {
    const hourCounts: Record<string, number> = {};
    
    appointments.forEach(appointment => {
      const hour = appointment.time.split(':')[0];
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const total = appointments.length;
    const stats = Object.entries(hourCounts)
      .map(([hour, count]) => ({
        hour: `${hour}:00`,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0
      }))
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

    setTimeSlotStats(stats);
  };

  const calculateMonthlyStats = (appointments: Appointment[]) => {
    const monthlyData: Record<string, { appointments: number; revenue: number; completed: number }> = {};
    
    appointments.forEach(appointment => {
      const month = appointment.date.substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { appointments: 0, revenue: 0, completed: 0 };
      }
      
      monthlyData[month].appointments++;
      if (appointment.status === 'completed' && appointment.paymentStatus === 'paid') {
        monthlyData[month].revenue += appointment.price;
        monthlyData[month].completed++;
      }
    });

    const stats = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        appointments: data.appointments,
        revenue: data.revenue,
        attendanceRate: data.appointments > 0 ? (data.completed / data.appointments) * 100 : 0
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    setMonthlyStats(stats);
  };

  const calculateCancellationReasons = (appointments: Appointment[]) => {
    const reasons: Record<string, number> = {};
    
    appointments
      .filter(a => a.status === 'cancelled' && a.notes)
      .forEach(appointment => {
        // Extrair motivo do cancelamento das notas (simplificado)
        const notes = appointment.notes?.toLowerCase() || '';
        let reason = 'Outros';
        
        if (notes.includes('paciente')) reason = 'Paciente';
        else if (notes.includes('psicólogo')) reason = 'Psicólogo';
        else if (notes.includes('emergência')) reason = 'Emergência';
        else if (notes.includes('doença')) reason = 'Doença';
        else if (notes.includes('trabalho')) reason = 'Trabalho';
        
        reasons[reason] = (reasons[reason] || 0) + 1;
      });

    setCancellationReasons(reasons);
  };

  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'cancelled': return XCircle;
      case 'noShow': return AlertTriangle;
      case 'confirmed': return CheckCircle;
      case 'scheduled': return Calendar;
      case 'inProgress': return Clock;
      default: return Calendar;
    }
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'noShow': return 'text-orange-600 bg-orange-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'scheduled': return 'text-purple-600 bg-purple-100';
      case 'inProgress': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Relatórios da Agenda</h2>
          <p className="text-slate-600 mt-1">
            Análise de produtividade e performance dos agendamentos
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="week">Última semana</option>
            <option value="month">Último mês</option>
            <option value="quarter">Último trimestre</option>
            <option value="year">Último ano</option>
          </select>
          
          {onExport && (
            <div className="flex space-x-2">
              <button
                onClick={() => onExport('csv')}
                className="flex items-center space-x-2 px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>CSV</span>
              </button>
              <button
                onClick={() => onExport('pdf')}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>PDF</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total de Consultas</p>
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Taxa de Comparecimento</p>
              <p className="text-2xl font-bold text-green-600">{stats.attendanceRate.toFixed(1)}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Taxa de Cancelamento</p>
              <p className="text-2xl font-bold text-red-600">{stats.cancellationRate.toFixed(1)}%</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Receita Total</p>
              <p className="text-2xl font-bold text-slate-800">R$ {stats.totalRevenue.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Status dos Agendamentos */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Status dos Agendamentos</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { status: 'scheduled' as AppointmentStatus, label: 'Agendados', count: stats.scheduled },
            { status: 'confirmed' as AppointmentStatus, label: 'Confirmados', count: stats.confirmed },
            { status: 'inProgress' as AppointmentStatus, label: 'Em Andamento', count: stats.inProgress },
            { status: 'completed' as AppointmentStatus, label: 'Realizados', count: stats.completed },
            { status: 'cancelled' as AppointmentStatus, label: 'Cancelados', count: stats.cancelled },
            { status: 'noShow' as AppointmentStatus, label: 'Faltas', count: stats.noShow }
          ].map(({ status, label, count }) => {
            const Icon = getStatusIcon(status);
            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
            
            return (
              <div key={status} className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${getStatusColor(status)} mb-2`}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-slate-600">{label}</p>
                <p className="text-xl font-bold text-slate-800">{count}</p>
                <p className="text-xs text-slate-500">{percentage.toFixed(1)}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Horários Mais Procurados */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Horários Mais Procurados</h3>
        <div className="space-y-3">
          {timeSlotStats.slice(0, 5).map((slot) => (
            <div key={slot.hour} className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">{slot.hour}</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${slot.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-slate-600 w-12 text-right">
                  {slot.count} ({slot.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estatísticas Mensais */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Evolução Mensal</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 text-sm font-medium text-slate-600">Mês</th>
                <th className="text-right py-2 text-sm font-medium text-slate-600">Consultas</th>
                <th className="text-right py-2 text-sm font-medium text-slate-600">Receita</th>
                <th className="text-right py-2 text-sm font-medium text-slate-600">Comparecimento</th>
              </tr>
            </thead>
            <tbody>
              {monthlyStats.map((month) => (
                <tr key={month.month} className="border-b border-slate-100">
                  <td className="py-2 text-sm text-slate-800">
                    {new Date(month.month + '-01').toLocaleDateString('pt-BR', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </td>
                  <td className="py-2 text-sm text-slate-600 text-right">{month.appointments}</td>
                  <td className="py-2 text-sm text-slate-600 text-right">R$ {month.revenue.toFixed(2)}</td>
                  <td className="py-2 text-sm text-slate-600 text-right">{month.attendanceRate.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Motivos de Cancelamento */}
      {Object.keys(cancellationReasons).length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Motivos de Cancelamento</h3>
          <div className="space-y-3">
            {Object.entries(cancellationReasons)
              .sort(([,a], [,b]) => b - a)
              .map(([reason, count]) => {
                const percentage = stats.cancelled > 0 ? (count / stats.cancelled) * 100 : 0;
                return (
                  <div key={reason} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">{reason}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-slate-600 w-12 text-right">
                        {count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentReports;
