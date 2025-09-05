import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, PlusCircle, Clock } from 'lucide-react';
import { InfoCard } from '../components/ui';
import { useFinancialStore } from '../stores/useFinancialStore';

const Financials: React.FC = () => {
  const { 
    transactions, 
    financialReport, 
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

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Calcular estatísticas básicas
  const totalRevenue = transactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const paidConsultations = transactions
    .filter(t => t.type === 'income' && t.category === 'consultation' && t.status === 'completed')
    .length;

  const pendingConsultations = transactions
    .filter(t => t.type === 'income' && t.category === 'consultation' && t.status === 'pending')
    .length;

  // Dados mockados para o gráfico
  const chartData = [
    { month: 'Jan', faturamento: 240 },
    { month: 'Fev', faturamento: 180 },
    { month: 'Mar', faturamento: 320 },
    { month: 'Abr', faturamento: 280 },
    { month: 'Mai', faturamento: 350 },
    { month: 'Jun', faturamento: 290 }
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
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Financeiro</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <InfoCard 
              icon={<DollarSign size={24} />} 
              title="Faturamento Total" 
              value={`R$ ${totalRevenue.toFixed(2)}`} 
              colorClass="text-green-600" 
            />
            <InfoCard 
              icon={<PlusCircle size={24} />} 
              title="Consultas Pagas" 
              value={paidConsultations} 
              colorClass="text-blue-600" 
            />
            <InfoCard 
              icon={<Clock size={24} />} 
              title="Pagamentos Pendentes" 
              value={pendingConsultations} 
              colorClass="text-orange-600" 
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Receita por Mês</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" tick={{ fill: '#64748b' }} />
                  <YAxis tick={{ fill: '#64748b' }} />
                  <Tooltip
                    cursor={{ fill: 'rgba(130, 10, 209, 0.1)' }}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Bar dataKey="faturamento" fill="#820AD1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Transações Recentes</h2>
              <div className="space-y-3">
                {transactions.slice(0, 5).map(t => (
                  <div key={t.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-700">{t.description}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(t.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
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
          </div>
        </>
      )}
    </div>
  );
};

export default Financials;
