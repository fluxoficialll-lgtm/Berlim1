import { Post, MarketplaceItem, AdCampaign } from '../../../types';
import { db } from '@/database';
import { authService } from '../../authService';
import { adAuctionEngine as InternalEngine } from '../../ads/engine/AdAuctionEngine';
import { AdCampaignManager } from './AdCampaignManager';

export const AdAuctionEngine = {
    async getWinningAd(placement: 'feed' | 'reels' | 'marketplace'): Promise<Post | MarketplaceItem | null> {
        const user = authService.getCurrentUser();
        if (!user) return null;

        const allAds = db.ads.getAll();
        const placementAds = allAds.filter(ad => ad.placements?.includes(placement) && ad.status === 'active');
        
        // Delega a inteligência de leilão (AI/Gemini) para o motor especializado
        const winner = await InternalEngine.runAuction(placementAds, user);
        if (!winner) return null;

        // Registrar impressão automaticamente ao selecionar o vencedor
        AdCampaignManager.trackMetric(winner.id, 'view');

        return this.formatAdForUI(winner, placement);
    },

    getAdsForPlacement(placement: 'feed' | 'reels' | 'marketplace'): (Post | MarketplaceItem)[] {
        const allAds = db.ads.getAll().filter(ad => 
            ad.status === 'active' && ad.placements?.includes(placement)
        );
        
        return allAds.map(ad => this.formatAdForUI(ad, placement));
    },

    /**
     * Helper para converter o objeto de campanha no formato que o componente espera
     * Fix: 'private' modifier cannot be used in object literals. Removing it to resolve compiler error.
     */
    formatAdForUI(ad: AdCampaign, placement: string): Post | MarketplaceItem {
        const username = ad.ownerEmail ? `@${ad.ownerEmail.split('@')[0]}` : '@Patrocinado';
        const ctaLink = ad.destinationType === 'url' ? ad.targetUrl : `/group-landing/${ad.targetGroupId}`;
        const specificCta = ad.placementCtas?.[placement as any] || ad.ctaButton || 'saiba mais';

        if (placement === 'marketplace') {
            return {
                id: `ad_${ad.id}`,
                title: ad.name,
                price: 0,
                category: 'Destaque',
                location: 'Patrocinado',
                description: ad.creative.text,
                image: ad.creative.mediaUrl,
                sellerId: ad.ownerEmail,
                sellerName: username,
                timestamp: Date.now(),
                isAd: true,
                adCampaignId: ad.id,
                ctaText: specificCta,
                ctaLink: ctaLink
            } as MarketplaceItem;
        } else {
            const isVideo = ad.creative.mediaType === 'video';
            return {
                id: `ad_${ad.id}`,
                authorId: ad.ownerId,
                type: placement === 'reels' ? 'video' : (isVideo ? 'video' : 'photo'),
                username: username,
                text: ad.creative.text,
                image: !isVideo ? ad.creative.mediaUrl : undefined,
                video: isVideo ? ad.creative.mediaUrl : undefined,
                time: 'Patrocinado',
                timestamp: Date.now(),
                isPublic: true,
                views: ad.stats?.views || 0,
                likes: 0,
                comments: 0,
                liked: false,
                isAd: true,
                adCampaignId: ad.id,
                ctaText: specificCta,
                ctaLink: ctaLink,
                location: 'Patrocinado'
            } as Post;
        }
    }
};