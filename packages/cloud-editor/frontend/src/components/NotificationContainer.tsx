import React from 'react';
import Notification from './Notification';

interface NotificationData {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface NotificationContainerProps {
  notifications: NotificationData[];
  onClose: (id: number) => void;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onClose,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxHeight: '80vh',
        overflow: 'visible',
      }}
    >
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{
            transform: `translateY(${index * 5}px)`,
            transition: 'all 0.4s ease',
            zIndex: 1000 - index,
            opacity: Math.max(0.7, 1 - index * 0.1),
          }}
        >
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => onClose(notification.id)}
            duration={5000}
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;
