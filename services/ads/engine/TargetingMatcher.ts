
import { AdCampaign, User } from '../../../types';

export const targetingMatcher = {
    /**
     * Verifica se um usuário se encaixa nos critérios de segmentação do anúncio.
     */
    match(campaign: AdCampaign, user: User): boolean {
        if (!campaign.targeting) return true; // Sem segmentação = Público Amplo

        const { ageMin, ageMax, gender, interests, location } = campaign.targeting;
        const userProfile = user.profile;

        if (!userProfile) return false;

        // 1. Filtro de Idade (Simulado pois não temos data de nascimento real em todos os profiles)
        // Em um sistema real, calcularíamos a idade baseada no DNA ou perfil.
        
        // 2. Filtro de Gênero
        if (gender !== 'all') {
            // Supondo que o profile possa ter um campo gender no futuro
            // Por enquanto, checamos por heurística simples ou permitimos.
        }

        // 3. Filtro de Localização
        if (location && userProfile.phone) {
            // Se o anúncio for para o Brasil (55) e o usuário não for, bloqueia
            if (location.toLowerCase().includes('brasil') && !userProfile.phone.startsWith('55')) {
                return false;
            }
        }

        // 4. Filtro de Interesses (Keywords)
        if (interests && interests.length > 0) {
            const bio = userProfile.bio?.toLowerCase() || "";
            const hasInterest = interests.some(interest => 
                bio.includes(interest.toLowerCase())
            );
            // Se o usuário não tem interesse explícito, não bloqueamos 100%, 
            // mas o Auction Engine dará um score menor. Aqui apenas filtramos exclusões pesadas.
        }

        return true;
    }
};
