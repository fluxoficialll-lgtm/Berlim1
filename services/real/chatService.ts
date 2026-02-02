
import { db } from '@/database';
import { ChatMessage, ChatData } from '../../types';
import { authService } from '../authService';
import { API_BASE } from '../../apiConfig';
import { ChatVisibilityManager } from '../chat/ChatVisibilityManager';

const API_URL = `${API_BASE}/api/messages`;

export const chatService = {
    getAllChats: () => {
        const userEmail = authService.getCurrentUserEmail();
        const all = Object.values(db.chats.getAll());
        
        const privateChats = all.filter(chat => chat.id.toString().includes('@'));
        return ChatVisibilityManager.filterVisible(privateChats, userEmail);
    },

    syncChats: async () => {
        const email = authService.getCurrentUserEmail();
        if (!email) return;
        try {
            const res = await fetch(`${API_URL}/private?email=${encodeURIComponent(email)}`);
            if (res.ok) {
                const data = await res.json();
                data.chats?.forEach((c: any) => {
                    if (c.id.toString().includes('@')) {
                        db.chats.set(c);
                    }
                });
            }
        } catch (e) {
            console.warn("Chat sync failed");
        }
    },

    getPrivateChatId: (id1: string, id2: string) => [id1.toLowerCase(), id2.toLowerCase()].sort().join('_'),

    getChat: (id: string): ChatData => {
        let chat = db.chats.get(id);
        if (!chat) {
            chat = { id, contactName: id.includes('@') ? 'Chat' : 'Grupo', isBlocked: false, messages: [], deletedBy: [] };
            db.chats.set(chat);
        }
        return chat;
    },

    fetchChatMessages: async (chatId: string, limit: number = 50, beforeId?: number) => {
        try {
            const isGroup = !chatId.includes('@');
            const url = isGroup 
                ? `${API_URL}/groups/${chatId}?limit=${limit}&before=${beforeId || ''}`
                : `${API_URL}/private/${chatId}?limit=${limit}&before=${beforeId || ''}`;

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                if (data.messages) {
                    const chat = db.chats.get(chatId) || { id: chatId, contactName: isGroup ? 'Grupo' : 'Chat', isBlocked: false, messages: [], deletedBy: [] };
                    const combined = [...(chat.messages || []), ...data.messages];
                    const uniqueMap = new Map();
                    combined.forEach(m => uniqueMap.set(m.id, m));
                    chat.messages = Array.from(uniqueMap.values()).sort((a, b) => a.id - b.id);
                    db.chats.set(chat);
                }
            }
        } catch (e) {
            console.warn("Failed to fetch messages");
        }
    },

    sendMessage: async (chatId: string, message: ChatMessage) => {
        const userId = authService.getCurrentUserId();
        if (userId) message.senderId = userId;
        
        const chat = db.chats.get(chatId);
        if (chat) {
            if (!message.id) message.id = Date.now();
            const existingIds = new Set(chat.messages.map(m => m.id));
            if (!existingIds.has(message.id)) {
                chat.messages.push(message);
                chat.deletedBy = []; 
                db.chats.set(chat);
            }
        }

        try {
            await fetch(`${API_URL}/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatId, message })
            });
        } catch (e) {
            console.error("Failed to send message");
        }
    },

    getUnreadCount: () => {
        const userEmail = authService.getCurrentUserEmail();
        if (!userEmail) return 0;
        const chats = chatService.getAllChats();
        return chats.reduce((acc, chat) => {
            return acc + chat.messages.filter(m => {
                const sender = (m.senderEmail || m.senderId || '').toLowerCase();
                return sender !== userEmail.toLowerCase() && m.status !== 'read';
            }).length;
        }, 0);
    },

    getGroupUnreadCount: (groupId: string) => {
        const chat = db.chats.get(groupId);
        const userEmail = authService.getCurrentUserEmail()?.toLowerCase();
        if (!userEmail || !chat) return 0;
        return chat.messages.filter(m => {
            const sender = (m.senderEmail || m.senderId || '').toLowerCase();
            return sender !== userEmail && m.status !== 'read';
        }).length;
    },

    markChatAsRead: (chatId: string) => {
        const chat = db.chats.get(chatId);
        const userEmail = authService.getCurrentUserEmail()?.toLowerCase();
        if (chat && userEmail) {
            chat.messages.forEach(m => { 
                const sender = (m.senderEmail || m.senderId || '').toLowerCase();
                if(sender !== userEmail) m.status = 'read'; 
            });
            db.chats.set(chat);
        }
    },

    toggleBlock: (chatId: string): boolean => {
        const chat = db.chats.get(chatId);
        if (chat) {
            chat.isBlocked = !chat.isBlocked;
            db.chats.set(chat);
            return chat.isBlocked;
        }
        return false;
    },

    deleteMessages: async (chatId: string, messageIds: number[], target: 'me' | 'all' = 'me') => {
        const isGroup = !chatId.includes('@');
        const userEmail = authService.getCurrentUserEmail();

        if (isGroup) {
            try {
                await fetch(`${API_URL}/groups/${chatId}/hide`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messageIds, userEmail })
                });
            } catch (e) {}
        } else {
            try {
                await fetch(`${API_URL}/private/${chatId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messageIds, target, userEmail })
                });

                if (messageIds.length === 0) {
                    if (target === 'all') {
                        db.chats.delete(chatId);
                    } else {
                        const chat = db.chats.get(chatId);
                        if (chat && userEmail) {
                            const deletedBy = new Set(chat.deletedBy || []);
                            deletedBy.add(userEmail);
                            chat.deletedBy = Array.from(deletedBy);
                            db.chats.set(chat);
                        }
                    }
                }
            } catch (e) {}
        }

        if (messageIds.length > 0) {
            const chat = db.chats.get(chatId);
            if (chat) {
                chat.messages = chat.messages.filter(m => !messageIds.includes(m.id));
                db.chats.set(chat);
            }
        }
    },

    clearChat: (chatId: string, target: 'me' | 'all' = 'me') => {
        const userEmail = authService.getCurrentUserEmail();
        if (!userEmail) return;
        chatService.deleteMessages(chatId, [], target);
    },

    markAllAsRead: () => {
        const userEmail = authService.getCurrentUserEmail()?.toLowerCase();
        if (!userEmail) return;
        const allChats = db.chats.getAll();
        Object.values(allChats).forEach(chat => {
            if (chat.id.toString().includes('@')) {
                chat.messages.forEach(m => { 
                    const sender = (m.senderEmail || m.senderId || '').toLowerCase();
                    if(sender !== userEmail) m.status = 'read'; 
                });
                db.chats.set(chat);
            }
        });
    },

    hasBlockingRelationship: (userId1: string, userId2: string): boolean => {
        const chatId = chatService.getPrivateChatId(userId1, userId2);
        const chat = db.chats.get(chatId);
        return chat?.isBlocked || false;
    },

    toggleBlockByContactName: (name: string): boolean => {
        const cleanName = name.replace('@', '').toLowerCase();
        const allChats = db.chats.getAll();
        const chat = Object.values(allChats).find(c => c.contactName.toLowerCase() === cleanName);
        if (chat) {
            chat.isBlocked = !chat.isBlocked;
            db.chats.set(chat);
            return chat.isBlocked;
        }
        return false;
    },

    getBlockedIdentifiers: (userEmail: string): Set<string> => {
        const allChats = db.chats.getAll();
        const blocked = new Set<string>();
        Object.values(allChats).forEach(chat => {
            if (chat.isBlocked) {
                blocked.add(chat.contactName);
            }
        });
        return blocked;
    }
};
