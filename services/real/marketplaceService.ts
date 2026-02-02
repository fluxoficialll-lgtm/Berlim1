import { MarketplaceItem, Comment, User } from '../../types';
import { db } from '@/database';
import { DiscoveryHub } from '../discovery/DiscoveryHub';
import { API_BASE } from '../../apiConfig';
import { authService } from '../authService';
import { sqlite } from '../../database/engine';

const API_URL = `${API_BASE}/api/marketplace`;

export const marketplaceService = {
  getRecommendedItems: (userEmail?: string): MarketplaceItem[] => {
    try {
        const allItems = db.marketplace.getAll() || [];
        return DiscoveryHub.getMarketplace(allItems);
    } catch (e) {
        console.error("Marketplace scoring error", e);
        return [];
    }
  },

  fetchItems: async (): Promise<void> => {
      try {
          const response = await fetch(API_URL);
          if (response.ok) {
              const data = await response.json();
              if (data && Array.isArray(data.data)) {
                  // Caching server data locally for persistence
                  sqlite.upsertItems('marketplace', data.data);
              }
          }
      } catch(e) {
          console.warn("Marketplace offline mode");
      }
  },

  getItems: (): MarketplaceItem[] => {
    return db.marketplace.getAll().sort((a, b) => (Number(b.timestamp) || 0) - (Number(a.timestamp) || 0));
  },

  getItemById: (id: string): MarketplaceItem | undefined => {
    return db.marketplace.getAll().find(item => item.id === id);
  },
  
  createItem: async (item: MarketplaceItem) => {
    db.marketplace.add(item);
    try {
        await fetch(`${API_URL}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });
    } catch (e) {}
  },
  
  deleteItem: async (id: string) => {
    db.marketplace.delete(id);
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    } catch (e) {}
  },

  trackView: (item: MarketplaceItem, userEmail: string) => {
      // Analytics tracking logic
  },

  addComment: (itemId: string, text: string, user: User): Comment | undefined => {
      const item = db.marketplace.findById(itemId);
      if (item) {
          const comment: Comment = {
              id: 'q-' + Date.now(),
              userId: user.id,
              username: user.profile?.name ? user.profile.name : 'user',
              avatar: user.profile?.photoUrl,
              text,
              timestamp: Date.now(),
              replies: [],
              likes: 0,
              likedByMe: false
          };
          item.comments = [comment, ...(item.comments || [])];
          db.marketplace.update(item);
          return comment;
      }
  },

  addReply: (itemId: string, parentCommentId: string, text: string, user: User): Comment | undefined => {
      const item = db.marketplace.findById(itemId);
      if (item && item.comments) {
          const parent = item.comments.find(c => c.id === parentCommentId);
          if (parent) {
              const reply: Comment = {
                  id: 'qr-' + Date.now(),
                  userId: user.id,
                  username: user.profile?.name ? user.profile.name : 'user',
                  avatar: user.profile?.photoUrl,
                  text,
                  timestamp: Date.now(),
                  replies: [],
                  likes: 0,
                  likedByMe: false,
                  replyToUsername: parent.username
              };
              parent.replies = [...(parent.replies || []), reply];
              db.marketplace.update(item);
              return reply;
          }
      }
  },

  toggleCommentLike: (itemId: string, commentId: string) => {
      const item = db.marketplace.findById(itemId);
      if (item && item.comments) {
          const toggle = (list: Comment[]): boolean => {
              for (const c of list) {
                  if (c.id === commentId) {
                      c.likedByMe = !c.likedByMe;
                      c.likes = (c.likes || 0) + (c.likedByMe ? 1 : -1);
                      return true;
                  }
                  if (c.replies && toggle(c.replies)) return true;
              }
              return false;
          };
          if (toggle(item.comments)) {
              db.marketplace.update(item);
              return true;
          }
      }
      return false;
  },

  deleteComment: async (itemId: string, commentId: string) => {
      const item = db.marketplace.findById(itemId);
      if (item && item.comments) {
          const removeFromList = (list: Comment[]): Comment[] => {
              return list.filter(c => {
                  if (c.id === commentId) return false;
                  if (c.replies) c.replies = removeFromList(c.replies);
                  return true;
              });
          };
          item.comments = removeFromList(item.comments);
          db.marketplace.update(item);
          return true;
      }
      return false;
  }
};