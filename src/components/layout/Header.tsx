import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { NotificationBadge, NotificationCenter } from '../notifications';
import { useNotifications } from '../../stores/useNotificationStore';
import type { Notification } from '../../types';

const Header: React.FC = () => {
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const { unreadCount } = useNotifications();

  const handleNotificationClick = (notification: Notification) => {
    // TODO: Implementar navegação baseada no tipo de notificação
    console.log('Notificação clicada:', notification);
    
    // Exemplos de navegação baseada no tipo:
    switch (notification.type) {
      case 'appointment_reminder':
        // Navegar para agenda
        console.log('Navegar para agenda');
        break;
      case 'payment_received':
        // Navegar para financeiro
        console.log('Navegar para financeiro');
        break;
      case 'payment_overdue':
        // Navegar para pacientes
        console.log('Navegar para pacientes');
        break;
      default:
        break;
    }
  };

  return (
    <header className="flex justify-between items-center py-4">
      <div>
        {/* O título da página agora é gerenciado dentro de cada componente de página */}
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <NotificationBadge
            count={unreadCount}
            onClick={() => setIsNotificationCenterOpen(!isNotificationCenterOpen)}
          />
          <NotificationCenter
            isOpen={isNotificationCenterOpen}
            onClose={() => setIsNotificationCenterOpen(false)}
            onNotificationClick={handleNotificationClick}
          />
        </div>
        <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-200 shadow-sm">
          <PlusCircle size={20} />
          <span>Novo Agendamento</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
