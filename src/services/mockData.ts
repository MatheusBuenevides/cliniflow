// Importação direta da interface
interface Psychologist {
  id: number;
  name: string;
  crp: string;
  email: string;
  phone: string;
  avatar?: string;
  bio: string;
  specialties: string[];
  customUrl: string;
  workingHours: WorkingHours;
  sessionPrices: SessionPrices;
  createdAt: string;
  updatedAt: string;
}

interface WorkingHours {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
}

interface DaySchedule {
  start: string;
  end: string;
  lunchStart?: string;
  lunchEnd?: string;
}

interface SessionPrices {
  initial: number;
  followUp: number;
  online: number;
  duration: number;
}

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

// Mock Data para Psicólogos - Perfis Públicos
export const mockPsychologists: Psychologist[] = [
  {
    id: 1,
    name: 'Dr. João Silva',
    crp: '06/123456',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-1234',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
    bio: 'Psicólogo clínico especializado em terapia cognitivo-comportamental com mais de 10 anos de experiência. Atendo adolescentes e adultos com foco em ansiedade, depressão e transtornos do humor. Acredito em um processo terapêutico colaborativo e humanizado.',
    specialties: [
      'Terapia Cognitivo-Comportamental',
      'Ansiedade',
      'Depressão',
      'Transtornos do Humor',
      'Terapia de Casal',
      'Orientação Vocacional'
    ],
    customUrl: 'joao-silva',
    workingHours: {
      monday: { start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
      tuesday: { start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
      wednesday: { start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
      thursday: { start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
      friday: { start: '08:00', end: '17:00', lunchStart: '12:00', lunchEnd: '13:00' }
    },
    sessionPrices: {
      initial: 150,
      followUp: 120,
      online: 100,
      duration: 50
    },
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'Dra. Maria Santos',
    crp: '06/789012',
    email: 'maria.santos@email.com',
    phone: '(11) 98888-5678',
    avatar: 'https://images.unsplash.com/photo-1594824388852-8a0b5b80b69a?w=300&h=300&fit=crop&crop=face',
    bio: 'Psicóloga especializada em psicologia clínica e neuropsicologia. Atendo crianças, adolescentes e adultos com foco em transtornos de aprendizagem, TDAH e reabilitação cognitiva. Trabalho com uma abordagem integrativa e multidisciplinar.',
    specialties: [
      'Neuropsicologia',
      'TDAH',
      'Transtornos de Aprendizagem',
      'Psicologia Infantil',
      'Avaliação Psicológica',
      'Reabilitação Cognitiva'
    ],
    customUrl: 'maria-santos',
    workingHours: {
      monday: { start: '09:00', end: '17:00', lunchStart: '12:00', lunchEnd: '13:00' },
      tuesday: { start: '09:00', end: '17:00', lunchStart: '12:00', lunchEnd: '13:00' },
      wednesday: { start: '09:00', end: '17:00', lunchStart: '12:00', lunchEnd: '13:00' },
      thursday: { start: '09:00', end: '17:00', lunchStart: '12:00', lunchEnd: '13:00' },
      friday: { start: '09:00', end: '16:00', lunchStart: '12:00', lunchEnd: '13:00' },
      saturday: { start: '09:00', end: '12:00' }
    },
    sessionPrices: {
      initial: 180,
      followUp: 150,
      online: 120,
      duration: 60
    },
    createdAt: '2023-03-20T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 3,
    name: 'Dr. Carlos Oliveira',
    crp: '06/345678',
    email: 'carlos.oliveira@email.com',
    phone: '(11) 97777-9012',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face',
    bio: 'Psicólogo clínico com especialização em terapia humanística e abordagem centrada na pessoa. Atendo adultos e idosos com foco em questões existenciais, luto, envelhecimento e qualidade de vida. Acredito no potencial de crescimento e autoconhecimento de cada indivíduo.',
    specialties: [
      'Terapia Humanística',
      'Abordagem Centrada na Pessoa',
      'Psicologia do Envelhecimento',
      'Processamento de Luto',
      'Questões Existenciais',
      'Qualidade de Vida'
    ],
    customUrl: 'carlos-oliveira',
    workingHours: {
      monday: { start: '14:00', end: '20:00' },
      tuesday: { start: '14:00', end: '20:00' },
      wednesday: { start: '14:00', end: '20:00' },
      thursday: { start: '14:00', end: '20:00' },
      friday: { start: '14:00', end: '19:00' }
    },
    sessionPrices: {
      initial: 130,
      followUp: 110,
      online: 90,
      duration: 50
    },
    createdAt: '2023-06-10T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
];

// Função para buscar psicólogo por customUrl
export const getPsychologistByCustomUrl = (customUrl: string): Psychologist | null => {
  return mockPsychologists.find(psychologist => psychologist.customUrl === customUrl) || null;
};
