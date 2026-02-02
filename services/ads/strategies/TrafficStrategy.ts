
import { IAdStrategy } from './BaseStrategy';
import { AdCampaign, User } from '../../../types';

export const TrafficStrategy: IAdStrategy = {
    objective: 'traffic',
    calculateScore(campaign, targetUser) {
        let score = 1000;
        
        // Prioriza usuários com alto histórico de cliques em posts similares
        // Simulando análise de comportamento
        const userInterests = targetUser.profile?.bio?.toLowerCase() || "";
        const adKeywords = campaign.creative.text.toLowerCase().split(' ');
        
        adKeywords.forEach(word => {
            if (word.length > 3 && userInterests.includes(word)) {
                score += 200; // Match de interesse
            }
        });

        return score;
    },
    adjustBid(baseBid, targetUser) {
        // Se o usuário tem alto CTR histórico, vale a pena pagar um pouco mais pelo clique
        return baseBid * 1.2;
    }
};
