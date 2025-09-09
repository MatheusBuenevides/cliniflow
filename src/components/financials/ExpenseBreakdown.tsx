import React, { useState } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { 
  PieChart as PieIcon, 
  BarChart3, 
  TrendingDown,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';

interface ExpenseBreakdownProps {
  data: Array<{
    category: string;
    amount: number;
    percentage: number;
    count: number;
    color: string;
  }>;
  isLoading?: boolean;
}

const ExpenseBreakdown: React.FC<ExpenseBreakdownProps> = ({ data, isLoading = false }) => {
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [showPercentages, setShowPercentages] = useState(true);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatTooltipValue = (value: number, name: string) => {
    const category = data.find(item => item.category === name);
    return [
      formatCurrency(value),
      category?.category || name
    ];
  };

  const renderPieChart = () => (
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ category, percentage }) => 
          showPercentages ? `${category}: ${percentage.toFixed(1)}%` : category
        }
        outerRadius={120}
        fill="#8884d8"
        dataKey="amount"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip formatter={formatTooltipValue} />
    </PieChart>
  );

  const renderBarChart = () => (
    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
      <XAxis 
        dataKey="category" 
        tick={{ fill: '#64748b', fontSize: 12 }}
        axisLine={{ stroke: '#e0e0e0' }}
      />
      <YAxis 
        tick={{ fill: '#64748b', fontSize: 12 }}
        axisLine={{ stroke: '#e0e0e0' }}
        tickFormatter={formatCurrency}
      />
      <Tooltip formatter={formatTooltipValue} />
      <Bar 
        dataKey="amount" 
        radius={[4, 4, 0, 0]}
        fill="#ef4444"
      />
    </BarChart>
  );

  const totalExpenses = data.reduce((sum, item) => sum + item.amount, 0);
  const largestCategory = data.reduce((max, item) => 
    item.amount > max.amount ? item : max, data[0] || { amount: 0, category: '', percentage: 0, count: 0, color: '' }
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
            Análise de Despesas
          </h2>
          <p className="text-sm text-slate-600">
            Distribuição das despesas por categoria
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          {/* Controles de Visualização */}
          <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1">
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

          {/* Controle de Percentuais */}
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
              {chartType === 'pie' ? renderPieChart() : renderBarChart()}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lista de Categorias */}
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl">
            <h3 className="font-semibold text-slate-800 mb-3">Resumo</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Total de Despesas:</span>
                <span className="font-semibold text-slate-800">
                  {formatCurrency(totalExpenses)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Categorias:</span>
                <span className="font-semibold text-slate-800">
                  {data.length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Maior Categoria:</span>
                <span className="font-semibold text-slate-800">
                  {largestCategory.category}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-slate-800">Por Categoria</h3>
            {data
              .sort((a, b) => b.amount - a.amount)
              .map((item) => (
                <div key={item.category} className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 truncate">
                        {item.category}
                      </span>
                      <span className="text-sm font-semibold text-slate-800">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex-1 bg-slate-200 rounded-full h-2 mr-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {item.count} transação(ões)
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <div className="flex items-start space-x-3">
          <TrendingDown size={20} className="text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Insights</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>
                • {largestCategory.category} representa {largestCategory.percentage.toFixed(1)}% 
                do total de despesas ({formatCurrency(largestCategory.amount)})
              </p>
              <p>
                • As 3 maiores categorias somam{' '}
                {data
                  .sort((a, b) => b.amount - a.amount)
                  .slice(0, 3)
                  .reduce((sum, item) => sum + item.percentage, 0)
                  .toFixed(1)}% das despesas totais
              </p>
              {data.length > 0 && (
                <p>
                  • Valor médio por transação: {formatCurrency(
                    totalExpenses / data.reduce((sum, item) => sum + item.count, 0)
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseBreakdown;
