import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Phone, 
  Mail, 
  MessageCircle,
  FileText,
  AlertCircle,
  CheckCircle,
  Info,
  ExternalLink
} from 'lucide-react';
import type { BookingInstructions as BookingInstructionsType, SessionModality } from '../../types';

interface BookingInstructionsProps {
  instructions: BookingInstructionsType;
  appointmentDate: string;
  appointmentTime: string;
  modality: SessionModality;
  className?: string;
}

const BookingInstructions: React.FC<BookingInstructionsProps> = ({
  instructions,
  appointmentDate,
  appointmentTime,
  modality,
  className = ''
}) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const getModalityIcon = (modality: SessionModality) => {
    return modality === 'online' ? (
      <Video className="h-5 w-5" />
    ) : (
      <MapPin className="h-5 w-5" />
    );
  };

  const getModalityLabel = (modality: SessionModality) => {
    return modality === 'online' ? 'Online' : 'Presencial';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Resumo do agendamento */}
      <div className="bg-slate-50 rounded-lg p-4">
        <h4 className="font-semibold text-slate-800 mb-3 flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Resumo do Agendamento</span>
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span className="text-sm text-slate-600">
                {new Date(appointmentDate).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-slate-500" />
              <span className="text-sm text-slate-600">
                {formatTime(appointmentTime)}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              {getModalityIcon(modality)}
              <span className="text-sm text-slate-600">
                {getModalityLabel(modality)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Instruções gerais */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-3 flex items-center space-x-2">
          <Info className="h-5 w-5" />
          <span>Instruções Gerais</span>
        </h4>
        <p className="text-sm text-blue-700">
          {instructions.generalInstructions}
        </p>
      </div>

      {/* Instruções específicas por modalidade */}
      {modality === 'online' && instructions.onlineInstructions && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-3 flex items-center space-x-2">
            <Video className="h-5 w-5" />
            <span>Instruções para Consulta Online</span>
          </h4>
          <p className="text-sm text-green-700">
            {instructions.onlineInstructions}
          </p>
        </div>
      )}

      {modality === 'inPerson' && instructions.inPersonInstructions && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-semibold text-purple-800 mb-3 flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Instruções para Consulta Presencial</span>
          </h4>
          <p className="text-sm text-purple-700">
            {instructions.inPersonInstructions}
          </p>
        </div>
      )}

      {/* Notas de preparação */}
      {instructions.preparationNotes && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-semibold text-amber-800 mb-3 flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Preparação para a Consulta</span>
          </h4>
          <p className="text-sm text-amber-700">
            {instructions.preparationNotes}
          </p>
        </div>
      )}

      {/* Políticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-800 mb-3 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>Política de Cancelamento</span>
          </h4>
          <p className="text-sm text-red-700">
            {instructions.cancellationPolicy}
          </p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="font-semibold text-orange-800 mb-3 flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Política de Reagendamento</span>
          </h4>
          <p className="text-sm text-orange-700">
            {instructions.reschedulingPolicy}
          </p>
        </div>
      </div>

      {/* Informações de contato */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h4 className="font-semibold text-slate-800 mb-3 flex items-center space-x-2">
          <Phone className="h-5 w-5" />
          <span>Informações de Contato</span>
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-sm font-medium text-slate-700">Telefone</p>
                <a 
                  href={`tel:${instructions.contactInfo.phone}`}
                  className="text-sm text-slate-600 hover:text-slate-800 transition-colors"
                >
                  {instructions.contactInfo.phone}
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-slate-500" />
              <div>
                <p className="text-sm font-medium text-slate-700">Email</p>
                <a 
                  href={`mailto:${instructions.contactInfo.email}`}
                  className="text-sm text-slate-600 hover:text-slate-800 transition-colors"
                >
                  {instructions.contactInfo.email}
                </a>
              </div>
            </div>
          </div>
          
          {instructions.contactInfo.whatsapp && (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-700">WhatsApp</p>
                  <a 
                    href={`https://wa.me/${instructions.contactInfo.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-600 hover:text-slate-800 transition-colors flex items-center space-x-1"
                  >
                    <span>{instructions.contactInfo.whatsapp}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lembretes importantes */}
      <div className="bg-slate-100 border border-slate-300 rounded-lg p-4">
        <h4 className="font-semibold text-slate-800 mb-3 flex items-center space-x-2">
          <CheckCircle className="h-5 w-5" />
          <span>Lembretes Importantes</span>
        </h4>
        
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex items-start space-x-2">
            <span className="text-slate-500 mt-1">•</span>
            <span>Chegue com 10 minutos de antecedência</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-slate-500 mt-1">•</span>
            <span>Traga um documento com foto</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-slate-500 mt-1">•</span>
            <span>Desligue ou silencie o celular durante a consulta</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-slate-500 mt-1">•</span>
            <span>Em caso de dúvidas, entre em contato conosco</span>
          </li>
        </ul>
      </div>

      {/* Aviso de confidencialidade */}
      <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">
              Confidencialidade
            </h4>
            <p className="text-sm text-blue-700">
              Todas as informações compartilhadas durante a consulta são estritamente confidenciais 
              e protegidas pelo sigilo profissional. Seus dados pessoais são tratados de acordo 
              com a Lei Geral de Proteção de Dados (LGPD).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { BookingInstructions };
