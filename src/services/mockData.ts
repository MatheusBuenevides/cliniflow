// Mock Data - Simula os dados que viriam do seu backend (Node.js)
export const mockData = {
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
