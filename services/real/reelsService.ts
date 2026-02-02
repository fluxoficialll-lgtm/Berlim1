import { Post } from '../../types';
import { db } from '@/database';
import { recommendationService } from '../recommendationService';
import { chatService } from '../chatService';
import { adService } from '../adService';
import { postService } from '../postService';
import { PostMetricsService } from './PostMetricsService';
import { API_BASE } from '../../apiConfig';
import { sqlite } from '../../database/engine';

export const reelsService = {
  fetchReels: async (): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE}/api/posts?limit=50&type=video`);
        if (response.ok) {
            const data = await response.json();
            const posts = data.data || [];
            const videos = posts.filter((p: any) => p.type === 'video');
            
            // HYDRATION: Save reels to cache
            if (videos.length > 0) {
                sqlite.upsertItems('posts', videos);
            }
        }
    } catch (e) {
        console.warn("Reels fetch failed, using local cache");
    }
  },

  getReels: (userEmail?: string, allowAdultContent: boolean = false): Post[] => {
    const allPosts = db.posts.getAll();
    let videos = allPosts.filter(p => p && p.type === 'video');

    if (!allowAdultContent) {
        videos = videos.filter(p => !p.isAdultContent);
    }

    if (userEmail) {
        const blockedIds = chatService.getBlockedIdentifiers(String(userEmail));
        if (blockedIds.size > 0) {
            videos = videos.filter(p => {
                const username = String(p.username || "");
                const handle = username.replace('@', '').toLowerCase();
                return !blockedIds.has(username) && !blockedIds.has(handle);
            });
        }
    }

    return videos.sort((a, b) => b.timestamp - a.timestamp);
  },

  getReelsByAuthor: (authorId: string, allowAdultContent: boolean = false): Post[] => {
    const allPosts = db.posts.getAll();
    let videos = allPosts.filter(p => p && p.type === 'video' && p.authorId === authorId);
    if (!allowAdultContent) {
        videos = videos.filter(p => !p.isAdultContent);
    }
    return videos.sort((a, b) => b.timestamp - a.timestamp);
  },

  searchReels: (query: string, category: string, userEmail?: string): Post[] => {
      const allPosts = db.posts.getAll();
      let videos = allPosts.filter(p => p && p.type === 'video');
      const term = String(query || "").toLowerCase().trim();

      return videos.filter(reel => {
          if (term) {
              return String(reel.text || "").toLowerCase().includes(term) || 
                     String(reel.username || "").toLowerCase().includes(term);
          }
          return true;
      });
  },

  uploadVideo: async (file: File): Promise<string> => {
      // Mock/Real upload implementation
      return URL.createObjectURL(file);
  },

  addReel: async (reel: Post) => {
    await postService.addPost(reel);
  },

  toggleLike: async (reelId: string): Promise<Post | undefined> => {
    return await PostMetricsService.toggleLike(reelId, false);
  },

  incrementView: (reelId: string) => {
    PostMetricsService.trackView(reelId);
    recommendationService.trackImpression(reelId);
  }
};