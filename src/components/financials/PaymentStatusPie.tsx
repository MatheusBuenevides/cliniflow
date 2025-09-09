import React, { useState } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend
} from 'recharts';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle,
  TrendingUp,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';

interface PaymentStatusPieProps {
  data: Array<{
    status: string;
    count: number;
    amount: number;
    percentage: number;
    color: string;
  }>;
  isLoading?: boolean;
}

const PaymentStatusPie: React.FC<PaymentStatusPieProps> = ({ data, isLoading = false }) => {
  const [showAmounts, setShowAmounts] = useState(true);
  const [showPercentages, setShowPercentages] = useState(true);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'pending':
        return <Clock size={16} className="text-orange-500" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-500" />;
      case 'overdue':
        return <AlertTriangle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Pagos';
      case 'pending':
        return 'Pendentes';
      case 'cancelled':
        return 'Cancelados';
      case 'overdue':
        return 'Em Atraso';
      default:
        return status;
    }
  };

  const formatTooltipValue = (value: number, name: string) => {
    if (showAmounts) {
      return [formatCurrency(value), `${getStatusLabel(name)} (Valor)`];
    }
    return [value, `${getStatusLabel(name)} (Quantidade)`];
  };

  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);
  const completedAmount = data.find(d => d.status === 'completed')?.amount || 0;
  const pendingAmount = data.find(d => d.status === 'pending')?.amount || 0;
  const overdueAmount = data.find(d => d.status === 'overdue')?.amount || 0;
  
  const collectionRate = totalAmount > 0 ? (completedAmount / totalAmount) * 100 : 0;
  const pendingRate = totalAmount > 0 ? (pendingAmount / totalAmount) * 100 : 0;
  const overdueRate = totalAmount > 0 ? (overdueAmount / totalAmount) * 100 : 0;

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
            Status de Pagamentos
          </h2>
          <p className="text-sm text-slate-600">
            Análise de inadimplência e cobrança
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          {/* Controle de Valores */}
          <button
            onClick={() => setShowAmounts(!showAmounts)}
            className={`p-2 rounded-lg transition-colors ${
              showAmounts
                ? 'bg-purple-100 text-purple-600'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title={showAmounts ? 'Mostrar quantidades' : 'Mostrar valores'}
          >
            {showAmounts ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>

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
            {showPercentages ? <Eye size={16} /> : <EyeOff size={16} />}
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
        {/* Gráfico de Pizza */}
        <div className="lg:col-span-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percentage }) => 
                    showPercentages ? `${getStatusLabel(status)}: ${percentage.toFixed(1)}%` : getStatusLabel(status)
                  }
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey={showAmounts ? "amount" : "count"}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={formatTooltipValue} />
                <Legend 
                  formatter={(value) => getStatusLabel(value)}
                  iconType="circle"
                />
              </PieChart>
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
                <span className="text-slate-600">Total de Transações:</span>
                <span className="font-semibold text-slate-800">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Quantidade Total:</span>
                <span className="font-semibold text-slate-800">
                  {totalCount}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Taxa de Cobrança:</span>
                <span className="font-semibold text-green-600">
                  {collectionRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Detalhamento por Status */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-800">Por Status</h3>
            {data
              .sort((a, b) => b.amount - a.amount)
              .map((item) => (
                <div key={item.status} className="flex items-center space-x-3">
                  {getStatusIcon(item.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        {getStatusLabel(item.status)}
                      </span>
                      <span className="text-sm font-semibold text-slate-800">
                        {showAmounts ? formatCurrency(item.amount) : item.count}
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
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Alertas e Insights */}
      <div className="mt-6 space-y-4">
        {/* Taxa de Cobrança */}
        <div className={`p-4 rounded-xl ${
          collectionRate >= 90 
            ? 'bg-green-50 border border-green-200' 
            : collectionRate >= 70 
            ? 'bg-yellow-50 border border-yellow-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start space-x-3">
            <TrendingUp size={20} className={`mt-0.5 ${
              collectionRate >= 90 
                ? 'text-green-600' 
                : collectionRate >= 70 
                ? 'text-yellow-600'
                : 'text-red-600'
            }`} />
            <div>
              <h4 className={`font-semibold mb-2 ${
                collectionRate >= 90 
                  ? 'text-green-800' 
                  : collectionRate >= 70 
                  ? 'text-yellow-800'
                  : 'text-red-800'
              }`}>
                Taxa de Cobrança: {collectionRate.toFixed(1)}%
              </h4>
              <div className={`text-sm ${
                collectionRate >= 90 
                  ? 'text-green-700' 
                  : collectionRate >= 70 
                  ? 'text-yellow-700'
                  : 'text-red-700'
              }`}>
                {collectionRate >= 90 && (
                  <p>Excelente! Sua taxa de cobrança está muito boa.</p>
                )}
                {collectionRate >= 70 && collectionRate < 90 && (
                  <p>Boa taxa de cobrança. Considere melhorar o follow-up com clientes pendentes.</p>
                )}
                {collectionRate < 70 && (
                  <p>Taxa de cobrança baixa. Revise sua estratégia de cobrança e follow-up.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Alertas de Valores Pendentes */}
        {pendingAmount > 0 && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <Clock size={20} className="text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-800 mb-2">
                  Valores Pendentes
                </h4>
                <p className="text-sm text-orange-700">
                  Você tem {formatCurrency(pendingAmount)} em pagamentos pendentes 
                  ({pendingRate.toFixed(1)}% do total). Considere enviar lembretes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Alertas de Valores em Atraso */}
        {overdueAmount > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <AlertTriangle size={20} className="text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800 mb-2">
                  Valores em Atraso
                </h4>
                <p className="text-sm text-red-700">
                  Atenção! Você tem {formatCurrency(overdueAmount)} em atraso 
                  ({overdueRate.toFixed(1)}% do total). Ação imediata recomendada.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatusPie;
