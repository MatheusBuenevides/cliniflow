import React, { useState } from 'react';
import { User, Mail, Phone, FileText, Globe, Save } from 'lucide-react';
import type { Psychologist } from '../../types';
import PhotoUploader from './PhotoUploader';
import SpecialtySelector from './SpecialtySelector';

interface ProfileFormProps {
  psychologist: Psychologist;
  onProfileChange: (psychologist: Psychologist) => void;
  className?: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  psychologist,
  onProfileChange,
  className = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState<Psychologist>(psychologist);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (field: keyof Psychologist, value: any) => {
    setTempProfile({
      ...tempProfile,
      [field]: value
    });
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validação do nome
    if (!tempProfile.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (tempProfile.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Validação do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!tempProfile.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(tempProfile.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validação do CRP
    const crpRegex = /^\d{2}\/\d{6}$/;
    if (!tempProfile.crp.trim()) {
      newErrors.crp = 'CRP é obrigatório';
    } else if (!crpRegex.test(tempProfile.crp)) {
      newErrors.crp = 'CRP deve estar no formato XX/XXXXXX';
    }

    // Validação do telefone
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (!tempProfile.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!phoneRegex.test(tempProfile.phone)) {
      newErrors.phone = 'Telefone deve estar no formato (XX) XXXXX-XXXX';
    }

    // Validação da URL personalizada
    const urlRegex = /^[a-z0-9-]+$/;
    if (!tempProfile.customUrl.trim()) {
      newErrors.customUrl = 'URL personalizada é obrigatória';
    } else if (!urlRegex.test(tempProfile.customUrl)) {
      newErrors.customUrl = 'URL deve conter apenas letras minúsculas, números e hífens';
    } else if (tempProfile.customUrl.length < 3) {
      newErrors.customUrl = 'URL deve ter pelo menos 3 caracteres';
    }

    // Validação da biografia
    if (!tempProfile.bio.trim()) {
      newErrors.bio = 'Biografia é obrigatória';
    } else if (tempProfile.bio.trim().length < 50) {
      newErrors.bio = 'Biografia deve ter pelo menos 50 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onProfileChange(tempProfile);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempProfile(psychologist);
    setErrors({});
    setIsEditing(false);
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const formatCRP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 8)}`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Dados Profissionais
          </h3>
          <p className="text-sm text-slate-600">
            Informações que aparecerão na sua página pública de agendamento.
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          {isEditing ? 'Cancelar' : 'Editar'}
        </button>
      </div>

      {/* Foto do Perfil */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h4 className="text-sm font-medium text-slate-700 mb-4">Foto do Perfil</h4>
        <PhotoUploader
          currentPhoto={tempProfile.avatar}
          onPhotoChange={(photo) => handleFieldChange('avatar', photo)}
        />
      </div>

      {/* Informações Básicas */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h4 className="text-sm font-medium text-slate-700 mb-4">Informações Básicas</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nome Completo *
            </label>
            <div className="relative">
              <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={tempProfile.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                disabled={!isEditing}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-slate-300'
                } ${!isEditing ? 'bg-slate-50' : ''}`}
                placeholder="Seu nome completo"
              />
            </div>
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              CRP *
            </label>
            <div className="relative">
              <FileText size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={tempProfile.crp}
                onChange={(e) => handleFieldChange('crp', formatCRP(e.target.value))}
                disabled={!isEditing}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.crp ? 'border-red-300' : 'border-slate-300'
                } ${!isEditing ? 'bg-slate-50' : ''}`}
                placeholder="XX/XXXXXX"
                maxLength={9}
              />
            </div>
            {errors.crp && <p className="text-red-500 text-sm mt-1">{errors.crp}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={tempProfile.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                disabled={!isEditing}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-slate-300'
                } ${!isEditing ? 'bg-slate-50' : ''}`}
                placeholder="seu@email.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Telefone *
            </label>
            <div className="relative">
              <Phone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                value={tempProfile.phone}
                onChange={(e) => handleFieldChange('phone', formatPhone(e.target.value))}
                disabled={!isEditing}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phone ? 'border-red-300' : 'border-slate-300'
                } ${!isEditing ? 'bg-slate-50' : ''}`}
                placeholder="(XX) XXXXX-XXXX"
                maxLength={15}
              />
            </div>
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              URL Personalizada *
            </label>
            <div className="relative">
              <Globe size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-slate-500 bg-slate-50 border border-r-0 border-slate-300 rounded-l-lg">
                  cliniflow.com/
                </span>
                <input
                  type="text"
                  value={tempProfile.customUrl}
                  onChange={(e) => handleFieldChange('customUrl', e.target.value.toLowerCase())}
                  disabled={!isEditing}
                  className={`flex-1 px-3 py-2 border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.customUrl ? 'border-red-300' : 'border-slate-300'
                  } ${!isEditing ? 'bg-slate-50' : ''}`}
                  placeholder="sua-url-personalizada"
                />
              </div>
            </div>
            {errors.customUrl && <p className="text-red-500 text-sm mt-1">{errors.customUrl}</p>}
            <p className="text-xs text-slate-500 mt-1">
              Esta será a URL da sua página pública de agendamento
            </p>
          </div>
        </div>
      </div>

      {/* Biografia */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h4 className="text-sm font-medium text-slate-700 mb-4">Biografia</h4>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Sobre você e sua abordagem *
          </label>
          <textarea
            value={tempProfile.bio}
            onChange={(e) => handleFieldChange('bio', e.target.value)}
            disabled={!isEditing}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.bio ? 'border-red-300' : 'border-slate-300'
            } ${!isEditing ? 'bg-slate-50' : ''}`}
            placeholder="Conte um pouco sobre sua formação, especialidades e abordagem terapêutica..."
          />
          {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
          <p className="text-xs text-slate-500 mt-1">
            {tempProfile.bio.length}/500 caracteres (mínimo 50)
          </p>
        </div>
      </div>

      {/* Especialidades */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <SpecialtySelector
          selectedSpecialties={tempProfile.specialties}
          onSpecialtiesChange={(specialties) => handleFieldChange('specialties', specialties)}
        />
      </div>

      {/* Botões de Ação */}
      {isEditing && (
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save size={16} className="mr-2" />
            Salvar Alterações
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileForm;
