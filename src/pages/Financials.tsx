import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Download
} from 'lucide-react';
import { 
  FinancialMetrics, 
  RevenueChart, 
  ExpenseBreakdown, 
  PaymentStatusPie,
  CashFlowChart,
  ConsultationPerformance
} from '../components/financials';
import { useFinancialStore } from '../stores/useFinancialStore';

const Financials: React.FC = () => {
  const { 
    transactions, 
    isLoading, 
    error, 
    fetchTransactions, 
    generateFinancialReport,
    clearError 
  } = useFinancialStore();

  const [selectedPeriod, setSelectedPeriod] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');

  useEffect(() => {
    fetchTransactions();
    generateFinancialReport(selectedPeriod.start, selectedPeriod.end);
  }, [selectedPeriod]);

  // Calcular estatísticas avançadas
  const totalRevenue = transactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalRevenue - totalExpenses;

  const totalConsultations = transactions
    .filter(t => t.type === 'income' && t.category === 'consultation')
    .length;

  const completedConsultations = transactions
    .filter(t => t.type === 'income' && t.category === 'consultation' && t.status === 'completed')
    .length;

  const pendingConsultations = transactions
    .filter(t => t.type === 'income' && t.category === 'consultation' && t.status === 'pending')
    .length;

  const averageTicket = completedConsultations > 0 
    ? transactions
        .filter(t => t.type === 'income' && t.category === 'consultation' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0) / completedConsultations
    : 0;

  // Calcular crescimento mensal (mockado por enquanto)
  const monthlyGrowth = 12.5; // Seria calculado baseado em dados reais
  const previousMonthRevenue = totalRevenue * 0.9; // Mockado
  const goalRevenue = 15000; // Meta mensal
  const goalProgress = (totalRevenue / goalRevenue) * 100;

  // Dados para gráficos
  const revenueChartData = [
    { month: 'Jan', revenue: 2400, expenses: 1800, profit: 600, consultations: 20, previousYear: 2200 },
    { month: 'Fev', revenue: 1800, expenses: 1600, profit: 200, consultations: 15, previousYear: 1900 },
    { month: 'Mar', revenue: 3200, expenses: 2000, profit: 1200, consultations: 26, previousYear: 2800 },
    { month: 'Abr', revenue: 2800, expenses: 1900, profit: 900, consultations: 23, previousYear: 2600 },
    { month: 'Mai', revenue: 3500, expenses: 2100, profit: 1400, consultations: 29, previousYear: 3200 },
    { month: 'Jun', revenue: 2900, expenses: 1950, profit: 950, consultations: 24, previousYear: 2700 }
  ];

  // Dados para breakdown de despesas
  const expenseData = [
    { category: 'Aluguel', amount: 2500, percentage: 35.2, count: 1, color: '#ef4444' },
    { category: 'Supervisão', amount: 1200, percentage: 16.9, count: 4, color: '#f97316' },
    { category: 'Educação', amount: 800, percentage: 11.3, count: 2, color: '#eab308' },
    { category: 'Marketing', amount: 600, percentage: 8.5, count: 3, color: '#22c55e' },
    { category: 'Equipamentos', amount: 500, percentage: 7.0, count: 2, color: '#06b6d4' },
    { category: 'Software', amount: 300, percentage: 4.2, count: 1, color: '#8b5cf6' },
    { category: 'Outros', amount: 1200, percentage: 16.9, count: 5, color: '#6b7280' }
  ];

  // Dados para status de pagamentos
  const paymentStatusData = [
    { status: 'completed', count: 45, amount: 5400, percentage: 75.0, color: '#10b981' },
    { status: 'pending', count: 8, amount: 960, percentage: 13.3, color: '#f59e0b' },
    { status: 'cancelled', count: 3, amount: 360, percentage: 5.0, color: '#ef4444' },
    { status: 'overdue', count: 4, amount: 480, percentage: 6.7, color: '#dc2626' }
  ];

  // Dados para fluxo de caixa
  const cashFlowData = [
    { month: 'Jan', inflow: 2400, outflow: 1800, netCashFlow: 600, cumulativeCashFlow: 600, projectedInflow: 2600, projectedOutflow: 1900 },
    { month: 'Fev', inflow: 1800, outflow: 1600, netCashFlow: 200, cumulativeCashFlow: 800, projectedInflow: 2000, projectedOutflow: 1700 },
    { month: 'Mar', inflow: 3200, outflow: 2000, netCashFlow: 1200, cumulativeCashFlow: 2000, projectedInflow: 3400, projectedOutflow: 2100 },
    { month: 'Abr', inflow: 2800, outflow: 1900, netCashFlow: 900, cumulativeCashFlow: 2900, projectedInflow: 3000, projectedOutflow: 2000 },
    { month: 'Mai', inflow: 3500, outflow: 2100, netCashFlow: 1400, cumulativeCashFlow: 4300, projectedInflow: 3700, projectedOutflow: 2200 },
    { month: 'Jun', inflow: 2900, outflow: 1950, netCashFlow: 950, cumulativeCashFlow: 5250, projectedInflow: 3100, projectedOutflow: 2050 }
  ];

  // Dados para performance por tipo de consulta
  const consultationPerformanceData = [
    { 
      type: 'individual', 
      label: 'Individual', 
      count: 25, 
      revenue: 3000, 
      averageValue: 120, 
      completionRate: 92, 
      noShowRate: 8, 
      color: '#8b5cf6' 
    },
    { 
      type: 'online', 
      label: 'Online', 
      count: 18, 
      revenue: 1800, 
      averageValue: 100, 
      completionRate: 89, 
      noShowRate: 11, 
      color: '#06b6d4' 
    },
    { 
      type: 'couple', 
      label: 'Casal', 
      count: 8, 
      revenue: 1200, 
      averageValue: 150, 
      completionRate: 88, 
      noShowRate: 12, 
      color: '#10b981' 
    },
    { 
      type: 'group', 
      label: 'Grupo', 
      count: 6, 
      revenue: 900, 
      averageValue: 150, 
      completionRate: 83, 
      noShowRate: 17, 
      color: '#f59e0b' 
    },
    { 
      type: 'supervision', 
      label: 'Supervisão', 
      count: 4, 
      revenue: 600, 
      averageValue: 150, 
      completionRate: 100, 
      noShowRate: 0, 
      color: '#ef4444' 
    }
  ];

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
          <button 
            onClick={clearError}
            className="ml-2 text-red-800 underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard Financeiro</h1>
          <p className="text-slate-600">
            Visão completa da sua situação financeira
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          {/* Filtros de Período */}
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-slate-500" />
            <input
              type="date"
              value={selectedPeriod.start}
              onChange={(e) => setSelectedPeriod(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
            <span className="text-slate-500">até</span>
            <input
              type="date"
              value={selectedPeriod.end}
              onChange={(e) => setSelectedPeriod(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Controles de Visualização */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'overview'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'detailed'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Detalhado
            </button>
          </div>

          {/* Botão de Exportar */}
          <button
            onClick={() => {/* Implementar exportação */}}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <>
          {/* Métricas Principais */}
          <FinancialMetrics
            totalRevenue={totalRevenue}
            totalExpenses={totalExpenses}
            netProfit={netProfit}
            totalConsultations={totalConsultations}
            completedConsultations={completedConsultations}
            pendingConsultations={pendingConsultations}
            averageTicket={averageTicket}
            monthlyGrowth={monthlyGrowth}
            previousMonthRevenue={previousMonthRevenue}
            goalRevenue={goalRevenue}
            goalProgress={goalProgress}
          />

          {/* Gráfico de Receita */}
          <RevenueChart 
            data={revenueChartData}
            isLoading={isLoading}
          />

          {/* Fluxo de Caixa */}
          <CashFlowChart 
            data={cashFlowData}
            isLoading={isLoading}
          />

          {/* Layout Responsivo para Análises */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Breakdown de Despesas */}
            <ExpenseBreakdown 
              data={expenseData}
              isLoading={isLoading}
            />

            {/* Status de Pagamentos */}
            <PaymentStatusPie 
              data={paymentStatusData}
              isLoading={isLoading}
            />
          </div>

          {/* Performance por Tipo de Consulta */}
          <ConsultationPerformance 
            data={consultationPerformanceData}
            isLoading={isLoading}
          />

          {/* Transações Recentes (apenas na visão detalhada) */}
          {viewMode === 'detailed' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Transações Recentes</h2>
                <button
                  onClick={() => {/* Navegar para lista completa */}}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  Ver todas →
                </button>
              </div>
              
              <div className="space-y-3">
                {transactions.slice(0, 8).map(t => (
                  <div key={t.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        t.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="font-semibold text-slate-700">{t.description}</p>
                        <p className="text-sm text-slate-500">
                          {new Date(t.date).toLocaleDateString('pt-BR')} • {t.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        t.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {t.type === 'income' ? '+' : '-'}R$ {t.amount.toFixed(2)}
                      </p>
                      <span className={`text-xs font-semibold ${
                        t.status === 'completed' ? 'text-green-600' : 
                        t.status === 'pending' ? 'text-orange-500' : 'text-red-500'
                      }`}>
                        {t.status === 'completed' ? 'Pago' : 
                         t.status === 'pending' ? 'Pendente' : 'Cancelado'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Financials;
