
import { PostMetricsService } from '../PostMetricsService';
import { Post } from '../../../types';
import { db } from '../../../database';

export const PostInteractionService = {
    async toggleLike(postId: string): Promise<Post | undefined> {
        const post = db.posts.findById(postId);
        if (post) {
            return await PostMetricsService.toggleLike(postId, !!post.liked) || undefined;
        }
    },

    incrementView(id: string): void {
        PostMetricsService.trackView(id);
    },

    incrementShare(postId: string): void {
        const post = db.posts.findById(postId);
        if (post) {
            // Em uma implementação real, incrementaríamos um contador de compartilhamentos
            // Por enquanto, registramos como um sinal de visualização bônus
            PostMetricsService.trackView(postId);
        }
    }
};
