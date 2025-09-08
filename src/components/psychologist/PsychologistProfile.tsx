import React from 'react';
import { Star, CheckCircle, Award, Clock, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
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
import SpecialtyBadge from './SpecialtyBadge';
import ContactInfo from './ContactInfo';

interface PsychologistProfileProps {
  psychologist: Psychologist;
  onStartBooking?: () => void;
}

const PsychologistProfile: React.FC<PsychologistProfileProps> = ({ psychologist, onStartBooking }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDuration = (minutes: number) => {
    return `${minutes} min`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header do Perfil */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          {/* Avatar */}
          <div className="relative">
            <img
              src={psychologist.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(psychologist.name)}&background=ffffff&color=820AD1&size=120`}
              alt={psychologist.name}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white/20 shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-2 border-white">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Informações Principais */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{psychologist.name}</h1>
            <p className="text-purple-100 text-lg mb-3">CRP {psychologist.crp}</p>
            
            {/* Rating e Verificação */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-6 mb-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-300 fill-current"
                    />
                  ))}
                </div>
                <span className="text-purple-100 font-medium">4.9 (24 avaliações)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-yellow-300" />
                <span className="text-purple-100">Profissional Verificado</span>
              </div>
            </div>

            {/* Especialidades */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {psychologist.specialties.slice(0, 3).map((specialty, index) => (
                <SpecialtyBadge key={index} specialty={specialty} />
              ))}
              {psychologist.specialties.length > 3 && (
                <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">
                  +{psychologist.specialties.length - 3} mais
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo do Perfil */}
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Sobre */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full mr-3"></div>
                Sobre o Profissional
              </h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {psychologist.bio}
                </p>
              </div>
            </section>

            {/* Especialidades Completas */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full mr-3"></div>
                Especialidades
              </h2>
              <div className="flex flex-wrap gap-3">
                {psychologist.specialties.map((specialty, index) => (
                  <SpecialtyBadge key={index} specialty={specialty} />
                ))}
              </div>
            </section>

            {/* Abordagem Terapêutica */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full mr-3"></div>
                Abordagem Terapêutica
              </h2>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                <p className="text-gray-700 leading-relaxed">
                  Utilizo uma abordagem integrativa, combinando técnicas da Terapia Cognitivo-Comportamental 
                  com elementos humanísticos, sempre respeitando a individualidade e o ritmo de cada paciente. 
                  Acredito em um processo terapêutico colaborativo, onde o paciente é protagonista de sua própria 
                  jornada de autoconhecimento e transformação.
                </p>
              </div>
            </section>

            {/* Agendamento Online */}
            {onStartBooking && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full mr-3"></div>
                  Agendamento Online
                </h2>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Agende sua consulta de forma rápida e segura
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Escolha o melhor horário para você, preencha seus dados e confirme seu agendamento. 
                        Disponível para consultas presenciais e online.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          ✓ Agendamento 24/7
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          ✓ Confirmação por email
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                          ✓ Presencial e Online
                        </span>
                      </div>
                      <button
                        onClick={onStartBooking}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                      >
                        Agendar Agora
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informações de Contato */}
            <ContactInfo psychologist={psychologist} />

            {/* Preços das Sessões */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 text-purple-600 mr-2" />
                Preços das Sessões
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Primeira Consulta</p>
                    <p className="text-sm text-gray-600">Avaliação inicial</p>
                  </div>
                  <span className="font-bold text-purple-600">
                    {formatPrice(psychologist.sessionPrices.initial)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Consulta de Retorno</p>
                    <p className="text-sm text-gray-600">Sessões seguintes</p>
                  </div>
                  <span className="font-bold text-purple-600">
                    {formatPrice(psychologist.sessionPrices.followUp)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Consulta Online</p>
                    <p className="text-sm text-gray-600">Telepsicologia</p>
                  </div>
                  <span className="font-bold text-purple-600">
                    {formatPrice(psychologist.sessionPrices.online)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium text-gray-900">Duração</p>
                    <p className="text-sm text-gray-600">Tempo da sessão</p>
                  </div>
                  <span className="font-bold text-gray-700">
                    {formatDuration(psychologist.sessionPrices.duration)}
                  </span>
                </div>
              </div>
            </div>

            {/* Botão de Agendamento Online */}
            {onStartBooking && (
              <button
                onClick={onStartBooking}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Agendar Consulta Online</span>
              </button>
            )}

            {/* Botão WhatsApp */}
            <a
              href={`https://wa.me/55${psychologist.phone.replace(/\D/g, '')}?text=Olá! Gostaria de agendar uma consulta.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PsychologistProfile;
