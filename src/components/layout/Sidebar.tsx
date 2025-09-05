import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart, Calendar, Users, DollarSign, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  user: {
    name: string;
    avatar: string;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: <BarChart width={20} height={20} />, path: '/' },
    { name: 'Agenda', icon: <Calendar size={20} />, path: '/agenda' },
    { name: 'Pacientes', icon: <Users size={20} />, path: '/pacientes' },
    { name: 'Financeiro', icon: <DollarSign size={20} />, path: '/financeiro' },
    { name: 'Configurações', icon: <Settings size={20} />, path: '/configuracoes' },
  ];

  const handleNavigation = (path: string, name: string) => {
    navigate(path);
    setActivePage(name);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white flex flex-col h-screen p-4 border-r border-slate-200">
      <div className="text-2xl font-bold text-purple-600 mb-10 ml-2">CliniFlow</div>
      <nav className="flex-grow">
        <ul>
          {navItems.map(item => (
            <li key={item.name}>
              <button
                onClick={() => handleNavigation(item.path, item.name)}
                className={`w-full flex items-center space-x-3 px-3 py-3 my-1 rounded-lg font-semibold transition-all duration-200 text-left ${
                  location.pathname === item.path || 
                  (item.path === '/' && location.pathname === '/') ||
                  (item.path !== '/' && location.pathname.startsWith(item.path))
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="space-y-2">
        <div className="flex items-center space-x-3 p-2">
          <img src={user.avatar} alt="Avatar do usuário" className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-bold text-slate-800">{user.name}</p>
            <button 
              onClick={() => navigate('/configuracoes')}
              className="text-xs text-purple-600 hover:underline"
            >
              Ver Perfil
            </button>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
