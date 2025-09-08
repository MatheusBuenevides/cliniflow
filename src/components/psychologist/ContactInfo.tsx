import React from 'react';
import { Phone, Mail, MapPin, Clock, Globe } from 'lucide-react';
// Interface local para evitar problemas de importação
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

interface ContactInfoProps {
  psychologist: Psychologist;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ psychologist }) => {
  const formatPhone = (phone: string) => {
    // Remove todos os caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '');
    
    // Formata o telefone brasileiro
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    
    return phone;
  };

  const formatWorkingHours = () => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    
    const workingDays = days
      .map((day, index) => {
        const schedule = psychologist.workingHours[day as keyof typeof psychologist.workingHours];
        if (schedule) {
          return {
            day: dayNames[index],
            start: schedule.start,
            end: schedule.end,
            lunchStart: schedule.lunchStart,
            lunchEnd: schedule.lunchEnd
          };
        }
        return null;
      })
      .filter(Boolean);

    return workingDays;
  };

  const workingDays = formatWorkingHours();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full mr-3"></div>
        Informações de Contato
      </h3>
      
      <div className="space-y-4">
        {/* Telefone */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Phone className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Telefone</p>
            <a 
              href={`tel:${psychologist.phone}`}
              className="text-green-600 hover:text-green-700 transition-colors"
            >
              {formatPhone(psychologist.phone)}
            </a>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Email</p>
            <a 
              href={`mailto:${psychologist.email}`}
              className="text-blue-600 hover:text-blue-700 transition-colors break-all"
            >
              {psychologist.email}
            </a>
          </div>
        </div>

        {/* Localização (se disponível) */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <MapPin className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Localização</p>
            <p className="text-gray-600">São Paulo, SP</p>
            <p className="text-sm text-gray-500">Consultas presenciais e online</p>
          </div>
        </div>

        {/* Horários de Funcionamento */}
        {workingDays.length > 0 && (
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 mb-2">Horários de Atendimento</p>
              <div className="space-y-1">
                {workingDays.slice(0, 3).map((day, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{day.day}</span>
                    <span className="text-gray-900 font-medium">
                      {day.start} - {day.end}
                    </span>
                  </div>
                ))}
                {workingDays.length > 3 && (
                  <p className="text-xs text-gray-500 mt-1">
                    +{workingDays.length - 3} dias por semana
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Website/Portfolio (se disponível) */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <Globe className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Website</p>
            <a 
              href="#" 
              className="text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Ver portfólio completo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
