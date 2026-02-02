
import { AdCampaign, User } from '../../../types';
import { targetingMatcher } from './TargetingMatcher';
import { budgetManager } from './BudgetManager';
import { adPacingService } from './AdPacingService';
import { IntentPredictor } from '../intelligence/IntentPredictor';
import { PacingController } from '../intelligence/PacingController';
import { ConversionHub } from '../attribution/ConversionHub';
import { CausalityGuard } from '../intelligence/CausalityGuard';
import { FeedbackOptimizer } from '../intelligence/FeedbackOptimizer';

export const adAuctionEngine = {
    /**
     * Realiza um leilão de ultra-precisão.
     * Agora integra: Pacing, Intenção IA, Atribuição, Trava de ROAS e Feedback Loop.
     */
    async runAuction(campaigns: AdCampaign[], user: User): Promise<AdCampaign | null> {
        const eligibleCampaigns = campaigns.filter(camp => 
            camp.status === 'active' &&
            targetingMatcher.match(camp, user) &&
            budgetManager.hasAvailableBudget(camp) &&
            adPacingService.shouldShow(camp)
        );

        if (eligibleCampaigns.length === 0) return null;

        const throttleChance = Math.random();

        const scoredCampaigns = await Promise.all(eligibleCampaigns.map(async camp => {
            // 1. Pacing & Throttling
            const pacingFactor = PacingController.getThrottleFactor(camp);
            if (throttleChance > pacingFactor) return { campaign: camp, finalScore: -1 };

            // 2. Trava de Segurança ROAS (Causalidade) - NOVO ✅
            const causalityFactor = CausalityGuard.getScaleElasticity(camp);
            if (causalityFactor < 0.6 && throttleChance > 0.3) return { campaign: camp, finalScore: -1 };

            // 3. Base Score (Bid + CTR)
            const baseScore = this.calculateBaseScore(camp, user);
            
            // 4. Inteligência de Intenção (Gemini)
            const intentScore = await IntentPredictor.predictImpulseProbability(user, camp);
            
            // 5. Aprendizado Automático (Feedback Loop) - NOVO ✅
            const feedbackMultiplier = FeedbackOptimizer.getHeuristicMultiplier(camp.creative.text);

            // 6. Bônus de Retargeting
            const isRetargeting = ConversionHub.getAttributedCampaigns().includes(camp.id);
            const retargetingBonus = isRetargeting ? 2.5 : 1.0;

            return {
                campaign: camp,
                finalScore: baseScore * intentScore * feedbackMultiplier * causalityFactor * retargetingBonus
            };
        }));

        const winner = scoredCampaigns
            .filter(s => s.finalScore > 0)
            .sort((a, b) => b.finalScore - a.finalScore)[0];
        
        return winner ? winner.campaign : null;
    },

    calculateBaseScore(campaign: AdCampaign, user: User): number {
        const bid = campaign.budget || 1;
        const stats = campaign.stats || { views: 1, clicks: 0 };
        const ctr = (stats.clicks + 1) / (stats.views + 100);
        const modelBonus = campaign.pricingModel === 'commission' ? 3.0 : 1.0;

        return bid * ctr * modelBonus;
    }
};
