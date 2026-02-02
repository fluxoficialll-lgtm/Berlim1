
import { MarketplaceItem, Comment, User } from '../../types';
import { db } from '../../database';

export const marketplaceService = {
  getRecommendedItems: () => {
      return db.marketplace.getAll().sort((a, b) => b.timestamp - a.timestamp);
  },
  fetchItems: async () => {
      return; 
  },
  getItems: () => {
      return db.marketplace.getAll();
  },
  getItemById: (id: string) => {
      return db.marketplace.findById(id);
  },
  createItem: async (item: MarketplaceItem) => {
      db.marketplace.add({
          ...item,
          timestamp: item.timestamp || Date.now()
      });
  },
  deleteItem: async (id: string) => db.marketplace.delete(id),
  trackView: () => {},
  
  addComment: (itemId: string, text: string, user: User) => {
      const item = db.marketplace.findById(itemId);
      if (item) {
          const comment: Comment = {
              id: 'mq-' + Date.now(),
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

  addReply: (itemId: string, parentCommentId: string, text: string, user: User) => {
      const item = db.marketplace.findById(itemId);
      if (item && item.comments) {
          const parent = item.comments.find(c => c.id === parentCommentId);
          if (parent) {
              const reply: Comment = {
                  id: 'mqr-' + Date.now(),
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
