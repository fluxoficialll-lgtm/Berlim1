
import { AdCampaign } from '../../../types';
import { budgetManager } from '../engine/BudgetManager';

export const CausalityGuard = {
  /**
   * Verifica se a campanha está sofrendo de "Saturação de Escala".
   * Se o gasto subiu mas a taxa de conversão caiu drasticamente, retornamos um fator de correção.
   */
  getScaleElasticity(campaign: AdCampaign): number {
    const stats = campaign.stats;
    if (!stats || stats.views < 5000) return 1.0; // Dados insuficientes para análise de curva

    const ctr = (stats.clicks + 1) / (stats.views + 100);
    const convRate = (stats.conversions + 1) / (stats.clicks + 10);
    
    // Se o orçamento é alto mas o CTR ou ConvRate estão 30% abaixo da média histórica da conta
    // (Simulamos aqui com valores base de referência de mercado)
    const benchmarkConvRate = 0.02; // 2% 
    
    if (convRate < benchmarkConvRate * 0.7 && campaign.budget > 100) {
      // Aplica um "Freio de Causalidade": Reduz a prioridade no leilão para forçar 
      // o anunciante a revisar o criativo ou o público antes de gastar mais.
      return 0.5; 
    }

    return 1.0;
  }
};
