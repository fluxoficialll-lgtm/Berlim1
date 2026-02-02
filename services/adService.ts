
import { USE_MOCKS } from '../mocks';
import { adService as RealAdService } from './real/adService';
import { adService as MockAdService } from './mocks/adService';

export const adService = USE_MOCKS ? MockAdService : RealAdService;
