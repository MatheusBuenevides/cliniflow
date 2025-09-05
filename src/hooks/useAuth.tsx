import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

// Definindo o tipo Psychologist localmente para evitar problemas de importação
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
  workingHours: any;
  sessionPrices: {
    initial: number;
    followUp: number;
    online: number;
    duration: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: Psychologist | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Psychologist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula verificação de autenticação no localStorage
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('cliniflow_token');
        const userData = localStorage.getItem('cliniflow_user');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simula login - em produção, faria chamada para API
      if (email === 'admin@cliniflow.com' && password === '123456') {
        const mockUser: Psychologist = {
          id: 1,
          name: 'Dr. João Silva',
          crp: '06/123456',
          email: 'admin@cliniflow.com',
          phone: '(11) 99999-9999',
          avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
          bio: 'Psicólogo clínico especializado em terapia cognitivo-comportamental.',
          specialties: ['TCC', 'Ansiedade', 'Depressão'],
          customUrl: 'joao-silva',
          workingHours: {
            monday: { start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
            tuesday: { start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
            wednesday: { start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
            thursday: { start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
            friday: { start: '08:00', end: '18:00', lunchStart: '12:00', lunchEnd: '13:00' },
          },
          sessionPrices: {
            initial: 150,
            followUp: 120,
            online: 100,
            duration: 50
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        localStorage.setItem('cliniflow_token', 'mock-jwt-token');
        localStorage.setItem('cliniflow_user', JSON.stringify(mockUser));
        setUser(mockUser);
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('cliniflow_token');
    localStorage.removeItem('cliniflow_user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
