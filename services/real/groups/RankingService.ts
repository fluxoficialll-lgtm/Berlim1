
import { db } from '../../../database';
import { Group } from '../../../types';

/**
 * RankingService
 * Responsável pela inteligência de ordenação e filtragem dos rankings de grupos.
 */
export const RankingService = {
    /**
     * Calcula o score de um grupo para o ranking.
     * Atualmente baseado em volume de membros + bônus de atividade.
     */
    calculateScore: (group: Group): number => {
        const memberCount = group.memberIds?.length || 0;
        const now = Date.now();
        const lastActivity = group.timestamp || 0;
        
        // Bônus de "Trending": se o grupo teve atividade nas últimas 24h, ganha um boost no score
        const isTrending = (now - lastActivity) < 86400000;
        const trendingBonus = isTrending ? 500 : 0;

        return (memberCount * 100) + trendingBonus;
    },

    /**
     * Retorna a lista filtrada e ordenada para uma aba específica.
     */
    getRankedList: (category: 'public' | 'private' | 'vip'): Group[] => {
        const allGroups = db.groups.getAll();
        
        const filtered = allGroups.filter(g => {
            if (category === 'vip') return g.isVip;
            if (category === 'private') return g.isPrivate && !g.isVip;
            return !g.isPrivate && !g.isVip;
        });

        return filtered.sort((a, b) => {
            return RankingService.calculateScore(b) - RankingService.calculateScore(a);
        });
    }
};
