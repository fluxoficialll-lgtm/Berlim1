
import { AdCampaign, User } from '../../../types';
import { AwarenessStrategy } from '../strategies/AwarenessStrategy';
import { TrafficStrategy } from '../strategies/TrafficStrategy';
import { SalesStrategy } from '../strategies/SalesStrategy';
import { EngagementStrategy } from '../strategies/EngagementStrategy';
import { LeadsStrategy } from '../strategies/LeadsStrategy';
import { AppPromotionStrategy } from '../strategies/AppPromotionStrategy';
import { IAdStrategy } from '../strategies/BaseStrategy';
import { GoogleGenAI } from "@google/genai";

const strategies: Record<string, IAdStrategy> = {
    'awareness': AwarenessStrategy,
    'traffic': TrafficStrategy,
    'sales': SalesStrategy,
    'engagement': EngagementStrategy,
    'leads': LeadsStrategy,
    'app_promotion': AppPromotionStrategy,
    'default': TrafficStrategy
};

export const adAlgorithmEngine = {
    /**
     * O cérebro do sistema: Decide se deve mostrar um anúncio para o usuário.
     */
    async rankCampaignForUser(campaign: AdCampaign, user: User): Promise<number> {
        const strategy = strategies[campaign.campaignObjective] || strategies.default;
        
        // 1. Cálculo Base da Estratégia (Modular)
        let finalScore = strategy.calculateScore(campaign, user);

        // 2. Ajuste de Lance Dinâmico
        const adjustedBid = strategy.adjustBid(campaign.budget, user);
        finalScore = finalScore * (adjustedBid / 10);

        // 3. Inteligência Artificial (Gemini) - Precisão Semântica
        try {
            const aiScore = await this.getAIPrediction(campaign.creative.text, user.profile?.bio || "");
            finalScore = finalScore * (aiScore / 10); 
        } catch (e) {
            // Se a IA falhar, o score não é penalizado
        }

        return finalScore;
    },

    async getAIPrediction(adText: string, userBio: string): Promise<number> {
        if (!process.env.API_KEY) return 10;
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Analise a compatibilidade entre este anúncio: "${adText}" e o interesse deste usuário: "${userBio}". Responda apenas um número de 1 a 10 sendo 10 compatibilidade total.`,
        });
        
        const score = parseInt(response.text?.trim() || "5");
        return isNaN(score) ? 5 : score;
    }
};
