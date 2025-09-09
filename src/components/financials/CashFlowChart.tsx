import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown,
  Activity,
  BarChart3,
  LineChart as LineIcon,
  Download,
  Calendar,
  DollarSign
} from 'lucide-react';

interface CashFlowChartProps {
  data: Array<{
    month: string;
    inflow: number;
    outflow: number;
    netCashFlow: number;
    cumulativeCashFlow: number;
    projectedInflow?: number;
    projectedOutflow?: number;
  }>;
  isLoading?: boolean;
}

const CashFlowChart: React.FC<CashFlowChartProps> = ({ data, isLoading = false }) => {
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('area');
  const [viewMode, setViewMode] = useState<'net' | 'detailed' | 'projection'>('net');

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
      inflow: 'Entradas',
      outflow: 'Saídas',
      netCashFlow: 'Fluxo Líquido',
      cumulativeCashFlow: 'Acumulado',
      projectedInflow: 'Projeção Entradas',
      projectedOutflow: 'Projeção Saídas'
    };
    
    return [formatCurrency(value), labelMap[name] || name];
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
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
            {viewMode === 'net' && (
              <Area 
                type="monotone" 
                dataKey="netCashFlow" 
                stroke="#3b82f6" 
                fill="#3b82f6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            )}
            {viewMode === 'detailed' && (
              <>
                <Area 
                  type="monotone" 
                  dataKey="inflow" 
                  stackId="1"
                  stroke="#10b981" 
                  fill="#10b981"
                  fillOpacity={0.6}
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="outflow" 
                  stackId="2"
                  stroke="#ef4444" 
                  fill="#ef4444"
                  fillOpacity={0.6}
                  strokeWidth={2}
                />
              </>
            )}
            {viewMode === 'projection' && data[0]?.projectedInflow && (
              <>
                <Area 
                  type="monotone" 
                  dataKey="inflow" 
                  stroke="#10b981" 
                  fill="#10b981"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="outflow" 
                  stroke="#ef4444" 
                  fill="#ef4444"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="projectedInflow" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="projectedOutflow" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
                />
              </>
            )}
          </AreaChart>
        );

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
            {viewMode === 'net' && (
              <Line 
                type="monotone" 
                dataKey="netCashFlow" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            )}
            {viewMode === 'detailed' && (
              <>
                <Line 
                  type="monotone" 
                  dataKey="inflow" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="outflow" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="netCashFlow" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
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
            {viewMode === 'net' && (
              <Bar 
                dataKey="netCashFlow" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              />
            )}
            {viewMode === 'detailed' && (
              <>
                <Bar 
                  dataKey="inflow" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="outflow" 
                  fill="#ef4444" 
                  radius={[4, 4, 0, 0]}
                />
              </>
            )}
          </BarChart>
        );

      default:
        return <div>Gráfico não disponível</div>;
    }
  };

  const totalInflow = data.reduce((sum, item) => sum + item.inflow, 0);
  const totalOutflow = data.reduce((sum, item) => sum + item.outflow, 0);
  const totalNetFlow = data.reduce((sum, item) => sum + item.netCashFlow, 0);
  const finalCumulative = data[data.length - 1]?.cumulativeCashFlow || 0;
  const averageMonthlyFlow = data.length > 0 ? totalNetFlow / data.length : 0;

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
            Fluxo de Caixa
          </h2>
          <p className="text-sm text-slate-600">
            {viewMode === 'net' && 'Fluxo líquido mensal'}
            {viewMode === 'detailed' && 'Entradas e saídas detalhadas'}
            {viewMode === 'projection' && 'Projeções baseadas em histórico'}
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          {/* Controles de Visualização */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('net')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'net'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Líquido
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
            {data[0]?.projectedInflow && (
              <button
                onClick={() => setViewMode('projection')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'projection'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Projeção
              </button>
            )}
          </div>

          {/* Controles de Tipo de Gráfico */}
          <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1">
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
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded-md transition-colors ${
                chartType === 'line'
                  ? 'bg-white shadow-sm text-purple-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
              title="Gráfico de Linha"
            >
              <LineIcon size={16} />
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

      {/* Estatísticas do Fluxo de Caixa */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-200">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp size={20} className="text-green-600 mr-2" />
            <span className="text-sm text-slate-600">Total Entradas</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(totalInflow)}
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingDown size={20} className="text-red-600 mr-2" />
            <span className="text-sm text-slate-600">Total Saídas</span>
          </div>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(totalOutflow)}
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <DollarSign size={20} className={`mr-2 ${totalNetFlow >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            <span className="text-sm text-slate-600">Fluxo Líquido</span>
          </div>
          <div className={`text-2xl font-bold ${totalNetFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(totalNetFlow)}
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Calendar size={20} className="text-blue-600 mr-2" />
            <span className="text-sm text-slate-600">Média Mensal</span>
          </div>
          <div className={`text-2xl font-bold ${averageMonthlyFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(averageMonthlyFlow)}
          </div>
        </div>
      </div>

      {/* Análise de Tendência */}
      <div className="mt-6 p-4 bg-slate-50 rounded-xl">
        <h3 className="font-semibold text-slate-800 mb-3">Análise de Tendência</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-slate-600">Saldo Final:</span>
            <span className={`ml-2 font-semibold ${finalCumulative >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(finalCumulative)}
            </span>
          </div>
          <div>
            <span className="text-slate-600">Meses Positivos:</span>
            <span className="ml-2 font-semibold text-slate-800">
              {data.filter(item => item.netCashFlow > 0).length} de {data.length}
            </span>
          </div>
          <div>
            <span className="text-slate-600">Tendência:</span>
            <span className={`ml-2 font-semibold ${
              averageMonthlyFlow > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {averageMonthlyFlow > 0 ? 'Crescimento' : 'Declínio'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashFlowChart;
