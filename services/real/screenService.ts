
import { apiClient } from '../apiClient';

export interface BusinessDashboardData {
    stats: {
        totalPosts: number;
        totalReels: number;
        totalProducts: number;
        activeAds: number;
        pendingReports: number;
    };
    financial: {
        totalRevenue: number;
        salesCount: number;
    };
    lists: {
        products: any[];
        campaigns: any[];
    };
}

export interface AdminDashboardData {
    financial: {
        totalGMV: number;
        totalTransactions: number;
        platformNetProfit: number;
        revenueGrowth24h: number;
    };
    users: {
        totalRegistered: number;
        growthLast24h: number;
        bannedCount: number;
    };
    content: {
        totalGroups: number;
        totalPosts: number;
        activeCampaigns: number;
    };
    security: {
        pendingModeration: number;
    };
}

/**
 * ScreenService (BFF Layer)
 * Agora utiliza o túnel de governança do ApiClient.
 */
export const screenService = {
    getMyBusinessData: async (userId: string): Promise<BusinessDashboardData> => {
        return await apiClient.call<BusinessDashboardData>(`/api/screens/my-business?userId=${userId}`);
    },

    getAdminDashboardData: async (): Promise<AdminDashboardData> => {
        const res = await apiClient.call<{ data: AdminDashboardData }>('/api/admin/execute/stats/dashboard');
        return res.data;
    }
};
