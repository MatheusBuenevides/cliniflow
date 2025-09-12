import React, { createContext, useContext, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { setLogoutCallback } from '../services/api';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  updateProfile: (userData: any) => Promise<void>;
  refreshToken: () => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { 
    user, 
    isAuthenticated, 
    login, 
    logout, 
    register,
    updateProfile,
    isLoading, 
    error,
    clearError,
    setLoading
  } = useAuthStore();

  // Função para refresh do token
  const refreshToken = useCallback(async () => {
    try {
      setLoading(true);
      
      // Verificar se existe token no localStorage
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      // Simular refresh do token - em produção, seria uma chamada para a API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verificar se o token ainda é válido (mock)
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      
      if (tokenData.exp < now) {
        throw new Error('Token expirado');
      }

      setLoading(false);
    } catch (error) {
      // Se o refresh falhar, fazer logout
      logout();
      setLoading(false);
    }
  }, [logout, setLoading]);

  // Auto-refresh do token a cada 5 minutos
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      refreshToken();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [isAuthenticated, refreshToken]);

  // Verificar autenticação na inicialização
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token && !isAuthenticated) {
        try {
          await refreshToken();
        } catch (error) {
          // Token inválido, limpar storage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, refreshToken]);

  // Registrar callback de logout para o interceptor da API
  useEffect(() => {
    setLogoutCallback(logout);
  }, [logout]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    register,
    updateProfile,
    refreshToken,
    loading: isLoading,
    error,
    clearError,
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
