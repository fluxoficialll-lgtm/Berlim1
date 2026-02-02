
import { IAdStrategy } from './BaseStrategy';
import { AdCampaign, User } from '../../../types';

export const AwarenessStrategy: IAdStrategy = {
    objective: 'awareness',
    calculateScore(campaign, targetUser) {
        let score = 1000;
        // Prioriza usuários que NÃO viram o anúncio recentemente (Frequência 1)
        const hasSeen = campaign.stats?.views || 0;
        if (hasSeen === 0) score += 500;
        
        // Relevância demográfica básica
        if (campaign.targeting?.location && targetUser.profile?.phone?.startsWith('55')) {
            score += 100;
        }
        
        return score;
    },
    adjustBid(baseBid) {
        // No awareness, queremos volume barato
        return baseBid * 0.8;
    }
};
