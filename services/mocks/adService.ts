
import { AdCampaign } from '../../types';
import { db } from '../../database';
import { authService } from '../authService';
import { MOCK_CAMPAIGNS } from '../../mocks';

export const adService = {
    createCampaign: async (campaign: AdCampaign) => {
        db.ads.add({ 
            ...campaign, 
            id: campaign.id || Date.now().toString(), 
            // Mock inicia como 'pending' para simular a necessidade de pagamento inicial
            status: campaign.status || 'pending', 
            timestamp: Date.now() 
        });
        return true;
    },

    updateCampaignStatus: async (id: string, status: AdCampaign['status']) => {
        const ad = adService.getCampaignById(id);
        if (ad) {
            ad.status = status;
            db.ads.update(ad);
            return true;
        }
        return false;
    },

    updateCampaign: async (id: string, updates: Partial<AdCampaign>) => {
        const ad = adService.getCampaignById(id);
        if (ad) {
            const updated = { ...ad, ...updates };
            db.ads.update(updated);
            return true;
        }
        return false;
    },

    addBudget: async (id: string, amount: number) => {
        const ad = adService.getCampaignById(id);
        if (ad) {
            ad.budget = (Number(ad.budget) || 0) + amount;
            db.ads.update(ad);
            return true;
        }
        return false;
    },

    getMyCampaigns: () => {
        const user = authService.getCurrentUser();
        if (!user) return [];
        
        const all = db.ads.getAll();
        const isDefaultMockUser = user.email.includes('test.com') || user.id.startsWith('u-mock');

        if (all.length === 0 && isDefaultMockUser) {
            return MOCK_CAMPAIGNS;
        }

        return all.filter(a => 
            a.ownerId === user.id || 
            a.ownerEmail === user.email ||
            (isDefaultMockUser && a.ownerId === 'u-creator-002')
        ).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    },

    getCampaignById: (id: string): AdCampaign | undefined => {
        return db.ads.getAll().find(ad => ad.id === id) || MOCK_CAMPAIGNS.find(ad => ad.id === id);
    },

    getCampaignPerformance: async (id: string): Promise<any> => {
        await new Promise(resolve => setTimeout(resolve, 800));

        const selectedCamp = adService.getCampaignById(id) || MOCK_CAMPAIGNS[0];

        const seed = id ? id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 42;
        const rnd = (min: number, max: number, offset = 0) => {
            const x = Math.sin(seed + offset) * 10000;
            return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
        };

        const baseVolume = selectedCamp.stats?.views || rnd(5000, 25000, 1);
        const impressions = Math.round(baseVolume * (1 + (rnd(5, 40, 2) / 100)));
        const clicks = selectedCamp.stats?.clicks || Math.round(impressions * (rnd(15, 65, 3) / 1000));
        const conversions = selectedCamp.stats?.conversions || Math.round(clicks * (rnd(20, 120, 4) / 1000));
        const reach = Math.round(impressions / (1 + (rnd(1, 8, 5) / 10)));
        
        const totalBudget = selectedCamp.budget || 500;
        const spent = selectedCamp.pricingModel === 'commission' ? 0 : Math.min(totalBudget, (totalBudget * (rnd(10, 90, 32) / 100)));

        return {
            delivery: {
                impressions,
                reach,
                frequency: (impressions / reach).toFixed(2),
                cpm: rnd(8, 25, 6) + (rnd(0, 99, 7) / 100)
            },
            click: {
                clicks,
                ctr: (clicks / impressions) * 100,
                cpc: rnd(0, 2, 8) + (rnd(10, 90, 9) / 100),
                engagement: rnd(2, 8, 10) + (rnd(0, 9, 11) / 10)
            },
            conversion: {
                conversions,
                conversionRate: clicks > 0 ? (conversions / clicks) * 100 : 0,
                cpa: conversions > 0 ? (rnd(10, 50, 12) / conversions) : 0,
                conversionValue: conversions * (rnd(29, 199, 13) + 0.90)
            },
            financial: {
                totalBudget,
                spent,
                roas: rnd(2, 12, 14) + (rnd(0, 9, 15) / 10),
                roi: rnd(150, 800, 16),
                avgTicket: rnd(30, 150, 17) + 0.90,
                ltv: rnd(100, 500, 18) + 0.50
            },
            audience: {
                segmentation: rnd(0, 1, 19) ? 'Homens, 18-34' : 'Mulheres, 25-45',
                overlap: rnd(5, 25, 20),
                retention: rnd(40, 85, 21),
                saturation: rnd(0, 1, 22) ? 'Saudável' : 'Estável'
            },
            creative: {
                viewTime: `${rnd(5, 45, 23)}s`,
                completionRate: rnd(15, 60, 24),
                rejectionRate: rnd(2, 15, 25),
                score: (rnd(60, 95, 26) / 10).toFixed(1)
            },
            funnel: {
                costPerView: rnd(1, 10, 27) / 100,
                costPerClick: rnd(20, 150, 28) / 100,
                dropOff: rnd(10, 40, 29),
                speed: `${rnd(1, 5, 30)} dias`
            },
            system: {
                precision: 99.8,
                matchRate: 94.2,
                latency: rnd(80, 300, 31)
            }
        };
    },

    deleteCampaign: async (id: string) => db.ads.delete(id),
    getAdsForPlacement: (placement: string) => {
        const all = db.ads.getAll();
        const active = all.filter(ad => 
            ad.status === 'active' && 
            ad.placements?.includes(placement as any)
        );
        if (active.length === 0) return MOCK_CAMPAIGNS.filter(c => c.placements.includes(placement as any));
        return active;
    },
    trackMetric: () => {}
};
