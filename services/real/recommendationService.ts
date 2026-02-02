
import { Post } from '../../types';
import { DiscoveryHub } from '../discovery/DiscoveryHub';

/**
 * recommendationService (v5.0 - Specialized Hub)
 * Agora delegando a lógica para motores especializados por aba.
 */
export const recommendationService = {
    
    trackImpression: (postId: string) => {
        // Telemetria para o feedback loop do DiscoveryHub
    },

    recordInteraction: (userEmail: string, post: Post, type: string, value?: number) => {
        // Envia sinais para os motores aprenderem
    },

    /**
     * Roda o score básico para o Feed Social
     */
    scorePost: (post: Post, userEmail?: string): number => {
        // Mantido para compatibilidade onde o score unitário é necessário
        return 1000;
    },

    /**
     * FEED DE REELS (Especializado)
     */
    getRecommendedReels: async (reels: Post[]): Promise<Post[]> => {
        return await DiscoveryHub.getReels(reels);
    },

    /**
     * FEED PRINCIPAL (Social & Recência)
     */
    getRecommendedFeed: async (posts: Post[]): Promise<Post[]> => {
        return await DiscoveryHub.getFeed(posts);
    }
};
