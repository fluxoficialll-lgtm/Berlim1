
import { AdCampaign } from '../../../types';
import { budgetManager } from './BudgetManager';

export const adPacingService = {
    /**
     * Determina se o anúncio deve ser exibido agora para evitar que o orçamento acabe rápido demais.
     * Implementa um algoritmo de "Probabilistic Throttling".
     */
    shouldShow(campaign: AdCampaign): boolean {
        if (campaign.pricingModel === 'commission') return true;
        if (campaign.scheduleType === 'continuous') return true;

        const now = new Date();
        const hoursPassed = now.getHours() + (now.getMinutes() / 60);
        const dayPercentage = hoursPassed / 24;
        
        const spendPercentage = budgetManager.getSpendPercentage(campaign) / 100;

        // Se gastou 80% do orçamento e ainda é 10 da manhã, o ritmo está agressivo.
        // Reduzimos a chance de exibição para "esticar" o saldo até o fim do dia.
        if (spendPercentage > dayPercentage + 0.1) {
            const throttleChance = Math.max(0.1, 1 - (spendPercentage - dayPercentage));
            return Math.random() < throttleChance;
        }

        return true;
    }
};
