
import { Post, PaginatedResponse } from '../../../types';
import { API_BASE } from '../../../apiConfig';
import { db } from '../../../database';
import { sqlite } from '../../../database/engine';
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
            
            if (!response.ok) throw new Error("Server error");
            const data = await response.json();
            const sanitized = (data.data || []).map(PostUtils.sanitizePost);

            if (sanitized.length > 0) {
                sqlite.upsertItems('posts', sanitized);
            }

            return { data: sanitized, nextCursor: data.nextCursor };
        } catch (e) {
            return { data: db.posts.getAll().map(PostUtils.sanitizePost), nextCursor: undefined };
        }
    },

    /**
     * Realiza busca global por texto ou usuário.
     */
    async searchPosts(query: string): Promise<Post[]> {
        try {
            const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
            if (response.ok) {
                const data = await response.json();
                const sanitized = (data.data || []).map(PostUtils.sanitizePost);
                if (sanitized.length > 0) sqlite.upsertItems('posts', sanitized);
                return sanitized;
            }
        } catch (e) {}
        
        const term = query.toLowerCase().trim();
        if (!term) return [];
        return db.posts.getAll()
            .filter(p => (p.text?.toLowerCase().includes(term) || p.username?.toLowerCase().includes(term)) && !p.video)
            .map(PostUtils.sanitizePost);
    },

    getPostById(id: string): Post | undefined {
        const post = db.posts.findById(id);
        return post ? PostUtils.sanitizePost(post) : undefined;
    },

    getUserPosts(authorId: string): Post[] {
        return db.posts.getAll()
            .filter(p => p.authorId === authorId)
            .map(PostUtils.sanitizePost);
    }
};
