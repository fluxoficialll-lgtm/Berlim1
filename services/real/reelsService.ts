import { Post } from '../../types';
import { recommendationService } from '../recommendationService';
import { chatService } from '../chatService';
import { postService } from '../postService';
import { PostMetricsService } from './PostMetricsService';
import { API_BASE } from '../../apiConfig';

const API_URL = `${API_BASE}/api/posts`;

// Helper function to fetch and filter reels
const fetchAndFilterReels = async (url: string, userEmail?: string, allowAdultContent: boolean = false): Promise<Post[]> => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error("Failed to fetch reels with status:", response.status);
            return [];
        }
        const data = await response.json();
        let videos = (data.data || []).filter((p: any) => p.type === 'video');

        if (!allowAdultContent) {
            videos = videos.filter((p: Post) => !p.isAdultContent);
        }

        if (userEmail) {
            const blockedIds = chatService.getBlockedIdentifiers(userEmail);
            if (blockedIds.size > 0) {
                videos = videos.filter((p: Post) => {
                    const username = String(p.username || "").replace('@', '').toLowerCase();
                    return !blockedIds.has(username);
                });
            }
        }

        return videos.sort((a: Post, b: Post) => (b.timestamp || 0) - (a.timestamp || 0));
    } catch (e) {
        console.warn("Reels fetch failed:", e);
        return [];
    }
};

export const reelsService = {
  getReels: async (userEmail?: string, allowAdultContent: boolean = false): Promise<Post[]> => {
    return fetchAndFilterReels(`${API_URL}?type=video&limit=50`, userEmail, allowAdultContent);
  },

  getReelsByAuthor: async (authorId: string, userEmail?: string, allowAdultContent: boolean = false): Promise<Post[]> => {
    return fetchAndFilterReels(`${API_URL}/user/${authorId}?type=video`, userEmail, allowAdultContent);
  },

  searchReels: async (query: string, userEmail?: string, allowAdultContent: boolean = false): Promise<Post[]> => {
    const term = query.toLowerCase().trim();
    if (!term) return [];
    return fetchAndFilterReels(`${API_URL}/search?q=${encodeURIComponent(term)}&type=video`, userEmail, allowAdultContent);
  },

  uploadVideo: async (file: File): Promise<string> => {
      // This should be a real upload to your backend or cloud storage.
      // For now, it returns a local blob URL as a placeholder.
      return URL.createObjectURL(file);
  },

  addReel: async (reel: Partial<Post>) => {
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