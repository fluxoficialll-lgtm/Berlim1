
import { AdCampaign } from '../../../types';

export const PacingController = {
  /**
   * Calcula se devemos permitir o lance baseado no ritmo atual.
   */
  getThrottleFactor(campaign: AdCampaign): number {
    if (campaign.pricingModel === 'commission') return 1.0;

    const hour = new Date().getHours();
    
    // Janelas de Euforia (Horários de pico de conversão mobile no Brasil)
    const euphoriaWindows = [7, 8, 12, 13, 18, 19, 20, 21, 22];
    const isEuphoria = euphoriaWindows.includes(hour);

    // Se estiver fora do pico, reduz a chance de exibição em 40% para preservar orçamento
    if (!isEuphoria) {
      return 0.6;
    }

    return 1.0;
  }
};
