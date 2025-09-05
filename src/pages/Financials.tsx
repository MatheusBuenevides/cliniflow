import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, PlusCircle, Clock } from 'lucide-react';
import { InfoCard } from '../components/ui';
import { mockData } from '../services/mockData';

const Financials: React.FC = () => (
  <div>
    <h1 className="text-3xl font-bold text-slate-800 mb-6">Financeiro</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <InfoCard 
        icon={<DollarSign size={24} />} 
        title="Faturamento Total" 
        value={`R$ ${mockData.financials.totalRevenue.toFixed(2)}`} 
        colorClass="text-green-600" 
      />
      <InfoCard 
        icon={<PlusCircle size={24} />} 
        title="Consultas Pagas" 
        value={mockData.financials.paidConsultations} 
        colorClass="text-blue-600" 
      />
      <InfoCard 
        icon={<Clock size={24} />} 
        title="Pagamentos Pendentes" 
        value={mockData.financials.pendingConsultations} 
        colorClass="text-orange-600" 
      />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Receita por Mês</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockData.financials.monthlyRevenue}>
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
          {mockData.financials.recentTransactions.map(t => (
            <div key={t.id} className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-700">{t.patient}</p>
                <p className="text-sm text-slate-500">{t.date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-800">R$ {t.value.toFixed(2)}</p>
                <span className={`text-xs font-semibold ${t.status === 'Pago' ? 'text-green-600' : 'text-orange-500'}`}>
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Financials;
