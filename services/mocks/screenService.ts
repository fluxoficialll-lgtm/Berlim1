import { BusinessDashboardData } from '../real/screenService';
import { db } from '../../database';
import { authService } from '../authService';
import { MOCK_PRODUCTS, MOCK_CAMPAIGNS } from '../../mocks';

export const MockScreenService = {
    getMyBusinessData: async (userId: string): Promise<BusinessDashboardData> => {
        // Simula delay de rede para UX
        await new Promise(resolve => setTimeout(resolve, 600));

        const user = authService.getCurrentUser();
        if (!user) throw new Error("Usuário não autenticado");

        // No modo Mock, queremos que o usuário veja os dados de exemplo 
        // mesmo que o ID dele seja gerado randomicamente no login de teste.
        const isDefaultMockUser = user.email.includes('test.com') || user.id.startsWith('u-mock');

        const allPosts = db.posts.getAll();
        const userPosts = allPosts.filter(p => p.authorId === userId || (isDefaultMockUser && p.authorId === 'u-creator-002'));
        
        const allProducts = db.marketplace.getAll();
        // Se for o usuário de teste, mostramos os produtos do "Eduardo MKT" (u-creator-002)
        const userProducts = allProducts.length > 0 
            ? allProducts.filter(p => p.sellerId === userId || p.sellerId === user.email || (isDefaultMockUser && p.sellerId === 'u-creator-002'))
            : (isDefaultMockUser ? MOCK_PRODUCTS : []);

        const allAds = db.ads.getAll();
        const userAds = allAds.length > 0
            ? allAds.filter(a => a.ownerId === userId || a.ownerEmail === user.email || (isDefaultMockUser && a.ownerId === 'u-creator-002'))
            : (isDefaultMockUser ? MOCK_CAMPAIGNS : []);

        const activeAdsCount = userAds.filter(a => a.status === 'active').length;

        return {
            stats: {
                totalPosts: userPosts.filter(p => p.type !== 'video').length,
                totalReels: userPosts.filter(p => p.type === 'video').length,
                totalProducts: userProducts.length,
                activeAds: userAds.length, // Mostra o total de campanhas (ativas + rascunhos)
                pendingReports: 0
            },
            financial: {
                totalRevenue: 1250.75,
                salesCount: 14
            },
            lists: {
                products: userProducts,
                campaigns: userAds
            }
        };
    },

    getAdminDashboardData: async () => {
        return {
            financial: {
                totalGMV: 50000,
                totalTransactions: 1200,
                platformNetProfit: 5000,
                revenueGrowth24h: 1500
            },
            users: {
                totalRegistered: 5000,
                growthLast24h: 45,
                bannedCount: 12
            },
            content: {
                totalGroups: 150,
                totalPosts: 12000,
                activeCampaigns: 85
            },
            security: {
                pendingModeration: 3
            }
        };
    }
};