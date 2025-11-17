export type NotificationType = 'info' | 'success' | 'error' | 'loading';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

export interface NotificationContextType {
  showNotification: (type: NotificationType, message: string) => void;
  hideNotification: () => void;
  currentNotification: Notification | null;
}

