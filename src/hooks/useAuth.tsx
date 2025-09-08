import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthStore } from '../stores/useAuthStore';

interface AuthContextType {
  user: ReturnType<typeof useAuthStore>['user'];
  isAuthenticated: ReturnType<typeof useAuthStore>['isAuthenticated'];
  login: ReturnType<typeof useAuthStore>['login'];
  logout: ReturnType<typeof useAuthStore>['logout'];
  register: ReturnType<typeof useAuthStore>['register'];
  updateProfile: ReturnType<typeof useAuthStore>['updateProfile'];
  loading: ReturnType<typeof useAuthStore>['isLoading'];
  error: ReturnType<typeof useAuthStore>['error'];
  clearError: ReturnType<typeof useAuthStore>['clearError'];
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
    clearError 
  } = useAuthStore();

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    register,
    updateProfile,
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
