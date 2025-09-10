import React from 'react';
import { Check, Trash2, Settings } from 'lucide-react';

interface NotificationActionsProps {
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onOpenSettings?: () => void;
  hasUnreadNotifications: boolean;
  totalNotifications: number;
}

const NotificationActions: React.FC<NotificationActionsProps> = ({
  onMarkAllAsRead,
  onClearAll,
  onOpenSettings,
  hasUnreadNotifications,
  totalNotifications,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center space-x-2">
        <h3 className="text-sm font-semibold text-gray-900">
          Notificações
        </h3>
        {totalNotifications > 0 && (
          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
            {totalNotifications}
          </span>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {hasUnreadNotifications && (
          <button
            onClick={onMarkAllAsRead}
            className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 transition-colors duration-200"
            title="Marcar todas como lidas"
          >
            <Check size={14} />
            <span>Marcar todas</span>
          </button>
        )}
        
        {totalNotifications > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center space-x-1 text-xs text-red-600 hover:text-red-800 transition-colors duration-200"
            title="Limpar todas as notificações"
          >
            <Trash2 size={14} />
            <span>Limpar</span>
          </button>
        )}
        
        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-800 transition-colors duration-200"
            title="Configurações de notificação"
          >
            <Settings size={14} />
            <span>Config</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationActions;
