
import { AdCampaign } from '../../../types';

// Valores de custo simulados para cálculo de consumo de saldo
const CPM_BASE_COST = 10.00; // Custo por 1.000 visualizações
const CPC_BASE_COST = 0.50;  // Custo por clique

export const budgetManager = {
    /**
     * Calcula o gasto estimado da campanha baseado nas métricas atuais.
     */
    getEstimatedSpend(campaign: AdCampaign): number {
        if (campaign.pricingModel === 'commission') return 0;
        
        const views = campaign.stats?.views || 0;
        const clicks = campaign.stats?.clicks || 0;
        
        const viewCost = (views / 1000) * CPM_BASE_COST;
        const clickCost = clicks * CPC_BASE_COST;
        
        return viewCost + clickCost;
    },

    /**
     * Verifica se a campanha ainda possui saldo disponível para exibição.
     */
    hasAvailableBudget(campaign: AdCampaign): boolean {
        if (campaign.pricingModel === 'commission') return true;
        
        const spend = this.getEstimatedSpend(campaign);
        return spend < campaign.budget;
    },

    /**
     * Retorna a porcentagem de orçamento consumida.
     */
    getSpendPercentage(campaign: AdCampaign): number {
        if (campaign.pricingModel === 'commission') return 0;
        if (campaign.budget === 0) return 100;
        
        return (this.getEstimatedSpend(campaign) / campaign.budget) * 100;
    }
};
