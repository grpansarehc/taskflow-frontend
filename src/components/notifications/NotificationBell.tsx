import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import notificationService from '../../services/notification.service';
import webSocketService from '../../services/websocket.service';
import NotificationDropdown from './NotificationDropdown.tsx';

interface NotificationBellProps {
  userId: string;
}

const NotificationBell = ({ userId }: NotificationBellProps) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Fetch initial unread count
    const fetchUnreadCount = async () => {
      try {
        const count = await notificationService.getUnreadCount();
        setUnreadCount(count);
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
      }
    };

    fetchUnreadCount();

    // Connect to WebSocket for real-time updates
    webSocketService.connect(
      userId,
      () => {
        // When new notification arrives, refresh count
        fetchUnreadCount();
      },
      (count) => {
        // When count update arrives
        setUnreadCount(count);
      }
    );

    // Cleanup on unmount
    return () => {
      webSocketService.disconnect();
    };
  }, [userId]);

  const handleBellClick = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleCountUpdate = (newCount: number) => {
    setUnreadCount(newCount);
  };

  return (
    <div className="relative">
      <button
        onClick={handleBellClick}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown 
          onClose={handleClose}
          onCountUpdate={handleCountUpdate}
        />
      )}
    </div>
  );
};

export default NotificationBell;
