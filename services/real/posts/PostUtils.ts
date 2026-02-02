
import { Post } from '../../../types';
import { authService } from '../../authService';

export const PostUtils = {
    /**
     * Formata o timestamp em tempo relativo amigável.
     */
    formatRelativeTime: (ts: number) => {
        const diff = Math.floor((Date.now() - ts) / 1000);
        if (diff < 60) return 'Agora';
        if (diff < 3600) return `${Math.floor(diff/60)}m`;
        if (diff < 86400) return `${Math.floor(diff/3600)}h`;
        return new Date(ts).toLocaleDateString();
    },

    /**
     * Normaliza os dados brutos do banco/API para o formato esperado pela UI.
     */
    sanitizePost: (post: any): Post => {
        const currentUserId = authService.getCurrentUserId();
        const likedByIds = Array.isArray(post.likedByIds) ? post.likedByIds : [];
        return {
            ...post,
            id: String(post.id),
            text: String(post.text || ""),
            authorId: String(post.authorId || ""),
            username: String(post.username || "Anônimo"),
            likes: Number(post.likes || 0),
            comments: Number(post.comments || 0),
            views: Number(post.views || 0),
            liked: currentUserId ? likedByIds.includes(currentUserId) : !!post.liked,
            images: post.images || undefined,
            isAd: !!post.isAd,
            ctaText: post.ctaText || undefined,
            ctaLink: post.ctaLink || undefined,
            relatedGroupId: post.relatedGroupId || undefined,
            isAdultContent: !!post.isAdultContent,
            location: post.location || undefined
        };
    }
};
