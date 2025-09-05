import React from 'react';
import { Bell, PlusCircle } from 'lucide-react';

const Header: React.FC = () => (
  <header className="flex justify-between items-center py-4">
    <div>
      {/* O título da página agora é gerenciado dentro de cada componente de página */}
    </div>
    <div className="flex items-center space-x-4">
      <button className="p-2 rounded-full hover:bg-slate-200 text-slate-500">
        <Bell size={22} />
      </button>
      <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-200 shadow-sm">
        <PlusCircle size={20} />
        <span>Novo Agendamento</span>
      </button>
    </div>
  </header>
);

export default Header;
