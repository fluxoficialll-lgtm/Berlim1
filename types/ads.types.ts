
export interface AdCampaign {
    id: string;
    ownerId: string;
    ownerEmail: string;
    name: string;
    scheduleType: 'continuous' | 'date' | 'period';
    startDate?: number;
    endDate?: number;
    scheduleConfig?: {
        days: number[]; // 0-6 (Sun-Sat)
        hours: { start: string; end: string }[];
    };
    budget: number;
    trafficObjective: string;
    pricingModel?: 'budget' | 'commission';
    creative: {
        text: string;
        mediaUrl?: string;
        mediaType?: 'image' | 'video';
    };
    // Novos campos para criativos específicos
    placementCreatives?: {
        feed?: { mediaUrl?: string; mediaType?: 'image' | 'video' };
        reels?: { mediaUrl?: string; mediaType?: 'image' | 'video' };
        marketplace?: { mediaUrl?: string; mediaType?: 'image' | 'video' };
    };
    campaignObjective: string;
    destinationType: string;
    targetUrl?: string;
    targetGroupId?: string;
    optimizationGoal: string;
    placements: ('feed' | 'reels' | 'marketplace')[];
    ctaButton: string; 
    placementCtas?: {
        feed?: string;
        reels?: string;
        marketplace?: string;
    };
    targeting?: {
        ageMin: number;
        ageMax: number;
        gender: 'all' | 'male' | 'female';
        interests: string[];
        location?: string; 
        radius?: number; 
        locations?: TargetedLocation[];
        lookalikeGroupId?: string;
    };
    status: 'draft' | 'active' | 'paused' | 'ended' | 'pending';
    timestamp: number;
    stats?: AdStats;
}

export interface TargetedLocation {
    id: string;
    name: string;
    radius: number;
    lat?: number;
    lon?: number;
}

export interface AdStats {
    views: number;
    clicks: number;
    conversions: number;
}
