import { NotificationItem } from '../../types';
import { authService } from '../authService';
import { API_BASE } from '../../apiConfig';

const API_URL = `${API_BASE}/api/notifications`;

export const notificationService = {

  getNotifications: async (): Promise<NotificationItem[]> => {
    const email = authService.getCurrentUserEmail();
    if (!email) return [];

    try {
        const res = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`);
        if (!res.ok) {
            console.error("Failed to fetch notifications with status:", res.status);
            return [];
        }
        const data = await res.json();
        return (data.notifications || []).sort((a: NotificationItem, b: NotificationItem) => b.timestamp - a.timestamp);
    } catch (e) {
        console.warn("[Notification Service] Failed to fetch from server:", e);
        return [];
    }
  },

  getUnreadCount: async (): Promise<number> => {
    const notifs = await notificationService.getNotifications();
    return notifs.filter(n => !n.read).length;
  },

  addNotification: async (notif: Omit<NotificationItem, 'id' | 'time' | 'timestamp' | 'read'>) => {
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(notif),
        });
    } catch (e) {
        console.error("Failed to add notification:", e);
    }
  },

  removeNotification: async (id: number) => {
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    } catch (e) {
        console.error("Failed to remove notification:", e);
    }
  },

  markAllAsRead: async () => {
    const email = authService.getCurrentUserEmail();
    if (!email) return;

    try {
        await fetch(`${API_URL}/mark-all-read`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
    } catch (e) {
        console.error("Failed to mark all notifications as read:", e);
    }
  }
};