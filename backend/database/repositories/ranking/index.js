
import { GroupRankingRepository } from './GroupRankingRepository.js';

/**
 * HUB DE RANKING
 * Centraliza toda a lógica de ordenação de conteúdo da plataforma.
 */
export const RankingHub = {
    async getGroupsByMemberVolume(type, limit) {
        return await GroupRankingRepository.getTopGroups(type, limit);
    }
};
