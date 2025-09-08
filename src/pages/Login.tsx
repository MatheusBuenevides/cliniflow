import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useAuthRedirect } from '../hooks';
import { AuthLayout } from '../components/auth';
import { FormInput, LoadingButton } from '../components/ui';
import { isValidEmail } from '../utils/validators';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  
  const { login, error: authError, clearError } = useAuth();
  
  // Redirecionar se já estiver autenticado
  useAuthRedirect();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      await login(formData.email, formData.password);
    } catch (err) {
      // Error is handled by the auth store
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Entre na sua conta"
      subtitle="Acesse o CliniFlow para gerenciar sua prática clínica"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
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
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Senha"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Sua senha"
            autoComplete="current-password"
            required
            isPassword
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            leftIcon={<Lock className="h-5 w-5" />}
          />
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Lembrar-me
            </label>
          </div>

          <div className="text-sm">
            <Link
              to="/forgot-password"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Esqueceu sua senha?
            </Link>
          </div>
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
          loadingText="Entrando..."
          fullWidth
          leftIcon={<LogIn className="h-4 w-4" />}
        >
          Entrar
        </LoadingButton>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Cadastre-se
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Credenciais de teste:</strong><br />
            Email: ana.silva@email.com<br />
            Senha: 123456
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
