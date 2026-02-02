
import { db } from '../../database';
import { ChatMessage, ChatData } from '../../types';
import { authService } from '../authService';
import { MOCK_CHATS } from '../../mocks';

/**
 * Helper para ajustar os mocks ao usuário atual.
 */
const getAdjustedMocks = (currentUserEmail: string): ChatData[] => {
    const email = currentUserEmail.toLowerCase();
    return MOCK_CHATS.map(chat => {
        const chatId = chat.id.toString();
        const adjustedId = chatId.includes('creator@test.com') 
            ? chatId.replace('creator@test.com', email)
            : chatId;

        return {
            ...chat,
            id: adjustedId,
            messages: chat.messages.map(m => {
                const isFromMockCreator = m.senderEmail === 'creator@test.com';
                return {
                    ...m,
                    senderEmail: isFromMockCreator ? email : m.senderEmail,
                    type: isFromMockCreator ? 'sent' : 'received'
                };
            })
        };
    });
};

export const chatService = {
    getAllChats: () => {
        const userEmail = authService.getCurrentUserEmail()?.toLowerCase();
        if (!userEmail) return [];

        // Injeção Controlada: Só injeta se a tabela de chats estiver realmente limpa
        // para evitar loops de atualização infinito.
        const allInDb = Object.values(db.chats.getAll());
        const privateChats = allInDb.filter(c => c.id.toString().includes('@'));
        
        if (privateChats.length === 0) {
            const adjustedMocks = getAdjustedMocks(userEmail);
            adjustedMocks.forEach(mockChat => {
                if (!db.chats.get(mockChat.id.toString())) {
                    db.chats.set(mockChat);
                }
            });
        }

        return Object.values(db.chats.getAll()).filter(c => 
            c.id.toString().includes('@') && 
            c.id.toString().toLowerCase().includes(userEmail)
        );
    },

    syncChats: async () => {
        chatService.getAllChats();
        return Promise.resolve();
    },

    getPrivateChatId: (id1: string, id2: string) => [id1.toLowerCase(), id2.toLowerCase()].sort().join('_'),

    getChat: (id: string): ChatData => {
        let chat = db.chats.get(id);
        if (!chat) {
            chat = { id, contactName: 'Conversa', isBlocked: false, messages: [] };
            db.chats.set(chat);
        }
        return chat;
    },

    fetchChatMessages: async () => Promise.resolve(),

    sendMessage: async (chatId: string, message: ChatMessage) => {
        const chat = chatService.getChat(chatId);
        
        // Proteção contra duplicação local
        const existingIds = new Set(chat.messages.map(m => m.id));
        if (!existingIds.has(message.id)) {
            chat.messages.push(message);
            db.chats.set(chat);
        }
    },

    getUnreadCount: () => {
        const userEmail = authService.getCurrentUserEmail()?.toLowerCase();
        if (!userEmail) return 0;

        const chats = chatService.getAllChats();
        return chats.reduce((acc, chat) => {
            return acc + chat.messages.filter(m => {
                const sender = m.senderEmail?.toLowerCase();
                return sender !== userEmail && m.status !== 'read';
            }).length;
        }, 0);
    },

    getGroupUnreadCount: (groupId: string) => {
        const chat = db.chats.get(groupId);
        const userEmail = authService.getCurrentUserEmail()?.toLowerCase();
        if (!chat || !userEmail) return 0;

        return chat.messages.filter(m => {
            const sender = m.senderEmail?.toLowerCase();
            return sender !== userEmail && m.status !== 'read';
        }).length;
    },

    markChatAsRead: (id: string) => {
        const chat = db.chats.get(id);
        const userEmail = authService.getCurrentUserEmail()?.toLowerCase();
        if (chat && userEmail) {
            chat.messages.forEach(m => {
                if (m.senderEmail?.toLowerCase() !== userEmail) {
                    m.status = 'read';
                }
            });
            db.chats.set(chat);
        }
    },

    toggleBlock: (id: string) => {
        const chat = chatService.getChat(id);
        chat.isBlocked = !chat.isBlocked;
        db.chats.set(chat);
        return chat.isBlocked;
    },

    deleteMessages: async (chatId: string, ids: number[]) => {
        const chat = chatService.getChat(chatId);
        chat.messages = chat.messages.filter(m => !ids.includes(m.id));
        db.chats.set(chat);
    },

    clearChat: (id: string) => {
        const chat = chatService.getChat(id);
        chat.messages = [];
        db.chats.set(chat);
    },

    markAllAsRead: () => {
        const userEmail = authService.getCurrentUserEmail()?.toLowerCase();
        if (!userEmail) return;

        const allChats = db.chats.getAll();
        Object.values(allChats).forEach(chat => {
            if (chat.id.toString().includes(userEmail)) {
                chat.messages.forEach(m => {
                    if (m.senderEmail?.toLowerCase() !== userEmail) {
                        m.status = 'read';
                    }
                });
                db.chats.set(chat);
            }
        });
    },

    hasBlockingRelationship: (uid1: string, uid2: string) => {
        const chatId = chatService.getPrivateChatId(uid1, uid2);
        return db.chats.get(chatId)?.isBlocked || false;
    },

    toggleBlockByContactName: (name: string) => {
        const cleanName = name.replace('@', '').toLowerCase();
        const all = db.chats.getAll();
        const chat = Object.values(all).find(c => c.contactName.toLowerCase() === cleanName);
        if (chat) {
            chat.isBlocked = !chat.isBlocked;
            db.chats.set(chat);
            return chat.isBlocked;
        }
        return false;
    },

    getBlockedIdentifiers: () => {
        const all = db.chats.getAll();
        const blocked = new Set<string>();
        Object.values(all).forEach(c => {
            if (c.isBlocked) blocked.add(c.contactName);
        });
        return blocked;
    }
};
