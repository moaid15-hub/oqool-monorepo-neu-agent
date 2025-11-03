import { useState, useCallback, useEffect } from 'react';

export interface NotificationItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = useCallback((notification: Omit<NotificationItem, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: NotificationItem = {
      ...notification,
      id,
    };

    setNotifications((prev) => [newNotification, ...prev]);
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // دوال مساعدة لإضافة أنواع مختلفة من الإشعارات
  const showSuccess = useCallback(
    (message: string, options?: Partial<NotificationItem>) => {
      return addNotification({
        message,
        type: 'success',
        duration: 4000,
        ...options,
      });
    },
    [addNotification]
  );

  const showError = useCallback(
    (message: string, options?: Partial<NotificationItem>) => {
      return addNotification({
        message,
        type: 'error',
        duration: 6000, // أطول للأخطاء
        ...options,
      });
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (message: string, options?: Partial<NotificationItem>) => {
      return addNotification({
        message,
        type: 'info',
        duration: 4000,
        ...options,
      });
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (message: string, options?: Partial<NotificationItem>) => {
      return addNotification({
        message,
        type: 'warning',
        duration: 5000,
        ...options,
      });
    },
    [addNotification]
  );

  // إشعارات خاصة للتطوير
  const showFileOperation = useCallback(
    (operation: string, fileName: string, success: boolean) => {
      const message = success
        ? `تم ${operation} الملف ${fileName} بنجاح`
        : `فشل في ${operation} الملف ${fileName}`;

      return addNotification({
        message,
        type: success ? 'success' : 'error',
        title: `عملية الملف`,
        duration: success ? 3000 : 5000,
      });
    },
    [addNotification]
  );

  const showGitOperation = useCallback(
    (operation: string, success: boolean, details?: string) => {
      const message = success
        ? `تم تنفيذ عملية Git: ${operation}`
        : `فشل في عملية Git: ${operation}`;

      return addNotification({
        message: details ? `${message} - ${details}` : message,
        type: success ? 'success' : 'error',
        title: 'Git',
        duration: success ? 3000 : 6000,
      });
    },
    [addNotification]
  );

  const showAIResponse = useCallback(
    (message: string, hasAction?: boolean) => {
      return addNotification({
        message,
        type: 'info',
        title: '🤖 AI Assistant',
        duration: hasAction ? 0 : 5000, // بدون مدة إذا كان هناك إجراء
        action: hasAction
          ? {
              label: 'عرض التفاصيل',
              onClick: () => {
                // يمكن ربطه بنافذة تفاصيل AI
                console.log('عرض تفاصيل AI');
              },
            }
          : undefined,
      });
    },
    [addNotification]
  );

  const showCommandResult = useCallback(
    (command: string, success: boolean, output?: string) => {
      return addNotification({
        message: success ? `تم تنفيذ الأمر بنجاح: ${command}` : `فشل في تنفيذ الأمر: ${command}`,
        type: success ? 'success' : 'error',
        title: 'Terminal',
        duration: success ? 3000 : 5000,
        action: output
          ? {
              label: 'عرض المخرجات',
              onClick: () => {
                console.log('Command output:', output);
              },
            }
          : undefined,
      });
    },
    [addNotification]
  );

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showFileOperation,
    showGitOperation,
    showAIResponse,
    showCommandResult,
  };
};

// مدير الإشعارات العام
class NotificationManager {
  private static instance: NotificationManager;
  private listeners: Array<(notifications: NotificationItem[]) => void> = [];
  private notifications: NotificationItem[] = [];

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  subscribe(listener: (notifications: NotificationItem[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.notifications]));
  }

  add(notification: Omit<NotificationItem, 'id'>): string {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: NotificationItem = {
      ...notification,
      id,
    };

    this.notifications.unshift(newNotification);
    this.notify();
    return id;
  }

  remove(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notify();
  }

  clear() {
    this.notifications = [];
    this.notify();
  }

  // دوال مساعدة عامة
  success(message: string, options?: Partial<NotificationItem>) {
    return this.add({
      message,
      type: 'success',
      duration: 4000,
      ...options,
    });
  }

  error(message: string, options?: Partial<NotificationItem>) {
    return this.add({
      message,
      type: 'error',
      duration: 6000,
      ...options,
    });
  }

  info(message: string, options?: Partial<NotificationItem>) {
    return this.add({
      message,
      type: 'info',
      duration: 4000,
      ...options,
    });
  }

  warning(message: string, options?: Partial<NotificationItem>) {
    return this.add({
      message,
      type: 'warning',
      duration: 5000,
      ...options,
    });
  }
}

export const notificationManager = NotificationManager.getInstance();

// Hook للاستخدام مع المدير العام
export const useGlobalNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const unsubscribe = notificationManager.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  return {
    notifications,
    addNotification: (notification: Omit<NotificationItem, 'id'>) =>
      notificationManager.add(notification),
    removeNotification: (id: string) => notificationManager.remove(id),
    clearAll: () => notificationManager.clear(),
    showSuccess: (message: string, options?: Partial<NotificationItem>) =>
      notificationManager.success(message, options),
    showError: (message: string, options?: Partial<NotificationItem>) =>
      notificationManager.error(message, options),
    showInfo: (message: string, options?: Partial<NotificationItem>) =>
      notificationManager.info(message, options),
    showWarning: (message: string, options?: Partial<NotificationItem>) =>
      notificationManager.warning(message, options),
  };
};
