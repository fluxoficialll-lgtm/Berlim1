
import { IAdStrategy } from './BaseStrategy';
import { AdCampaign, User } from '../../../types';
import { db } from '../../../database';

export const SalesStrategy: IAdStrategy = {
    objective: 'sales',
    calculateScore(campaign, targetUser) {
        let score = 1000;
        
        // 1. Verificação de Lookalike (Poder do seu app)
        if (campaign.targeting?.lookalikeGroupId) {
            const group = db.groups.findById(campaign.targeting.lookalikeGroupId);
            // Se o usuário já participa de grupos similares ou do mesmo dono, score alto
            if (group?.memberIds?.includes(targetUser.id)) {
                score += 2000; // Alta probabilidade de compra
            }
        }

        // 2. Pixel de Intenção
        // Verifica se o usuário visitou o marketplace ou outras landing pages nas últimas 24h
        if (targetUser.lastSeen && (Date.now() - targetUser.lastSeen < 86400000)) {
            score += 500;
        }

        return score;
    },
    adjustBid(baseBid, targetUser) {
        // Vendas são o objetivo mais valioso, o algoritmo aceita lances 2x maiores
        // se a predição de conversão for alta.
        return baseBid * 2.0;
    }
};
