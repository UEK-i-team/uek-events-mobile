import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { Notification, NotificationContextType, NotificationType } from '../types';

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideNotification = useCallback(() => {
    setCurrentNotification(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const showNotification = useCallback((type: NotificationType, message: string) => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const notification: Notification = {
      id: Date.now().toString(),
      type,
      message,
    };

    setCurrentNotification(notification);

    // Auto-hide after 5 seconds for non-loading notifications
    if (type !== 'loading') {
      timeoutRef.current = setTimeout(() => {
        hideNotification();
      }, 5000);
    }
  }, [hideNotification]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const contextValue: NotificationContextType = {
    showNotification,
    hideNotification,
    currentNotification,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

