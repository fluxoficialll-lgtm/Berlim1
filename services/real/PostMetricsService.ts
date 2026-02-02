import { db } from '../../database';
import { Post } from '../../types';
import { API_BASE } from '../../apiConfig';
import { authService } from '../authService';

const SESSION_VIEW_CACHE_KEY = 'flux_viewed_posts_session';

/**
 * PostMetricsService
 * Única fonte de verdade para atualizar métricas de posts (Likes, Comentários, Visualizações).
 * Gerencia atualizações locais otimistas e sincronização remota com trava de duplicidade.
 */
export const PostMetricsService = {
    /**
     * Incrementa a contagem de visualizações com proteção contra duplicidade na sessão.
     */
    trackView: async (postId: string) => {
        // --- TRAVA DE DUPLICIDADE POR SESSÃO ---
        let viewedPosts: string[] = [];
        try {
            viewedPosts = JSON.parse(sessionStorage.getItem(SESSION_VIEW_CACHE_KEY) || '[]');
        } catch (e) {
            viewedPosts = [];
        }

        if (viewedPosts.includes(postId)) {
            // Post já visualizado nesta sessão de navegador, ignora incremento.
            return;
        }

        const post = db.posts.findById(postId);
        if (!post) return;

        // Registra visualização no cache da sessão
        viewedPosts.push(postId);
        sessionStorage.setItem(SESSION_VIEW_CACHE_KEY, JSON.stringify(viewedPosts));

        const userId = authService.getCurrentUserId();
        
        // Atualização local otimista
        post.views = (post.views || 0) + 1;
        db.posts.update(post);

        // Sincronização em background com o servidor
        try {
            fetch(`${API_BASE}/api/posts/${postId}/interact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, type: 'view', action: 'add' })
            }).catch(() => {});
        } catch (e) {}
    },

    /**
     * Alterna o estado de curtida de um post.
     */
    toggleLike: async (postId: string, currentState: boolean): Promise<Post | null> => {
        const post = db.posts.findById(postId);
        if (!post) return null;

        const userId = authService.getCurrentUserId();
        const action = currentState ? 'remove' : 'add';
        
        // Atualização local otimista
        post.liked = !currentState;
        post.likes = Math.max(0, (post.likes || 0) + (post.liked ? 1 : -1));
        
        if (userId) {
            const likedByIds = new Set(post.likedByIds || []);
            if (post.liked) likedByIds.add(userId);
            else likedByIds.delete(userId);
            post.likedByIds = Array.from(likedByIds);
        }

        db.posts.update(post);

        // Sync com servidor
        try {
            fetch(`${API_BASE}/api/posts/${postId}/interact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, type: 'like', action })
            }).catch(() => {});
        } catch (e) {}

        return post;
    },

    /**
     * Atualiza contagem de comentários quando um comentário é adicionado ou removido.
     */
    notifyCommentChange: (postId: string, delta: number) => {
        const post = db.posts.findById(postId);
        if (post) {
            post.comments = Math.max(0, (post.comments || 0) + delta);
            db.posts.update(post);
        }
    },

    /**
     * Sincroniza o objeto do post com os dados mais recentes do banco local.
     */
    syncPostObject: (post: Post): Post => {
        const latest = db.posts.findById(post.id);
        if (latest) {
            return {
                ...post,
                likes: latest.likes,
                comments: latest.comments,
                views: latest.views,
                liked: latest.liked
            };
        }
        return post;
    }
};