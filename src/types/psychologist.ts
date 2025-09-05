// Tipos relacionados ao Psicólogo
export interface Psychologist {
  id: number;
  name: string;
  crp: string; // Registro no Conselho Regional de Psicologia
  email: string;
  phone: string;
  avatar?: string;
  bio: string; // Descrição da abordagem e especialidades
  specialties: string[]; // Lista de especialidades
  customUrl: string; // URL personalizada (ex: "ana-silva")
  workingHours: WorkingHours;
  sessionPrices: SessionPrices;
  createdAt: string;
  updatedAt: string;
}

export interface WorkingHours {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
}

export interface DaySchedule {
  start: string; // Formato: "08:00"
  end: string; // Formato: "18:00"
  lunchStart?: string; // Formato: "12:00"
  lunchEnd?: string; // Formato: "13:00"
}

export interface SessionPrices {
  initial: number; // Primeira consulta
  followUp: number; // Consulta de retorno
  online: number; // Telepsicologia
  duration: number; // Duração em minutos (30, 45, 60)
}
