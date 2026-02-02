
import { AdCampaign } from '../../types';
import { AdCampaignManager } from './ads/AdCampaignManager';
import { AdAuctionEngine } from './ads/AdAuctionEngine';

/**
 * RealAdService atua como a Fachada (Facade) para o sistema de anúncios,
 * coordenando a gestão de campanhas e o motor de leilão.
 */
export const adService = {
    // Gestão e CRUD
    createCampaign: AdCampaignManager.createCampaign,
    // Fix: Added updateCampaignStatus to the facade to resolve missing property error in store components
    updateCampaignStatus: AdCampaignManager.updateCampaignStatus,
    // Fix: Added updateCampaign to allow creative editing
    updateCampaign: AdCampaignManager.updateCampaign,
    // Fix: Added missing addBudget method to the facade to support adding balance to active campaigns
    addBudget: AdCampaignManager.addBudget,
    getCampaignPerformance: AdCampaignManager.getCampaignPerformance,
    getMyCampaigns: AdCampaignManager.getMyCampaigns,
    getCampaignById: AdCampaignManager.getCampaignById,
    deleteCampaign: AdCampaignManager.deleteCampaign,
    trackMetric: AdCampaignManager.trackMetric,

    // Inteligência de Entrega
    getWinningAd: (placement: 'feed' | 'reels' | 'marketplace') => AdAuctionEngine.getWinningAd(placement),
    getAdsForPlacement: (placement: 'feed' | 'reels' | 'marketplace') => AdAuctionEngine.getAdsForPlacement(placement)
};
