import { CheckCircle, Trash2, MessageSquare, UserPlus, Calendar, AtSign, FileText } from 'lucide-react';
import type { Notification, NotificationType } from '../../types/notification.types';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationItem = ({ notification, onMarkAsRead, onDelete }: NotificationItemProps) => {
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'TASK_ASSIGNED':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'TASK_COMMENT':
        return <MessageSquare className="w-5 h-5 text-green-500" />;
      case 'PROJECT_MEMBER_ADDED':
        return <UserPlus className="w-5 h-5 text-purple-500" />;
      case 'DUE_DATE_REMINDER':
        return <Calendar className="w-5 h-5 text-orange-500" />;
      case 'MENTION':
        return <AtSign className="w-5 h-5 text-pink-500" />;
      case 'TASK_UPDATED':
        return <FileText className="w-5 h-5 text-indigo-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    // TODO: Navigate to related entity if needed
  };

  return (
    <div
      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
        !notification.read ? 'bg-blue-50' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">
          {getIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className={`text-sm font-medium text-gray-900 ${!notification.read ? 'font-semibold' : ''}`}>
                {notification.title}
              </p>
              {notification.message && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {notification.message}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {getTimeAgo(notification.createdAt)}
              </p>
            </div>

            {/* Unread indicator */}
            {!notification.read && (
              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
            )}
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          aria-label="Delete notification"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;
