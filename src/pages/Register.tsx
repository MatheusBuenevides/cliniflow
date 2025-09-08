import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AuthLayout } from '../components/auth';
import { FormInput, LoadingButton, PasswordStrength } from '../components/ui';
import { 
  isValidEmail, 
  isValidCRP, 
  isValidPhone, 
  isValidCustomUrl,
  validatePassword 
} from '../utils/validators';
import { UserPlus, User, Mail, Lock, Phone, FileText, Globe } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    crp: '',
    phone: '',
    customUrl: '',
    bio: '',
    specialties: [] as string[],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  
  const { register, isAuthenticated, error: authError, clearError } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Nome
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Email
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // CRP
    if (!formData.crp) {
      newErrors.crp = 'CRP é obrigatório';
    } else if (!isValidCRP(formData.crp)) {
      newErrors.crp = 'CRP deve estar no formato XX/XXXXXX';
    }

    // Telefone
    if (!formData.phone) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Telefone inválido';
    }

    // URL personalizada
    if (formData.customUrl && !isValidCustomUrl(formData.customUrl)) {
      newErrors.customUrl = 'URL deve conter apenas letras minúsculas, números e hífens (3-30 caracteres)';
    }

    // Senha
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0];
      }
    }

    // Confirmar senha
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    // Termos
    if (!acceptTerms) {
      newErrors.terms = 'Você deve aceitar os termos de uso';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear auth error when user starts typing
    if (authError) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    clearError();

    try {
      // Preparar dados para registro
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email,
        crp: formData.crp,
        phone: formData.phone,
        customUrl: formData.customUrl || formData.name.toLowerCase().replace(/\s+/g, '-'),
        bio: formData.bio || 'Psicólogo(a) clínico(a)',
        specialties: formData.specialties,
        workingHours: {},
        sessionPrices: {
          initial: 150,
          followUp: 120,
          online: 100,
          duration: 50,
        },
      };

      await register(registrationData);
    } catch (err) {
      // Error is handled by the auth store
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Comece a usar o CliniFlow hoje mesmo"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <FormInput
            id="name"
            name="name"
            type="text"
            label="Nome Completo"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Dr. João Silva"
            required
            leftIcon={<User className="h-5 w-5" />}
          />

          <FormInput
            id="email"
            name="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="seu@email.com"
            autoComplete="email"
            required
            leftIcon={<Mail className="h-5 w-5" />}
          />

          <FormInput
            id="crp"
            name="crp"
            type="text"
            label="CRP"
            value={formData.crp}
            onChange={handleChange}
            error={errors.crp}
            placeholder="06/123456"
            required
            leftIcon={<FileText className="h-5 w-5" />}
            helperText="Formato: XX/XXXXXX"
          />

          <FormInput
            id="phone"
            name="phone"
            type="tel"
            label="Telefone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="(11) 99999-9999"
            required
            leftIcon={<Phone className="h-5 w-5" />}
          />

          <FormInput
            id="customUrl"
            name="customUrl"
            type="text"
            label="URL Personalizada (opcional)"
            value={formData.customUrl}
            onChange={handleChange}
            error={errors.customUrl}
            placeholder="joao-silva"
            leftIcon={<Globe className="h-5 w-5" />}
            helperText="Sua página pública será: cliniflow.com/joao-silva"
          />

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Biografia (opcional)
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Conte um pouco sobre sua abordagem e especialidades..."
            />
          </div>

          <FormInput
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Senha"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            required
            isPassword
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            leftIcon={<Lock className="h-5 w-5" />}
          />

          {formData.password && (
            <PasswordStrength password={formData.password} />
          )}

          <FormInput
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirmar Senha"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="Confirme sua senha"
            autoComplete="new-password"
            required
            isPassword
            showPasswordToggle
            showPassword={showConfirmPassword}
            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            leftIcon={<Lock className="h-5 w-5" />}
          />
        </div>

        {/* Terms and Privacy */}
        <div className="space-y-3">
          <div className="flex items-start">
            <input
              id="accept-terms"
              name="accept-terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
            />
            <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-700">
              Eu aceito os{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-500 font-medium">
                Termos de Uso
              </Link>{' '}
              e a{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-500 font-medium">
                Política de Privacidade
              </Link>
            </label>
          </div>
          {errors.terms && (
            <p className="text-sm text-red-600">{errors.terms}</p>
          )}
        </div>

        {/* Auth Error */}
        {authError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {authError}
          </div>
        )}

        <LoadingButton
          type="submit"
          loading={loading}
          loadingText="Criando conta..."
          fullWidth
          leftIcon={<UserPlus className="h-4 w-4" />}
        >
          Criar Conta
        </LoadingButton>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Faça login
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
