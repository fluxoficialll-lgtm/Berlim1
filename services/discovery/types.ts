
import { Post, MarketplaceItem, User } from '../../types';

export interface ScoredItem<T> {
    item: T;
    score: number;
}

export type DiscoveryPlacement = 'feed' | 'reels' | 'marketplace';

export interface EngineContext {
    user?: User;
    userEmail?: string;
    latitude?: number;
    longitude?: number;
}
