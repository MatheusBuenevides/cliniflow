import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, Star, CheckCircle, User, Mail, Phone } from 'lucide-react';
import { PublicProfile as PublicProfileType, AvailableSlot, AppointmentBookingForm } from '../types';

const PublicProfile: React.FC = () => {
  const { customUrl } = useParams<{ customUrl: string }>();
  const [profile, setProfile] = useState<PublicProfileType | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState<AppointmentBookingForm>({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    birthDate: '',
    selectedSlot: {
      date: '',
      time: '',
      duration: 0,
      modality: 'inPerson',
      price: 0
    },
    isFirstTime: true,
    notes: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!customUrl) return;
      
      try {
        setLoading(true);
        // Simula busca do perfil público
        const mockProfile: PublicProfileType = {
          psychologistId: 1,
          customUrl: customUrl,
          name: 'Dr. João Silva',
          crp: '06/123456',
          avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
          bio: 'Psicólogo clínico especializado em terapia cognitivo-comportamental com mais de 10 anos de experiência. Atendo adolescentes e adultos com foco em ansiedade, depressão e transtornos do humor.',
          specialties: ['Terapia Cognitivo-Comportamental', 'Ansiedade', 'Depressão', 'Transtornos do Humor'],
          sessionPrices: {
            initial: 150,
            followUp: 120,
            online: 100,
            duration: 50
          },
          availableSlots: [
            {
              date: '2024-01-15',
              time: '09:00',
              duration: 50,
              modality: 'inPerson',
              price: 150
            },
            {
              date: '2024-01-15',
              time: '10:00',
              duration: 50,
              modality: 'online',
              price: 100
            },
            {
              date: '2024-01-16',
              time: '14:00',
              duration: 50,
              modality: 'inPerson',
              price: 120
            }
          ],
          testimonials: [
            {
              id: 1,
              initials: 'A.S.',
              text: 'Excelente profissional! Me ajudou muito com minha ansiedade.',
              rating: 5,
              date: '2024-01-10'
            },
            {
              id: 2,
              initials: 'M.R.',
              text: 'Muito atencioso e competente. Recomendo!',
              rating: 5,
              date: '2024-01-08'
            }
          ]
        };
        
        setProfile(mockProfile);
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [customUrl]);

  const handleSlotSelect = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
    setBookingForm(prev => ({
      ...prev,
      selectedSlot: slot
    }));
    setShowBookingForm(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simula envio do agendamento
    alert('Agendamento solicitado com sucesso! Você receberá uma confirmação por email.');
    setShowBookingForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Perfil não encontrado</h2>
          <p className="text-gray-600">O psicólogo que você está procurando não foi encontrado.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-6">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-lg text-gray-600">CRP {profile.crp}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">4.9 (24 avaliações)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">Verificado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Sobre */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Sobre</h2>
              <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
            </div>

            {/* Especialidades */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Especialidades</h2>
              <div className="flex flex-wrap gap-2">
                {profile.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Avaliações */}
            {profile.testimonials && profile.testimonials.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Avaliações</h2>
                <div className="space-y-4">
                  {profile.testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {testimonial.initials}
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < testimonial.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(testimonial.date)}
                        </span>
                      </div>
                      <p className="text-gray-700">{testimonial.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preços */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preços</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Primeira consulta</span>
                  <span className="font-semibold">R$ {profile.sessionPrices.initial}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Consulta de retorno</span>
                  <span className="font-semibold">R$ {profile.sessionPrices.followUp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Consulta online</span>
                  <span className="font-semibold">R$ {profile.sessionPrices.online}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duração</span>
                  <span className="font-semibold">{profile.sessionPrices.duration} min</span>
                </div>
              </div>
            </div>

            {/* Horários Disponíveis */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Horários Disponíveis</h3>
              <div className="space-y-3">
                {profile.availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => handleSlotSelect(slot)}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{formatDate(slot.date)}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(slot.time)}</span>
                          <span>•</span>
                          <span>{slot.duration} min</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-purple-600">R$ {slot.price}</p>
                        <p className="text-xs text-gray-500">
                          {slot.modality === 'inPerson' ? 'Presencial' : 'Online'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Agendamento */}
      {showBookingForm && selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Agendar Consulta</h3>
              
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingForm.patientName}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, patientName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={bookingForm.patientEmail}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, patientEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingForm.patientPhone}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, patientPhone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={bookingForm.birthDate}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, birthDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={bookingForm.isFirstTime}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, isFirstTime: e.target.checked }))}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Primeira consulta</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações (opcional)
                  </label>
                  <textarea
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Alguma informação adicional que gostaria de compartilhar?"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Agendar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicProfile;
