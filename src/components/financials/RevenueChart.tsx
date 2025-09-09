import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  BarChart3, 
  Activity,
  Download
} from 'lucide-react';

interface RevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
    consultations: number;
    previousYear?: number;
  }>;
  isLoading?: boolean;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data, isLoading = false }) => {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const [viewMode, setViewMode] = useState<'revenue' | 'profit' | 'comparison'>('revenue');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatTooltipValue = (value: number, name: string) => {
    const labelMap: Record<string, string> = {
      revenue: 'Receita',
      expenses: 'Despesas',
      profit: 'Lucro',
      consultations: 'Consultas',
      previousYear: 'Ano Anterior'
    };
    
    if (name === 'consultations') {
      return [value, labelMap[name] || name];
    }
    
    return [formatCurrency(value), labelMap[name] || name];
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#e0e0e0' }}
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#e0e0e0' }}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              formatter={formatTooltipValue}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            {viewMode === 'revenue' && (
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
              />
            )}
            {viewMode === 'profit' && (
              <>
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </>
            )}
            {viewMode === 'comparison' && data[0]?.previousYear && (
              <>
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="previousYear" 
                  stroke="#6b7280" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#6b7280', strokeWidth: 2, r: 3 }}
                />
              </>
            )}
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#e0e0e0' }}
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#e0e0e0' }}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              formatter={formatTooltipValue}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            {viewMode === 'revenue' && (
              <Bar 
                dataKey="revenue" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
              />
            )}
            {viewMode === 'profit' && (
              <>
                <Bar 
                  dataKey="revenue" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="expenses" 
                  fill="#ef4444" 
                  radius={[4, 4, 0, 0]}
                />
              </>
            )}
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#e0e0e0' }}
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#e0e0e0' }}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              formatter={formatTooltipValue}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            {viewMode === 'revenue' && (
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                fill="#10b981"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            )}
            {viewMode === 'profit' && (
              <>
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  fill="#10b981"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ef4444" 
                  fill="#ef4444"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </>
            )}
          </AreaChart>
        );

      default:
        return <div>Gráfico não disponível</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Evolução Financeira
          </h2>
          <p className="text-sm text-slate-600">
            {viewMode === 'revenue' && 'Receita mensal nos últimos 12 meses'}
            {viewMode === 'profit' && 'Receita, despesas e lucro mensal'}
            {viewMode === 'comparison' && 'Comparativo com ano anterior'}
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          {/* Controles de Visualização */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('revenue')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'revenue'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Receita
            </button>
            <button
              onClick={() => setViewMode('profit')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'profit'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Lucro
            </button>
            {data[0]?.previousYear && (
              <button
                onClick={() => setViewMode('comparison')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'comparison'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Comparativo
              </button>
            )}
          </div>

          {/* Controles de Tipo de Gráfico */}
          <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded-md transition-colors ${
                chartType === 'line'
                  ? 'bg-white shadow-sm text-purple-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
              title="Gráfico de Linha"
            >
              <TrendingUp size={16} />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-2 rounded-md transition-colors ${
                chartType === 'bar'
                  ? 'bg-white shadow-sm text-purple-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
              title="Gráfico de Barras"
            >
              <BarChart3 size={16} />
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`p-2 rounded-md transition-colors ${
                chartType === 'area'
                  ? 'bg-white shadow-sm text-purple-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
              title="Gráfico de Área"
            >
              <Activity size={16} />
            </button>
          </div>

          {/* Botão de Exportar */}
          <button
            onClick={() => {/* Implementar exportação */}}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Exportar gráfico"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(data.reduce((sum, item) => sum + item.revenue, 0))}
          </div>
          <div className="text-sm text-slate-600">Receita Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(data.reduce((sum, item) => sum + item.expenses, 0))}
          </div>
          <div className="text-sm text-slate-600">Despesas Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(data.reduce((sum, item) => sum + item.profit, 0))}
          </div>
          <div className="text-sm text-slate-600">Lucro Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {data.reduce((sum, item) => sum + item.consultations, 0)}
          </div>
          <div className="text-sm text-slate-600">Consultas Total</div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
