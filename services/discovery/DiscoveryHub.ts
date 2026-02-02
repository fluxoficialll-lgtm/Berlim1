
import { Post, MarketplaceItem, User } from '../../types';
import { FeedEngine } from './engines/FeedEngine';
import { ReelsEngine } from './engines/ReelsEngine';
import { MarketEngine } from './engines/MarketEngine';
import { EngineContext } from './types';
import { authService } from '../authService';

export const DiscoveryHub = {
    // Fix: Removed async as FeedEngine.rank is synchronous
    getFeed(items: Post[]): Post[] {
        const context = this.buildContext();
        return FeedEngine.rank(items, context);
    },

    async getReels(items: Post[]): Promise<Post[]> {
        const context = this.buildContext();
        return await ReelsEngine.rank(items, context);
    },

    // Fix: Removed async to ensure it returns MarketplaceItem[] directly, fixing Promise mismatch in marketplaceService
    getMarketplace(items: MarketplaceItem[]): MarketplaceItem[] {
        const context = this.buildContext();
        return MarketEngine.rank(items, context);
    },

    // Fix: Removed 'private' modifier which is invalid in object literals
    buildContext(): EngineContext {
        const user = authService.getCurrentUser() || undefined;
        return {
            user,
            userEmail: user?.email,
            // Futuramente expandir para capturar GPS real aqui
        };
    }
};
