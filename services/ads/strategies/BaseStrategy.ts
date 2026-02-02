
import { AdCampaign, User } from '../../../types';

export interface IAdStrategy {
    objective: string;
    /**
     * Calcula o score de relevância entre um anúncio e um usuário específico.
     * Quanto maior o score, maior a chance de exibição.
     */
    calculateScore(campaign: AdCampaign, targetUser: User): number;
    
    /**
     * Ajusta o valor do lance baseado na probabilidade de sucesso do objetivo.
     */
    adjustBid(baseBid: number, targetUser: User): number;
}
