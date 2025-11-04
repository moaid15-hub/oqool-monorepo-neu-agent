// packages/cloud-editor/frontend/src/components/AINotificationCenter.tsx
import React from 'react';
import { useNotifications } from '../hooks/useNotifications';

interface AINotificationCenterProps {
  className?: string;
}

export const AINotificationCenter: React.FC<AINotificationCenterProps> = ({ className }) => {
  const { notifications, removeNotification, clearAll } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className={`ai-notification-center ${className || ''}`}>
      <div className="notification-header">
        <h4>🔔 الإشعارات ({notifications.length})</h4>
        {notifications.length > 1 && (
          <button onClick={clearAll} className="clear-all-btn">
            🗑️ مسح الكل
          </button>
        )}
      </div>

      <div className="notifications-list">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-item ${notification.type}`}
            onClick={() => removeNotification(notification.id)}
          >
            <div className="notification-icon">
              {notification.type === 'success' && '✅'}
              {notification.type === 'error' && '❌'}
              {notification.type === 'info' && 'ℹ️'}
            </div>

            <div className="notification-content">
              <p>{notification.message}</p>
              <small>انقر للإغلاق</small>
            </div>

            <button
              className="close-btn"
              onClick={(e) => {
                e.stopPropagation();
                removeNotification(notification.id);
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
