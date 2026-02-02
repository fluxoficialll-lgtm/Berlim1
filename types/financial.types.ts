export interface PaymentProviderConfig {
    providerId: string;
    clientId?: string; 
    clientSecret?: string;
    token?: string;
    isConnected: boolean;
    tokenExpiresAt?: number; 
}

export interface SyncPayTransaction {
    identifier: string;
    pixCode: string;
    amount: number;
    status: 'pending' | 'paid' | 'expired' | 'completed' | 'withdrawal';
    buyerId: string;
    sellerId: string;
    groupId: string;
    platformFee: number;
    ownerNet: number;
    timestamp: number;
    pixKey?: string;
}

export interface VipAccess {
    userId: string;
    groupId: string;
    status: 'active' | 'expired';
    purchaseDate: number;
    expiresAt?: number;
    transactionId: string;
}

export interface AffiliateSale {
    id: string;
    buyerId: string;
    buyerEmail: string;
    amount: number;
    commission: number;
    timestamp: number;
    sellerName: string;
}

export interface AffiliateStats {
    totalEarned: number;
    totalInvoiced: number;
    referredSellers: ReferredSeller[];
    recentSales: AffiliateSale[];
}

export interface ReferredSeller {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    salesCount: number;
    totalGenerated: number;
}

export interface MarketingConfig {
    pixelId?: string;
    pixelToken?: string;
}

export interface NotificationSettings {
    pauseAll: boolean;
    likes: boolean;
    comments: boolean;
    followers: boolean;
    mentions: boolean;
    messages: boolean;
    groups: boolean;
    marketplace: boolean;
    emailUpdates: boolean;
    emailDigest: boolean;
}

export interface SecuritySettings {
    saveLoginInfo: boolean;
}
