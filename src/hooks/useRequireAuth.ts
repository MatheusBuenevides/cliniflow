import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

/**
 * Hook para componentes que requerem autenticação
 * Redireciona automaticamente para login se não autenticado
 */
export const useRequireAuth = (redirectTo: string = '/login') => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Salvar a rota atual para redirecionamento após login
      navigate(redirectTo, { 
        state: { from: location.pathname },
        replace: true 
      });
    }
  }, [isAuthenticated, loading, navigate, redirectTo, location.pathname]);

  return { isAuthenticated, loading };
};

/**
 * Hook para verificar se o usuário tem permissão específica
 * Preparado para futuras implementações de roles/permissões
 */
export const useRequirePermission = (_permission: string) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  // Por enquanto, todos os usuários autenticados têm todas as permissões
  // Em produção, isso seria verificado contra roles/permissões do usuário
  const hasPermission = isAuthenticated && user !== null;
  
  return { hasPermission, loading };
};
