
import { Post, PaginatedResponse } from '../../../types';
import { API_BASE } from '../../../apiConfig';
import { PostUtils } from './PostUtils';

const API_URL = `${API_BASE}/api/posts`;

export const PostQueryService = {
    /**
     * Busca o feed principal com paginação via cursor.
     */
    async getFeedPaginated(options: any): Promise<PaginatedResponse<Post>> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);
            const response = await fetch(`${API_URL}?limit=${options.limit}&cursor=${options.cursor || ''}`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            if (!response.ok) {
              console.error("Failed to fetch feed with status:", response.status);
              return { data: [], nextCursor: undefined };
            }

            const data = await response.json();
            const sanitized = (data.data || []).map(PostUtils.sanitizePost);

            return { data: sanitized, nextCursor: data.nextCursor };
        } catch (e) {
            console.error("Failed to fetch feed:", e);
            return { data: [], nextCursor: undefined };
        }
    },

    /**
     * Realiza busca global por texto ou usuário.
     */
    async searchPosts(query: string): Promise<Post[]> {
        if (!query.trim()) return [];
        try {
            const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
            if (response.ok) {
                const data = await response.json();
                return (data.data || []).map(PostUtils.sanitizePost);
            }
            return [];
        } catch (e) {
            console.error("Failed to search posts:", e);
            return [];
        }
    },

    async getPostById(id: string): Promise<Post | undefined> {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) {
                return undefined;
            }
            const post = await response.json();
            return post ? PostUtils.sanitizePost(post) : undefined;
        } catch (e) {
            console.error(`Failed to fetch post ${id}:`, e);
            return undefined;
        }
    },

    async getUserPosts(authorId: string): Promise<Post[]> {
        try {
            const response = await fetch(`${API_URL}/user/${authorId}`);
            if (!response.ok) {
                return [];
            }
            const data = await response.json();
            return (data.data || []).map(PostUtils.sanitizePost);
        } catch (e) {
            console.error(`Failed to fetch posts for user ${authorId}:`, e);
            return [];
        }
    }
};
