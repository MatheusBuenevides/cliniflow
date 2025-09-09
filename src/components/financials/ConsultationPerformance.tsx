import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
  LineChart as LineIcon,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';

interface ConsultationPerformanceProps {
  data: Array<{
    type: string;
    label: string;
    count: number;
    revenue: number;
    averageValue: number;
    completionRate: number;
    noShowRate: number;
    color: string;
  }>;
  isLoading?: boolean;
}

const ConsultationPerformance: React.FC<ConsultationPerformanceProps> = ({ data, isLoading = false }) => {
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');
  const [metric, setMetric] = useState<'revenue' | 'count' | 'averageValue' | 'completionRate'>('revenue');
  const [showPercentages, setShowPercentages] = useState(true);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatTooltipValue = (value: number, _name: string) => {
    const metricLabels: Record<string, string> = {
      revenue: 'Receita',
      count: 'Quantidade',
      averageValue: 'Valor Médio',
      completionRate: 'Taxa de Conclusão'
    };
    
    if (metric === 'revenue' || metric === 'averageValue') {
      return [formatCurrency(value), metricLabels[metric]];
    }
    if (metric === 'completionRate') {
      return [`${value.toFixed(1)}%`, metricLabels[metric]];
    }
    return [value, metricLabels[metric]];
  };

  const renderBarChart = () => (
    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
      <XAxis 
        dataKey="label" 
        tick={{ fill: '#64748b', fontSize: 12 }}
        axisLine={{ stroke: '#e0e0e0' }}
      />
      <YAxis 
        tick={{ fill: '#64748b', fontSize: 12 }}
        axisLine={{ stroke: '#e0e0e0' }}
        tickFormatter={metric === 'revenue' || metric === 'averageValue' ? formatCurrency : undefined}
      />
      <Tooltip formatter={formatTooltipValue} />
      <Bar 
        dataKey={metric} 
        radius={[4, 4, 0, 0]}
        fill="#8b5cf6"
      />
    </BarChart>
  );

  const renderPieChart = () => (
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ label, percentage }) => 
          showPercentages ? `${label}: ${percentage.toFixed(1)}%` : label
        }
        outerRadius={120}
        fill="#8884d8"
        dataKey={metric}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip formatter={formatTooltipValue} />
    </PieChart>
  );

  const renderLineChart = () => (
    <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
      <XAxis 
        dataKey="label" 
        tick={{ fill: '#64748b', fontSize: 12 }}
        axisLine={{ stroke: '#e0e0e0' }}
      />
      <YAxis 
        tick={{ fill: '#64748b', fontSize: 12 }}
        axisLine={{ stroke: '#e0e0e0' }}
        tickFormatter={metric === 'revenue' || metric === 'averageValue' ? formatCurrency : undefined}
      />
      <Tooltip formatter={formatTooltipValue} />
      <Line 
        type="monotone" 
        dataKey={metric} 
        stroke="#8b5cf6" 
        strokeWidth={3}
        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
        activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
      />
    </LineChart>
  );

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalConsultations = data.reduce((sum, item) => sum + item.count, 0);
  const averageCompletionRate = data.length > 0 
    ? data.reduce((sum, item) => sum + item.completionRate, 0) / data.length 
    : 0;
  const bestPerformingType = data.reduce((best, item) => 
    item.revenue > best.revenue ? item : best, data[0] || { revenue: 0, label: '' }
  );

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
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
            Performance por Tipo de Consulta
          </h2>
          <p className="text-sm text-slate-600">
            Análise comparativa de diferentes modalidades
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          {/* Controles de Métrica */}
          <div className="flex items-center space-x-2">
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value as any)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              <option value="revenue">Receita</option>
              <option value="count">Quantidade</option>
              <option value="averageValue">Valor Médio</option>
              <option value="completionRate">Taxa de Conclusão</option>
            </select>
          </div>

          {/* Controles de Tipo de Gráfico */}
          <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1">
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
              onClick={() => setChartType('pie')}
              className={`p-2 rounded-md transition-colors ${
                chartType === 'pie'
                  ? 'bg-white shadow-sm text-purple-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
              title="Gráfico de Pizza"
            >
              <PieIcon size={16} />
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
          </div>

          {/* Controle de Percentuais */}
          {chartType === 'pie' && (
            <button
              onClick={() => setShowPercentages(!showPercentages)}
              className={`p-2 rounded-lg transition-colors ${
                showPercentages
                  ? 'bg-purple-100 text-purple-600'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title={showPercentages ? 'Ocultar percentuais' : 'Mostrar percentuais'}
            >
              {showPercentages ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}

          {/* Botão de Exportar */}
          <button
            onClick={() => {/* Implementar exportação */}}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Exportar análise"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico */}
        <div className="lg:col-span-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? renderBarChart() : 
               chartType === 'pie' ? renderPieChart() : 
               renderLineChart()}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="space-y-4">
          {/* Resumo Geral */}
          <div className="bg-slate-50 p-4 rounded-xl">
            <h3 className="font-semibold text-slate-800 mb-3">Resumo Geral</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Total de Consultas:</span>
                <span className="font-semibold text-slate-800">
                  {totalConsultations}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Receita Total:</span>
                <span className="font-semibold text-slate-800">
                  {formatCurrency(totalRevenue)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Taxa Média de Conclusão:</span>
                <span className="font-semibold text-slate-800">
                  {averageCompletionRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Melhor Performance:</span>
                <span className="font-semibold text-slate-800">
                  {bestPerformingType.label}
                </span>
              </div>
            </div>
          </div>

          {/* Detalhamento por Tipo */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-800">Por Tipo de Consulta</h3>
            {data
              .sort((a, b) => b.revenue - a.revenue)
              .map((item) => (
                <div key={item.type} className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 truncate">
                        {item.label}
                      </span>
                      <span className="text-sm font-semibold text-slate-800">
                        {formatCurrency(item.revenue)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex-1 bg-slate-200 rounded-full h-2 mr-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(item.revenue / totalRevenue) * 100}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">
                        {((item.revenue / totalRevenue) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {item.count} consultas • {formatCurrency(item.averageValue)} médio • {item.completionRate.toFixed(1)}% conclusão
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Insights e Recomendações */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <div className="flex items-start space-x-3">
          <TrendingUp size={20} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Insights e Recomendações</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>
                • {bestPerformingType.label} é o tipo de consulta mais rentável, 
                representando {((bestPerformingType.revenue / totalRevenue) * 100).toFixed(1)}% da receita total
              </p>
              <p>
                • Taxa média de conclusão de {averageCompletionRate.toFixed(1)}% indica{' '}
                {averageCompletionRate >= 80 ? 'boa' : averageCompletionRate >= 60 ? 'moderada' : 'baixa'} aderência dos pacientes
              </p>
              {data.find(item => item.noShowRate > 20) && (
                <p>
                  • Alguns tipos de consulta têm alta taxa de faltas. 
                  Considere implementar lembretes mais efetivos.
                </p>
              )}
              <p>
                • Valor médio por consulta varia entre {formatCurrency(Math.min(...data.map(d => d.averageValue)))} e {formatCurrency(Math.max(...data.map(d => d.averageValue)))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationPerformance;
