import React from 'react';
import { useAuth, useRequireAuth, useRequirePermission } from '../../hooks';

/**
 * Componente de exemplo demonstrando o uso dos hooks de autenticação
 * Este arquivo pode ser removido em produção
 */
const AuthExample: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { hasPermission } = useRequirePermission('admin');

  // Este hook redireciona automaticamente se não autenticado
  useRequireAuth();

  if (!isAuthenticated) {
    return <div>Redirecionando para login...</div>;
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Informações de Autenticação</h3>
      <div className="space-y-2">
        <p><strong>Usuário:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>CRP:</strong> {user?.crp}</p>
        <p><strong>Permissão Admin:</strong> {hasPermission ? 'Sim' : 'Não'}</p>
      </div>
      <button
        onClick={logout}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default AuthExample;
