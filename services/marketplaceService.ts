
import { USE_MOCKS } from '../mocks';
import { marketplaceService as RealMarketplaceService } from './real/marketplaceService';
import { marketplaceService as MockMarketplaceService } from './mocks/marketplaceService';

export const marketplaceService = USE_MOCKS ? MockMarketplaceService : RealMarketplaceService;
