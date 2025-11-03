import React, { useEffect, useState } from 'react';

interface NotificationProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: () => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  title?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const Notification: React.FC<NotificationProps> = ({
  id,
  message,
  type,
  duration = 4000,
  onClose,
  position = 'top-right',
  title,
  action,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // تأثير الدخول
    setTimeout(() => setIsVisible(true), 100);

    let progressTimer: number;
    let closeTimer: number;

    if (duration > 0) {
      // شريط التقدم
      progressTimer = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - 100 / (duration / 50);
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 50);

      // إغلاق تلقائي
      closeTimer = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      clearInterval(progressTimer);
      clearTimeout(closeTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getNotificationConfig = () => {
    switch (type) {
      case 'success':
        return {
          gradient: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
          icon: '🎉',
          iconBg: '#4caf50',
          borderColor: '#4caf50',
        };
      case 'error':
        return {
          gradient: 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)',
          icon: '🚨',
          iconBg: '#f44336',
          borderColor: '#f44336',
        };
      case 'warning':
        return {
          gradient: 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)',
          icon: '⚠️',
          iconBg: '#ff9800',
          borderColor: '#ff9800',
        };
      case 'info':
      default:
        return {
          gradient: 'linear-gradient(135deg, #2196f3 0%, #00bcd4 100%)',
          icon: 'ℹ️',
          iconBg: '#2196f3',
          borderColor: '#2196f3',
        };
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'top-left':
        return { top: '20px', left: '20px' };
      case 'bottom-right':
        return { bottom: '20px', right: '20px' };
      case 'bottom-left':
        return { bottom: '20px', left: '20px' };
      case 'top-right':
      default:
        return { top: '20px', right: '20px' };
    }
  };

  const config = getNotificationConfig();

  return (
    <div
      className={`modern-notification ${isVisible ? 'show' : ''} ${isRemoving ? 'removing' : ''} ${type}`}
      style={{
        position: 'fixed',
        ...getPositionStyles(),
        zIndex: 10000,
      }}
    >
      <div className="notification-card">
        {/* شريط التقدم */}
        {duration > 0 && (
          <div className="notification-progress">
            <div
              className="progress-bar"
              style={{
                width: `${progress}%`,
                background: config.borderColor,
              }}
            />
          </div>
        )}

        {/* أيقونة النوع */}
        <div className="notification-icon" style={{ background: config.iconBg }}>
          <span className="icon-emoji">{config.icon}</span>
        </div>

        {/* المحتوى */}
        <div className="notification-content">
          {title && <h4 className="notification-title">{title}</h4>}
          <p className="notification-message">{message}</p>

          {action && (
            <button
              className="notification-action"
              onClick={() => {
                action.onClick();
                handleClose();
              }}
            >
              {action.label}
            </button>
          )}
        </div>

        {/* زر الإغلاق */}
        <button className="notification-close" onClick={handleClose} title="إغلاق الإشعار">
          <span className="close-icon">✕</span>
        </button>
      </div>
    </div>
  );
};

// مكون حاوي الإشعارات
interface NotificationContainerProps {
  notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title?: string;
    duration?: number;
    action?: {
      label: string;
      onClick: () => void;
    };
  }>;
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxNotifications?: number;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onRemove,
  position = 'top-right',
  maxNotifications = 5,
}) => {
  // إظهار أحدث الإشعارات فقط
  const visibleNotifications = notifications.slice(0, maxNotifications);
  const hiddenCount = Math.max(0, notifications.length - maxNotifications);

  return (
    <div className={`notification-container ${position}`}>
      {/* إشعار عدد الإشعارات المخفية */}
      {hiddenCount > 0 && (
        <div className="notification-overflow">
          <span>+ {hiddenCount} إشعار أخر</span>
        </div>
      )}

      {/* الإشعارات */}
      {visibleNotifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{
            marginBottom: '12px',
            animationDelay: `${index * 100}ms`,
          }}
        >
          <Notification
            {...notification}
            onClose={() => onRemove(notification.id)}
            position={position}
          />
        </div>
      ))}
    </div>
  );
};

export default Notification;
