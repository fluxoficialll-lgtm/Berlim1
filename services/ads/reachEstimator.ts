
import { AdCampaign } from '../../types';

export const reachEstimator = {
    /**
     * Calcula o alcance estimado (pessoas/dia)
     */
    estimate(campaign: Partial<AdCampaign>): { min: number; max: number; status: 'narrow' | 'ideal' | 'broad' } {
        const budget = Number(campaign.budget || 10);
        const targeting = campaign.targeting;
        
        // Base de alcance por Real (Simulação baseada em CPM médio de R$ 10,00)
        let baseReach = budget * 100; 

        if (!targeting) return { min: baseReach, max: baseReach * 2.5, status: 'broad' };

        let multiplier = 1.0;

        // 1. Impacto da Idade (Públicos mais amplos convertem menos mas alcançam mais)
        const ageRange = targeting.ageMax - targeting.ageMin;
        multiplier *= (ageRange / 30);

        // 2. Impacto da Localização
        if (targeting.locations && targeting.locations.length > 0) {
            const avgRadius = targeting.locations.reduce((acc, l) => acc + l.radius, 0) / targeting.locations.length;
            multiplier *= (avgRadius / 50); // Referência 50km
        } else {
            multiplier *= 5.0; // Global
        }

        // 3. Impacto de Interesses (Quanto mais interesses, mais específico = menos alcance bruto, mais qualidade)
        const interestCount = targeting.interests?.length || 0;
        if (interestCount > 0) {
            multiplier *= Math.max(0.2, 1 - (interestCount * 0.05));
        }

        const estimated = baseReach * multiplier;
        
        // Determinar status do ponteiro
        let status: 'narrow' | 'ideal' | 'broad' = 'ideal';
        if (multiplier < 0.4) status = 'narrow';
        else if (multiplier > 3.0) status = 'broad';

        return {
            min: Math.round(estimated * 0.7),
            max: Math.round(estimated * 1.3),
            status
        };
    }
};
