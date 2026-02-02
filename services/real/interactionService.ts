
import { PostMetricsService } from './PostMetricsService';

// Cache em memória para evitar requisições redundantes na mesma sessão
const processedInteractions = new Set<string>();

export const interactionService = {
    /**
     * Registra uma visualização única.
     */
    trackView: async (assetId: string) => {
        const cacheKey = `${assetId}_view`;
        if (processedInteractions.has(cacheKey)) return;

        processedInteractions.add(cacheKey);
        await PostMetricsService.trackView(assetId);
    },

    /**
     * Alterna o estado de 'curtida' garantindo contagem correta.
     */
    toggleLike: async (assetId: string, currentState: boolean) => {
        return await PostMetricsService.toggleLike(assetId, currentState);
    }
};
