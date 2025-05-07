import { Email } from './types';

const NOTIFICATIONS_KEY = 'cybersentinel_notifications';

export interface Notification {
  id: number;
  message: string;
  emailId?: number;
  read: boolean;
  timestamp: string;
  type: 'phishing' | 'suspicious' | 'info' | 'warning';
}

export const notificationsStore = {
  getNotifications: (): Notification[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const storedNotifications = localStorage.getItem(NOTIFICATIONS_KEY);
      return storedNotifications ? JSON.parse(storedNotifications) : [];
    } catch (error) {
      console.error('Error getting notifications from localStorage:', error);
      return [];
    }
  },

  saveNotifications: (notifications: Notification[]): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications to localStorage:', error);
    }
  },

  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const currentNotifications = notificationsStore.getNotifications();
      const newNotification: Notification = {
        ...notification,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        read: false
      };
      const updatedNotifications = [newNotification, ...currentNotifications];
      notificationsStore.saveNotifications(updatedNotifications);
    } catch (error) {
      console.error('Error adding notification to localStorage:', error);
    }
  },

  markAsRead: (id: number): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const currentNotifications = notificationsStore.getNotifications();
      const updatedNotifications = currentNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      );
      notificationsStore.saveNotifications(updatedNotifications);
    } catch (error) {
      console.error('Error updating notification in localStorage:', error);
    }
  },

  markAllAsRead: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const currentNotifications = notificationsStore.getNotifications();
      const updatedNotifications = currentNotifications.map(notification => ({ 
        ...notification, 
        read: true 
      }));
      notificationsStore.saveNotifications(updatedNotifications);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  },

  removeNotification: (id: number): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const currentNotifications = notificationsStore.getNotifications();
      const updatedNotifications = currentNotifications.filter(
        notification => notification.id !== id
      );
      notificationsStore.saveNotifications(updatedNotifications);
    } catch (error) {
      console.error('Error removing notification from localStorage:', error);
    }
  },

  clearAllNotifications: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(NOTIFICATIONS_KEY);
    } catch (error) {
      console.error('Error clearing notifications from localStorage:', error);
    }
  },

  addEmailNotification: (email: Email): void => {
    if (typeof window === 'undefined') return;
    
    if (email.riskLevel === 'safe') return;

    const type = email.riskLevel === 'phishing' ? 'phishing' : 'suspicious';
    const message = email.riskLevel === 'phishing'
      ? `Phishing email detected: "${email.subject}" from ${email.sender}`
      : `Suspicious email detected: "${email.subject}" from ${email.sender}`;

    notificationsStore.addNotification({
      message,
      emailId: email.id,
      type
    });
  },

  getUnreadCount: (): number => {
    const notifications = notificationsStore.getNotifications();
    return notifications.filter(notification => !notification.read).length;
  }
};