import { NotificationItem } from '../../types';
import { db } from '@/database';
import { MOCK_NOTIFICATIONS } from '../../mocks';

export const notificationService = {
  getNotifications: (): NotificationItem[] => {
    const stored = db.notifications.getAll();
    if (stored.length === 0) return MOCK_NOTIFICATIONS;
    return stored.sort((a, b) => b.timestamp - a.timestamp);
  },

  getUnreadCount: (): number => {
    const notifs = notificationService.getNotifications();
    return notifs.filter(n => !n.read).length;
  },

  // Added missing syncNotifications for compatibility with Real service
  syncNotifications: async () => {
    return Promise.resolve();
  },

  addNotification: (notif: Omit<NotificationItem, 'id' | 'time' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
        ...notif,
        id: Date.now(),
        timestamp: Date.now(),
        time: 'Agora', 
        read: false
    };
    db.notifications.add(newNotif);
  },

  removeNotification: (id: number) => {
    db.notifications.delete(id);
  },

  markAllAsRead: () => {
     const all = notificationService.getNotifications();
     all.forEach(n => {
         if(!n.read) {
             const updated = { ...n, read: true };
             db.notifications.add(updated);
         }
     });
  }
};