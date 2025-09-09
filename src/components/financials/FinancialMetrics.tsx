import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';

interface FinancialMetricsProps {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  totalConsultations: number;
  completedConsultations: number;
  pendingConsultations: number;
  averageTicket: number;
  monthlyGrowth: number;
  previousMonthRevenue: number;
  goalRevenue: number;
  goalProgress: number;
}

const FinancialMetrics: React.FC<FinancialMetricsProps> = ({
  totalRevenue,
  totalExpenses,
  netProfit,
  totalConsultations,
  completedConsultations,
  pendingConsultations,
  averageTicket,
  monthlyGrowth,
  goalRevenue,
  goalProgress
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowUpRight size={16} className="text-green-500" />;
    if (growth < 0) return <ArrowDownRight size={16} className="text-red-500" />;
    return <Minus size={16} className="text-gray-500" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getGrowthText = (growth: number) => {
    const absGrowth = Math.abs(growth);
    return `${growth > 0 ? '+' : growth < 0 ? '-' : ''}${absGrowth.toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Receita Total */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-green-100 rounded-xl">
            <DollarSign size={24} className="text-green-600" />
          </div>
          <div className="text-right">
            <div className={`text-sm font-semibold flex items-center justify-end ${getGrowthColor(monthlyGrowth)}`}>
              {getGrowthIcon(monthlyGrowth)}
              <span className="ml-1">{getGrowthText(monthlyGrowth)}</span>
            </div>
            <div className="text-xs text-slate-500">vs mês anterior</div>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800 mb-1">
            {formatCurrency(totalRevenue)}
          </h3>
          <p className="text-sm text-slate-600">Receita Total</p>
          <div className="mt-2 text-xs text-slate-500">
            Meta: {formatCurrency(goalRevenue)} ({goalProgress.toFixed(1)}%)
          </div>
        </div>
      </div>

      {/* Lucro Líquido */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <TrendingUp size={24} className="text-blue-600" />
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-slate-600">
              {formatCurrency(totalExpenses)}
            </div>
            <div className="text-xs text-slate-500">despesas</div>
          </div>
        </div>
        <div>
          <h3 className={`text-2xl font-bold mb-1 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(netProfit)}
          </h3>
          <p className="text-sm text-slate-600">Lucro Líquido</p>
          <div className="mt-2 text-xs text-slate-500">
            Margem: {totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0}%
          </div>
        </div>
      </div>

      {/* Consultas */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-purple-100 rounded-xl">
            <Users size={24} className="text-purple-600" />
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-orange-600">
              {pendingConsultations}
            </div>
            <div className="text-xs text-slate-500">pendentes</div>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800 mb-1">
            {totalConsultations}
          </h3>
          <p className="text-sm text-slate-600">Total de Consultas</p>
          <div className="mt-2 text-xs text-slate-500">
            {completedConsultations} concluídas ({totalConsultations > 0 ? ((completedConsultations / totalConsultations) * 100).toFixed(1) : 0}%)
          </div>
        </div>
      </div>

      {/* Ticket Médio */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-orange-100 rounded-xl">
            <Target size={24} className="text-orange-600" />
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-slate-600">
              {completedConsultations}
            </div>
            <div className="text-xs text-slate-500">consultas pagas</div>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800 mb-1">
            {formatCurrency(averageTicket)}
          </h3>
          <p className="text-sm text-slate-600">Ticket Médio</p>
          <div className="mt-2 text-xs text-slate-500">
            Por consulta realizada
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialMetrics;
