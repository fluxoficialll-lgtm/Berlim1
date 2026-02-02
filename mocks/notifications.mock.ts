
import { NotificationItem } from '../types';

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 99,
    type: 'expiring_vip',
    senderId: 'system',
    username: 'flux_system',
    recipientId: 'u-creator-002',
    recipientEmail: 'creator@test.com',
    text: 'Networking Elite (VIP)',
    groupId: 'g-vip-001',
    time: 'Expira em 2 dias',
    timestamp: Date.now() - 3600000,
    avatar: 'https://cdn-icons-png.flaticon.com/512/10543/10543306.png',
    read: false
  },
  {
    id: 1,
    type: 'sale',
    senderId: 'u-user-003',
    username: '@ana_clara',
    recipientId: 'u-creator-002',
    recipientEmail: 'creator@test.com',
    text: 'Comprou seu item "iPhone 15 Pro Max". Você recebeu R$ 7.890,00!',
    time: 'Agora',
    timestamp: Date.now() - 60000,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    read: false
  },
  {
    id: 2,
    type: 'pending',
    subtype: 'group_join',
    senderId: 'u-user-003',
    username: '@ana_clara',
    recipientId: 'u-creator-002',
    recipientEmail: 'creator@test.com',
    text: 'solicitou entrada no grupo "Networking Elite (VIP)"',
    time: '5m',
    timestamp: Date.now() - 300000,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    read: false
  },
  {
    id: 3,
    type: 'comment',
    senderId: 'u-admin-001',
    username: '@flux_admin',
    recipientId: 'u-creator-002',
    recipientEmail: 'creator@test.com',
    text: 'comentou: "Incrível esses resultados! 🚀"',
    time: '1h',
    timestamp: Date.now() - 3600000,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    postImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=200&auto=format&fit=crop',
    read: false
  },
  {
    id: 4,
    type: 'like',
    senderId: 'u-user-003',
    username: '@ana_clara',
    recipientId: 'u-creator-002',
    recipientEmail: 'creator@test.com',
    time: '3h',
    timestamp: Date.now() - 10800000,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    postImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=200&auto=format&fit=crop',
    read: true
  },
  {
    id: 5,
    type: 'follow',
    senderId: 'u-admin-001',
    username: '@flux_admin',
    recipientId: 'u-creator-002',
    recipientEmail: 'creator@test.com',
    text: '',
    time: '5h',
    timestamp: Date.now() - 18000000,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    isFollowing: false,
    read: true
  },
  {
    id: 6,
    type: 'mention',
    senderId: 'u-creator-002',
    username: '@pixel_master',
    recipientId: 'u-creator-002',
    recipientEmail: 'creator@test.com',
    text: 'te mencionou em um post.',
    time: '1d',
    timestamp: Date.now() - 86400000,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eduardo',
    read: true
  }
];
