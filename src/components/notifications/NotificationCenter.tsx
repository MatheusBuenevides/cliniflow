import React, { useState, useRef, useEffect } from 'react';
import type { Notification, NotificationType } from '../../types';
import { useNotifications } from '../../stores/useNotificationStore';
import NotificationItem from './NotificationItem';
import NotificationActions from './NotificationActions';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationClick?: (notification: Notification) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  onNotificationClick,
}) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
  } = useNotifications();

  const [filter, setFilter] = useState<NotificationType | 'all'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Filtrar notificações
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  const handleNotificationAction = (notification: Notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    onClose();
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleClearAll = () => {
    if (window.confirm('Tem certeza que deseja limpar todas as notificações?')) {
      clearAllNotifications();
    }
  };

  const handleOpenSettings = () => {
    // TODO: Implementar modal de configurações
    console.log('Abrir configurações de notificação');
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden"
    >
      {/* Header com filtros e ações */}
      <NotificationActions
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearAll={handleClearAll}
        onOpenSettings={handleOpenSettings}
        hasUnreadNotifications={unreadCount > 0}
        totalNotifications={notifications.length}
      />

      {/* Filtros */}
      <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todas ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('appointment_reminder')}
            className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
              filter === 'appointment_reminder'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Consultas
          </button>
          <button
            onClick={() => setFilter('payment_received')}
            className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
              filter === 'payment_received'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Pagamentos
          </button>
          <button
            onClick={() => setFilter('system_update')}
            className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
              filter === 'system_update'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Sistema
          </button>
        </div>
      </div>

      {/* Lista de notificações */}
      <div className="max-h-64 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">🔔</div>
            <p className="text-sm">Nenhuma notificação encontrada</p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="text-blue-600 hover:text-blue-800 text-sm mt-2"
              >
                Ver todas as notificações
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onRemove={removeNotification}
                onAction={handleNotificationAction}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer com link para ver todas */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => {
              // TODO: Implementar página de notificações
              console.log('Ver todas as notificações');
              onClose();
            }}
            className="w-full text-center text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            Ver todas as notificações
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
