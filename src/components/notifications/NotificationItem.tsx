import React from 'react';
import { 
  Calendar, 
  CreditCard, 
  AlertTriangle, 
  X, 
  CheckCircle, 
  Clock,
  Bell
} from 'lucide-react';
import type { Notification, NotificationType } from '../../types';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
  onAction?: (notification: Notification) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onRemove,
  onAction,
}) => {
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'appointment_reminder':
        return <Calendar className="text-blue-500" size={20} />;
      case 'payment_received':
        return <CreditCard className="text-green-500" size={20} />;
      case 'payment_overdue':
        return <AlertTriangle className="text-red-500" size={20} />;
      case 'appointment_cancelled':
        return <X className="text-orange-500" size={20} />;
      case 'system_update':
        return <Bell className="text-purple-500" size={20} />;
      case 'backup_completed':
        return <CheckCircle className="text-green-500" size={20} />;
      default:
        return <Bell className="text-gray-500" size={20} />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'appointment_reminder':
        return 'border-l-blue-500 bg-blue-50';
      case 'payment_received':
        return 'border-l-green-500 bg-green-50';
      case 'payment_overdue':
        return 'border-l-red-500 bg-red-50';
      case 'appointment_cancelled':
        return 'border-l-orange-500 bg-orange-50';
      case 'system_update':
        return 'border-l-purple-500 bg-purple-50';
      case 'backup_completed':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d atrás`;
    
    return notificationDate.toLocaleDateString('pt-BR');
  };

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    if (onAction) {
      onAction(notification);
    }
  };

  return (
    <div
      className={`
        relative p-4 border-l-4 cursor-pointer transition-all duration-200 hover:shadow-md
        ${getNotificationColor(notification.type)}
        ${!notification.isRead ? 'opacity-100' : 'opacity-75'}
      `}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getNotificationIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={`text-sm font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
              {notification.title}
            </h4>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 flex items-center">
                <Clock size={12} className="mr-1" />
                {formatTimeAgo(notification.createdAt)}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(notification.id);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                aria-label="Remover notificação"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          
          <p className={`text-sm mt-1 ${!notification.isRead ? 'text-gray-700' : 'text-gray-500'}`}>
            {notification.message}
          </p>
          
          {!notification.isRead && (
            <div className="mt-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
