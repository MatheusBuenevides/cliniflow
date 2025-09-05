import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthStore } from '../stores/useAuthStore';

interface AuthContextType {
  user: ReturnType<typeof useAuthStore>['user'];
  isAuthenticated: ReturnType<typeof useAuthStore>['isAuthenticated'];
  login: ReturnType<typeof useAuthStore>['login'];
  logout: ReturnType<typeof useAuthStore>['logout'];
  loading: ReturnType<typeof useAuthStore>['isLoading'];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, login, logout, isLoading } = useAuthStore();

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    loading: isLoading,
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
