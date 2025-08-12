import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, Users, DollarSign, Settings, Bell, Search, PlusCircle, Clock, ArrowLeft, ArrowRight } from 'lucide-react';

// Mock Data - Simula os dados que viriam do seu backend (Node.js)
const mockData = {
  user: {
    name: 'Dr(a). Ana Sousa',
    avatar: 'https://placehold.co/100x100/820AD1/FFFFFF?text=AS'
  },
  todayAppointments: [
    { id: 1, time: '09:00', patient: 'Carlos Pereira', type: 'Consulta Psicológica', status: 'Confirmado' },
    { id: 2, time: '10:00', patient: 'Beatriz Lima', type: 'Sessão de Fisioterapia', status: 'Confirmado' },
    { id: 3, time: '11:00', patient: 'Ricardo Alves', type: 'Consulta Nutricional', status: 'Aguardando' },
    { id: 4, time: '14:00', patient: 'Fernanda Costa', type: 'Retorno', status: 'Confirmado' },
  ],
  patients: [
    { id: 1, name: 'Carlos Pereira', lastVisit: '2024-07-15', phone: '(11) 98765-4321', email: 'carlos.p@example.com' },
    { id: 2, name: 'Beatriz Lima', lastVisit: '2024-07-18', phone: '(21) 91234-5678', email: 'beatriz.l@example.com' },
    { id: 3, name: 'Ricardo Alves', lastVisit: '2024-07-20', phone: '(31) 95555-8888', email: 'ricardo.a@example.com' },
    { id: 4, name: 'Fernanda Costa', lastVisit: '2024-06-25', phone: '(41) 98877-6655', email: 'fernanda.c@example.com' },
    { id: 5, name: 'Juliana Martins', lastVisit: '2024-07-02', phone: '(51) 99999-1111', email: 'juliana.m@example.com' },
  ],
  financials: {
    monthlyRevenue: [
      { month: 'Mar', faturamento: 4200 },
      { month: 'Abr', faturamento: 5100 },
      { month: 'Mai', faturamento: 6500 },
      { month: 'Jun', faturamento: 5800 },
      { month: 'Jul', faturamento: 7200 },
    ],
    totalRevenue: 28800,
    paidConsultations: 128,
    pendingConsultations: 12,
    recentTransactions: [
        {id: 1, patient: 'Carlos Pereira', date: '2024-07-15', value: 250, status: 'Pago'},
        {id: 2, patient: 'Beatriz Lima', date: '2024-07-18', value: 180, status: 'Pago'},
        {id: 3, patient: 'Ricardo Alves', date: '2024-07-20', value: 200, status: 'Pendente'},
        {id: 4, patient: 'Juliana Martins', date: '2024-07-02', value: 250, status: 'Pago'},
    ]
  },
  calendarAppointments: {
    '2024-07-22': [{ time: '10:00', patient: 'Lucas Mendes' }, { time: '14:00', patient: 'Sofia Ribeiro' }],
    '2024-07-23': [{ time: '09:00', patient: 'Carlos Pereira' }, { time: '10:00', patient: 'Beatriz Lima' }, { time: '11:00', patient: 'Ricardo Alves' }, { time: '14:00', patient: 'Fernanda Costa' }],
    '2024-07-25': [{ time: '11:00', patient: 'Mariana Gomes' }],
    '2024-08-01': [{ time: '15:00', patient: 'Tiago Nunes' }],
  } as Record<string, { time: string; patient: string }[]>
};

// Componente: Card genérico para o Dashboard
const InfoCard = ({ icon, title, value, subtitle, colorClass = 'text-purple-600' }: { icon: React.ReactNode; title: string; value: string | number; subtitle?: string; colorClass?: string }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm flex items-start space-x-4">
    <div className={`p-3 rounded-full bg-purple-100 ${colorClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
    </div>
  </div>
);

// Componente: Dashboard
const Dashboard = () => {
    const nextAppointment = mockData.todayAppointments[0];
    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <InfoCard icon={<Calendar size={24} />} title="Consultas Hoje" value={mockData.todayAppointments.length} subtitle="Agendadas para hoje" />
                <InfoCard icon={<DollarSign size={24} />} title="Faturamento (Mês)" value={`R$ ${mockData.financials.monthlyRevenue.slice(-1)[0].faturamento.toFixed(2)}`} subtitle="Receita em Julho" />
                <InfoCard icon={<Users size={24} />} title="Novos Pacientes (Mês)" value="8" subtitle="Desde 1 de Julho" />
                <InfoCard icon={<Clock size={24} />} title="Próxima Consulta" value={nextAppointment.time} subtitle={`com ${nextAppointment.patient}`} />
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

// Componente: Agenda
const Agenda = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2024, 6, 23)); // July 23, 2024

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay();

    const daysInMonth = [];
    for (let i = 1; i <= endOfMonth.getDate(); i++) {
        daysInMonth.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const today = new Date();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800">Agenda</h1>
                <div className="flex items-center space-x-2">
                    <button onClick={prevMonth} className="p-2 rounded-md hover:bg-slate-200"><ArrowLeft size={20} /></button>
                    <h2 className="text-xl font-semibold text-slate-700 w-40 text-center">
                        {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button onClick={nextMonth} className="p-2 rounded-md hover:bg-slate-200"><ArrowRight size={20} /></button>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="grid grid-cols-7 gap-2 text-center font-semibold text-slate-500 text-sm mb-4">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {Array(startDay).fill(null).map((_, i) => <div key={`empty-${i}`}></div>)}
                    {daysInMonth.map(day => {
                        const dateString = day.toISOString().split('T')[0];
                        const appointments = mockData.calendarAppointments[dateString] || [];
                        const isToday = day.toDateString() === today.toDateString();

                        return (
                            <div key={day.toString()} className={`p-2 border rounded-lg h-32 flex flex-col ${isToday ? 'border-purple-500 bg-purple-50' : 'border-slate-200'}`}>
                                <span className={`font-bold ${isToday ? 'text-purple-600' : 'text-slate-600'}`}>{day.getDate()}</span>
                                <div className="mt-1 space-y-1 overflow-y-auto">
                                    {appointments.map(apt => (
                                        <div key={apt.time} className="bg-purple-200 text-purple-800 text-xs p-1 rounded">
                                            {apt.time} - {apt.patient.split(' ')[0]}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// Componente: Pacientes
const Patients = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredPatients = mockData.patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800">Pacientes</h1>
                <div className="relative w-full max-w-xs">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar paciente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">Nome</th>
                            <th className="p-4 font-semibold text-slate-600">Última Consulta</th>
                            <th className="p-4 font-semibold text-slate-600">Contato</th>
                            <th className="p-4 font-semibold text-slate-600">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.map(patient => (
                            <tr key={patient.id} className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="p-4 text-slate-800 font-medium">{patient.name}</td>
                                <td className="p-4 text-slate-600">{new Date(patient.lastVisit).toLocaleDateString('pt-BR')}</td>
                                <td className="p-4 text-slate-600">
                                    <div>{patient.phone}</div>
                                    <div className="text-sm text-slate-400">{patient.email}</div>
                                </td>
                                <td className="p-4">
                                    <button className="text-purple-600 hover:text-purple-800 font-semibold">Ver Prontuário</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Componente: Financeiro
const Financials = () => (
    <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Financeiro</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <InfoCard icon={<DollarSign size={24} />} title="Faturamento Total" value={`R$ ${mockData.financials.totalRevenue.toFixed(2)}`} colorClass="text-green-600" />
            <InfoCard icon={<PlusCircle size={24} />} title="Consultas Pagas" value={mockData.financials.paidConsultations} colorClass="text-blue-600" />
            <InfoCard icon={<Clock size={24} />} title="Pagamentos Pendentes" value={mockData.financials.pendingConsultations} colorClass="text-orange-600" />
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
                                <span className={`text-xs font-semibold ${t.status === 'Pago' ? 'text-green-600' : 'text-orange-500'}`}>{t.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);


// Componente: Sidebar (Menu Lateral)
const Sidebar = ({ activePage, setActivePage }: { activePage: string; setActivePage: (page: string) => void }) => {
    const navItems = [
        { name: 'Dashboard', icon: <BarChart width={20} height={20} /> },
        { name: 'Agenda', icon: <Calendar size={20} /> },
        { name: 'Pacientes', icon: <Users size={20} /> },
        { name: 'Financeiro', icon: <DollarSign size={20} /> },
        { name: 'Configurações', icon: <Settings size={20} /> },
    ];

    return (
        <aside className="w-64 bg-white flex flex-col h-screen p-4 border-r border-slate-200">
            <div className="text-2xl font-bold text-purple-600 mb-10 ml-2">CliniFlow</div>
            <nav className="flex-grow">
                <ul>
                    {navItems.map(item => (
                        <li key={item.name}>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setActivePage(item.name); }}
                                className={`flex items-center space-x-3 px-3 py-3 my-1 rounded-lg font-semibold transition-all duration-200 ${activePage === item.name ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 hover:bg-purple-50 hover:text-purple-600'}`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="flex items-center space-x-3 p-2">
                <img src={mockData.user.avatar} alt="Avatar do usuário" className="w-10 h-10 rounded-full" />
                <div>
                    <p className="font-bold text-slate-800">{mockData.user.name}</p>
                    <a href="#" className="text-xs text-purple-600 hover:underline">Ver Perfil</a>
                </div>
            </div>
        </aside>
    );
};

// Componente: Header (Cabeçalho Principal)
const Header = () => (
    <header className="flex justify-between items-center py-4">
        <div>
            {/* O título da página agora é gerenciado dentro de cada componente de página */}
        </div>
        <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-slate-200 text-slate-500">
                <Bell size={22} />
            </button>
            <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-200 shadow-sm">
                <PlusCircle size={20} />
                <span>Novo Agendamento</span>
            </button>
        </div>
    </header>
);

// Componente Principal da Aplicação
export default function App() {
    const [activePage, setActivePage] = useState('Dashboard');

    const renderPage = () => {
        switch (activePage) {
            case 'Dashboard':
                return <Dashboard />;
            case 'Agenda':
                return <Agenda />;
            case 'Pacientes':
                return <Patients />;
            case 'Financeiro':
                return <Financials />;
            case 'Configurações':
                return <h1 className="text-3xl font-bold text-slate-800">Configurações</h1>;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="flex bg-slate-50 font-sans">
            <Sidebar activePage={activePage} setActivePage={setActivePage} />
            <main className="flex-1 p-8 h-screen overflow-y-auto">
                <Header />
                {renderPage()}
            </main>
        </div>
    );
}
