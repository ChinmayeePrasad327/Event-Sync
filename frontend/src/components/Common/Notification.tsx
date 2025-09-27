import React from 'react';
import { X, CheckCircle, Info, AlertTriangle, XCircle } from 'lucide-react';
import { Notification as NotificationType } from '../../types';
import { useApp } from '../../context/AppContext';

interface NotificationProps {
  notification: NotificationType;
}

const Notification: React.FC<NotificationProps> = ({ notification }) => {
  const { removeNotification } = useApp();

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className={`flex items-start p-4 border rounded-lg ${getBgColor()} animate-slideIn`}>
      <div className="flex-shrink-0 mr-3">
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-800">{notification.message}</p>
      </div>
      <button
        onClick={() => removeNotification(notification.id)}
        className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const NotificationContainer: React.FC = () => {
  const { notifications } = useApp();

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 w-80 max-w-sm">
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationContainer;