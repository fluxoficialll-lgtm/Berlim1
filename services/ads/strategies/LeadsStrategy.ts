
import { IAdStrategy } from './BaseStrategy';
import { AdCampaign, User } from '../../../types';

export const LeadsStrategy: IAdStrategy = {
    objective: 'leads',
    calculateScore(campaign, targetUser) {
        let score = 1000;

        // 1. Filtro de Qualidade: Prioriza perfis reais e completos
        if (targetUser.isProfileCompleted) {
            score += 1500; // Leads precisam de pessoas com perfil pronto
        }

        // 2. Intenção de Contato
        // Se o usuário tem bio preenchida, ele é mais propenso a se interessar por ofertas
        if (targetUser.profile?.bio && targetUser.profile.bio.length > 20) {
            score += 500;
        }

        // 3. Verificação de Verificação
        if (targetUser.isVerified) {
            score += 1000; // Boost enorme para usuários com e-mail validado
        }

        return score;
    },
    adjustBid(baseBid) {
        // Leads são valiosos, aceitamos pagar 50% a mais no leilão
        return baseBid * 1.5;
    }
};
