import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

/**
 * Hook para redirecionamento baseado no estado de autenticação
 * Útil para páginas que devem redirecionar usuários autenticados
 */
export const useAuthRedirect = (redirectTo: string = '/') => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      // Verificar se há uma rota de destino salva (vinda do login)
      const from = location.state?.from;
      const destination = from || redirectTo;
      
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, redirectTo, location.state?.from]);

  return { isAuthenticated, loading };
};

/**
 * Hook para verificar se o usuário deve ser redirecionado
 * Retorna true se o usuário está autenticado e deve ser redirecionado
 */
export const useShouldRedirect = (redirectTo: string = '/') => {
  const { isAuthenticated, loading } = useAuth();
  
  return {
    shouldRedirect: !loading && isAuthenticated,
    loading,
    redirectTo
  };
};
