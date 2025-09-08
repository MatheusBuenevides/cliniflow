import React from 'react';
import { Calendar, Clock, CheckCircle, ArrowRight } from 'lucide-react';

interface BookingCTAProps {
  onStartBooking: () => void;
  psychologistName: string;
  className?: string;
}

const BookingCTA: React.FC<BookingCTAProps> = ({ 
  onStartBooking, 
  psychologistName, 
  className = '' 
}) => {
  return (
    <div className={`bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para começar sua jornada de autoconhecimento?
          </h2>
          <p className="text-xl text-purple-100 mb-6">
            Agende sua consulta com {psychologistName} de forma rápida e segura
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Escolha o Horário</h3>
            <p className="text-purple-100 text-sm">
              Visualize horários disponíveis e escolha o melhor para você
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Preencha os Dados</h3>
            <p className="text-purple-100 text-sm">
              Informe seus dados de forma segura e rápida
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Confirme o Agendamento</h3>
            <p className="text-purple-100 text-sm">
              Receba confirmação por email e prepare-se para sua consulta
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onStartBooking}
            className="bg-white text-purple-600 hover:bg-purple-50 font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
          >
            <span>Agendar Consulta Online</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <p className="text-purple-100 text-sm mt-4">
            ✓ Agendamento 24/7 • ✓ Confirmação por email • ✓ Presencial e Online
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingCTA;
