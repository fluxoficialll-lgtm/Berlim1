
import { MarketplaceItem } from '../../../types';
import { db } from '../../../database';
import { EngineContext } from '../types';

export class MarketEngine {
    private static WEIGHTS = {
        GEO_PROXIMITY: 8000,
        TRUST_SCORE: 2000,
        SALES_VOLUME: 500
    };

    public static rank(items: MarketplaceItem[], context: EngineContext): MarketplaceItem[] {
        const scored = items.map(item => {
            let score = 2000;

            // 1. Geolocalização (Ponto crucial do Marketplace)
            if (context.user?.profile?.phone?.startsWith('55') && item.location.includes('Brasil')) {
                score += this.WEIGHTS.GEO_PROXIMITY;
            }

            // 2. Trust Score do Vendedor
            const seller = db.users.get(item.sellerId);
            if (seller?.trustScore) {
                score += (seller.trustScore * 2);
            }

            // 3. Prova Social (Volume de Vendas)
            score += (Number(item.soldCount || 0) * this.WEIGHTS.SALES_VOLUME);

            // 4. Anúncios (Ads ganham prioridade máxima no mercado)
            if (item.isAd) score += 15000;

            return { item, score };
        });

        return scored.sort((a, b) => b.score - a.score).map(s => s.item);
    }
}
