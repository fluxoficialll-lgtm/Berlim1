
import { IAdStrategy } from './BaseStrategy';
import { AdCampaign, User } from '../../../types';

export const AppPromotionStrategy: IAdStrategy = {
    objective: 'app_promotion',
    calculateScore(campaign, targetUser) {
        let score = 1000;

        // 1. Detecção de Plataforma (Crítico para App)
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobile = /iphone|ipad|ipod|android/.test(userAgent);

        if (isMobile) {
            score += 5000; // Boost massivo para mobile. Não queremos mostrar no Desktop.
        } else {
            score -= 5000; // Penaliza severamente visualizações em PC
        }

        // 2. Frequência Negativa
        // Se a campanha já tem muitos cliques, reduz o score para novos usuários
        const currentClicks = campaign.stats?.clicks || 0;
        if (currentClicks > 500) {
            score -= 200;
        }

        return score;
    },
    adjustBid(baseBid) {
        // Custo por instalação (CPI) costuma ser mais alto que CPC
        return baseBid * 1.3;
    }
};
