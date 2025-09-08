import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  redirectTo = '/login',
  fallback
}) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Se não requer autenticação, renderiza os children
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Loading state
  if (loading) {
    return fallback || (
      <LoadingSpinner size="lg" text="Verificando autenticação..." fullScreen />
    );
  }

  // Se não autenticado, redireciona
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Usuário autenticado, renderiza os children
  return <>{children}</>;
};

export default ProtectedRoute;
