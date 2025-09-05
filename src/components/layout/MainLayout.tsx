import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar, Header } from './index';
import { Breadcrumbs } from '../ui';
import { useAppStore } from '../../stores';

const MainLayout: React.FC = () => {
  const { state, setActivePage } = useAppStore();
  const location = useLocation();

  // Mapeia as rotas para os nomes das páginas
  const getPageName = (pathname: string) => {
    if (pathname === '/') return 'Dashboard';
    if (pathname.startsWith('/agenda')) return 'Agenda';
    if (pathname.startsWith('/pacientes')) return 'Pacientes';
    if (pathname.startsWith('/financeiro')) return 'Financeiro';
    if (pathname.startsWith('/configuracoes')) return 'Configurações';
    return 'Dashboard';
  };

  const currentPage = getPageName(location.pathname);

  return (
    <div className="flex bg-slate-50 font-sans">
      <Sidebar 
        activePage={currentPage} 
        setActivePage={setActivePage} 
        user={state.user}
      />
      <main className="flex-1 p-8 h-screen overflow-y-auto">
        <Header />
        <Breadcrumbs />
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
