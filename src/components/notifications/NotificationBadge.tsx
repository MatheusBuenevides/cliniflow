import React from 'react';
import { Bell } from 'lucide-react';

interface NotificationBadgeProps {
  count: number;
  onClick: () => void;
  className?: string;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ 
  count, 
  onClick, 
  className = '' 
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors duration-200 ${className}`}
      aria-label={`${count} notificações não lidas`}
    >
      <Bell size={22} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold animate-pulse">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
};

export default NotificationBadge;
