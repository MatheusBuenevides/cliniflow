import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Users, DollarSign, Clock } from 'lucide-react';
import { InfoCard } from '../components/ui';
import { mockData } from '../services/mockData';

const Dashboard: React.FC = () => {
  const nextAppointment = mockData.todayAppointments[0];
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <InfoCard 
          icon={<Calendar size={24} />} 
          title="Consultas Hoje" 
          value={mockData.todayAppointments.length} 
          subtitle="Agendadas para hoje" 
        />
        <InfoCard 
          icon={<DollarSign size={24} />} 
          title="Faturamento (Mês)" 
          value={`R$ ${mockData.financials.monthlyRevenue.slice(-1)[0].faturamento.toFixed(2)}`} 
          subtitle="Receita em Julho" 
        />
        <InfoCard 
          icon={<Users size={24} />} 
          title="Novos Pacientes (Mês)" 
          value="8" 
          subtitle="Desde 1 de Julho" 
        />
        <InfoCard 
          icon={<Clock size={24} />} 
          title="Próxima Consulta" 
          value={nextAppointment.time} 
          subtitle={`com ${nextAppointment.patient}`} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Evolução do Faturamento</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockData.financials.monthlyRevenue} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" tick={{ fill: '#64748b' }} />
              <YAxis tick={{ fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="faturamento" stroke="#820AD1" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Consultas de Hoje</h2>
          <div className="space-y-4">
            {mockData.todayAppointments.map(apt => (
              <div key={apt.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Clock size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">{apt.patient}</p>
                    <p className="text-xs text-slate-500">{apt.time} - {apt.type}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${apt.status === 'Confirmado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
