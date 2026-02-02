import { Post, Comment, PaginatedResponse } from '../../types';
import { db } from '../../database';
import { authService } from '../authService';
import { MOCK_POSTS } from '../../mocks';

export const postService = {
  formatRelativeTime: (ts: number) => {
      const diff = Math.floor((Date.now() - ts) / 1000);
      if (diff < 60) return 'Agora';
      if (diff < 3600) return `${Math.floor(diff/60)}m`;
      if (diff < 86400) return `${Math.floor(diff/3600)}h`;
      return new Date(ts).toLocaleDateString();
  },

  getFeedPaginated: async (options: any): Promise<PaginatedResponse<Post>> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const limit = options.limit || 15;
      const cursor = options.cursor;
      let allPosts = db.posts.getAll();
      if (allPosts.length === 0) {
          MOCK_POSTS.forEach(p => db.posts.add(p));
          allPosts = db.posts.getAll();
      }
      const feedPosts = allPosts.filter(p => p.type !== 'video' || p.isAd);
      let filtered = feedPosts;
      if (cursor) {
          filtered = feedPosts.filter(p => p.timestamp < cursor);
      }
      filtered.sort((a, b) => b.timestamp - a.timestamp);
      const batch = filtered.slice(0, limit);
      const nextCursor = filtered.length > limit ? batch[batch.length - 1].timestamp : undefined;
      return { data: batch, nextCursor };
  },

  searchPosts: async (query: string): Promise<Post[]> => {
      await new Promise(resolve => setTimeout(resolve, 400));
      const term = query.toLowerCase().trim();
      if (!term) return [];
      const all = db.posts.getAll();
      return all.filter(p => 
        (p.text?.toLowerCase().includes(term) || p.username?.toLowerCase().includes(term)) && 
        (p.type !== 'video' || p.isAd)
      );
  },

  uploadMedia: async (file: File) => {
      return URL.createObjectURL(file);
  },

  addPost: async (post: Post) => {
      db.posts.add(post);
      return Promise.resolve();
  },

  toggleLike: async (postId: string) => {
      const post = db.posts.findById(postId);
      if (post) {
          post.liked = !post.liked;
          post.likes += post.liked ? 1 : -1;
          db.posts.update(post);
          return post;
      }
  },

  incrementView: (id: string) => {
      const post = db.posts.findById(id);
      if (post) {
          post.views++;
          db.posts.update(post);
      }
  },

  getPostById: (id: string) => {
      return db.posts.findById(id) || MOCK_POSTS.find(p => p.id === id);
  },

  getUserPosts: (authorId: string) => {
      let all = db.posts.getAll();
      if (all.length === 0) {
          MOCK_POSTS.forEach(p => db.posts.add(p));
          all = db.posts.getAll();
      }
      return all.filter(p => p.authorId === authorId || p.authorId === 'u-creator-002');
  },

  deletePost: async (id: string) => {
      db.posts.delete(id);
      return Promise.resolve();
  },

  addComment: async (postId: string, text: string, username: string, avatar?: string) => {
      const post = db.posts.findById(postId);
      if (post) {
          const comment: Comment = {
              id: 'c-' + Date.now(),
              userId: authService.getCurrentUserId() || 'guest',
              username: username.replace(/^@/, ''), // Garante que o username no DB não tenha @
              avatar,
              text,
              timestamp: Date.now(),
              replies: []
          };
          post.commentsList = [comment, ...(post.commentsList || [])];
          post.comments++;
          db.posts.update(post);
          return comment;
      }
  },

  deleteComment: async (postId: string, commentId: string) => {
      const post = db.posts.findById(postId);
      if (post) {
          const removeFromList = (list: Comment[]): Comment[] => {
              return list.filter(c => {
                  if (c.id === commentId) return false;
                  if (c.replies) c.replies = removeFromList(c.replies);
                  return true;
              });
          };
          post.commentsList = removeFromList(post.commentsList || []);
          post.comments--;
          db.posts.update(post);
          return true;
      }
      return false;
  },

  incrementShare: (id: string) => {
      const post = db.posts.findById(id);
      if (post) {
          post.views += 5;
          db.posts.update(post);
      }
  },

  addReply: (postId: string, commentId: string, text: string, username: string, avatar?: string): Comment | undefined => {
      const post = db.posts.findById(postId);
      if (post && post.commentsList) {
          let rootComment: Comment | undefined;
          let repliedToUser: string | undefined;

          // Busca o comentário de nível 0 (raiz) para manter apenas 2 níveis
          for (const c of post.commentsList) {
              if (c.id === commentId) {
                  rootComment = c;
                  repliedToUser = c.username;
                  break;
              }
              const nested = c.replies?.find(r => r.id === commentId);
              if (nested) {
                  rootComment = c;
                  repliedToUser = nested.username;
                  break;
              }
          }

          if (rootComment) {
              const newReply: Comment = { 
                  id: 'r-' + Date.now(), 
                  userId: authService.getCurrentUserId() || 'guest', 
                  text, 
                  username: username.replace(/^@/, ''), 
                  avatar, 
                  timestamp: Date.now(),
                  replies: [],
                  replyToUsername: repliedToUser?.replace(/^@/, '') 
              };

              rootComment.replies = [...(rootComment.replies || []), newReply];
              post.comments++;
              db.posts.update(post);
              return newReply;
          }
      }
      return undefined;
  },

  toggleCommentLike: (postId: string, commentId: string) => {
      const post = db.posts.findById(postId);
      if (post && post.commentsList) {
          const toggleRecursive = (list: Comment[]): boolean => {
              for (const c of list) {
                  if (c.id === commentId) {
                      c.likedByMe = !c.likedByMe;
                      c.likes = (c.likes || 0) + (c.likedByMe ? 1 : -1);
                      return true;
                  }
                  if (c.replies && toggleRecursive(c.replies)) return true;
              }
              return false;
          };
          if (toggleRecursive(post.commentsList)) {
              db.posts.update(post);
              return true;
          }
      }
      return false;
  }
};