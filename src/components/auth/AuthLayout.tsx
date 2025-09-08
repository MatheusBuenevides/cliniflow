import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Users } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showFeatures?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showFeatures = true,
}) => {
  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Segurança Total',
      description: 'Seus dados protegidos com criptografia de ponta',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Gestão Completa',
      description: 'Pacientes, consultas e pagamentos em um só lugar',
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Foco no Cuidado',
      description: 'Interface pensada para psicólogos e seus pacientes',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CliniFlow</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Cadastrar
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Side - Features */}
        {showFeatures && (
          <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 xl:px-16">
            <div className="max-w-md">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                A plataforma completa para psicólogos
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Gerencie sua prática clínica com ferramentas desenvolvidas especialmente para profissionais da psicologia.
              </p>
              
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Right Side - Auth Form */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-md">
            <div className="text-center mb-8">
              <div className="mx-auto h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                {title}
              </h2>
              <p className="mt-2 text-gray-600">
                {subtitle}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              {children}
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Ao continuar, você concorda com nossos{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
                  Termos de Uso
                </Link>{' '}
                e{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                  Política de Privacidade
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
