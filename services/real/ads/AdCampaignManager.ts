
import { AdCampaign } from '../../../types';
import { db } from '@/database';
import { authService } from '../../authService';
import { API_BASE } from '../../../apiConfig';
import { ConversionHub } from '../../ads/attribution/ConversionHub';
import { FeedbackOptimizer } from '../../ads/intelligence/FeedbackOptimizer';

const API_URL = `${API_BASE}/api/ads`;

export const AdCampaignManager = {
    async createCampaign(campaign: AdCampaign) {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) throw new Error("Usuário não autenticado");

        const newCampaign: AdCampaign = {
            ...campaign,
            id: campaign.id || Date.now().toString(),
            ownerId: currentUser.id,
            ownerEmail: currentUser.email,
            // Status padrão agora é 'pending' para exigir pagamento após publicação
            status: campaign.status || 'pending',
            timestamp: Date.now(),
            pricingModel: campaign.pricingModel || 'budget',
            stats: { views: 0, clicks: 0, conversions: 0 }
        };
        
        try {
            await fetch(`${API_URL}/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCampaign)
            });
        } catch (e) { 
            console.error("Failed to create ad on server", e); 
        }

        db.ads.add(newCampaign);
        return true;
    },

    async updateCampaignStatus(id: string, status: AdCampaign['status']) {
        const ad = this.getCampaignById(id);
        if (ad) {
            ad.status = status;
            db.ads.update(ad);
            try {
                await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status })
                });
            } catch (e) {
                console.warn("Failed to sync status update to server");
            }
            return true;
        }
        return false;
    },

    async updateCampaign(id: string, updates: Partial<AdCampaign>) {
        const ad = this.getCampaignById(id);
        if (ad) {
            const updated = { ...ad, ...updates };
            db.ads.update(updated);
            try {
                await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updates)
                });
            } catch (e) {
                console.warn("Failed to sync campaign update to server");
            }
            return true;
        }
        return false;
    },

    async addBudget(id: string, amount: number) {
        const ad = this.getCampaignById(id);
        if (ad) {
            // Ao adicionar orçamento, a campanha volta a ter saldo e pode ser reativada
            const newBudget = (Number(ad.budget) || 0) + amount;
            ad.budget = newBudget;
            db.ads.update(ad);
            try {
                await fetch(`${API_URL}/${id}/top-up`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount })
                });
            } catch (e) {
                console.warn("Failed to sync budget top-up to server");
            }
            return true;
        }
        return false;
    },

    async getCampaignPerformance(id: string): Promise<any> {
        try {
            const response = await fetch(`${API_URL}/${id}/performance`);
            if (response.ok) {
                const data = await response.json();
                return data.metrics;
            }
        } catch (e) { 
            console.error("Error fetching real performance", e); 
        }
        return null;
    },

    getMyCampaigns(): AdCampaign[] {
        const user = authService.getCurrentUser();
        if (!user) return [];
        return db.ads.getAll().filter(ad => 
            ad.ownerId === user.id || ad.ownerEmail === user.email
        ).sort((a, b) => b.timestamp - a.timestamp);
    },

    getCampaignById(id: string): AdCampaign | undefined {
        return db.ads.getAll().find(ad => ad.id === id);
    },

    async deleteCampaign(id: string) {
        db.ads.delete(id);
        try { 
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' }); 
        } catch (e) {
            console.error("Server delete failed", e);
        }
    },

    async trackMetric(campaignId: string, type: 'view' | 'click' | 'conversion', value = 0) {
        const user = authService.getCurrentUser();
        
        if (type === 'click' || type === 'view') {
            ConversionHub.recordTouchpoint(campaignId, campaignId, type);
        }

        if (type === 'conversion' && user) {
            FeedbackOptimizer.recordSuccess(campaignId, user.id);
        }

        const ad = db.ads.getAll().find(a => a.id === campaignId);
        if (ad) {
            if (!ad.stats) ad.stats = { views: 0, clicks: 0, conversions: 0 };
            if (type === 'view') ad.stats.views++;
            if (type === 'click') ad.stats.clicks++;
            if (type === 'conversion') ad.stats.conversions++;
            db.ads.update(ad);
        }

        try {
            await fetch(`${API_URL}/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adId: campaignId,
                    userId: user?.id,
                    type,
                    value,
                    metadata: {
                        ua: navigator.userAgent,
                        ts: Date.now(),
                        attributedTrail: type === 'conversion' ? ConversionHub.getAttributedCampaigns() : undefined
                    }
                })
            });
        } catch (e) {
            console.warn("Analytics track failed");
        }
    }
};
