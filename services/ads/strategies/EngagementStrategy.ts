
import { IAdStrategy } from './BaseStrategy';
import { AdCampaign, User } from '../../../types';

export const EngagementStrategy: IAdStrategy = {
    objective: 'engagement',
    calculateScore(campaign, targetUser) {
        let score = 1000;

        // 1. Boost para usuários engajadores
        // Se o usuário tem histórico de interações (simulado por lastSeen recente)
        if (targetUser.lastSeen && (Date.now() - targetUser.lastSeen < 3600000)) {
            score += 800; // Boost de 80% para usuários ativos agora
        }

        // 2. Afinidade por Conteúdo
        // Se o criativo for curto (mais fácil de engajar), aumenta o score
        if (campaign.creative.text.length < 150) {
            score += 300;
        }

        return score;
    },
    adjustBid(baseBid) {
        // Engajamento é barato, mantemos o lance padrão
        return baseBid * 1.0;
    }
};
