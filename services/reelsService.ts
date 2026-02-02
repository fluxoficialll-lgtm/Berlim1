
import { USE_MOCKS } from '../mocks';
import { reelsService as RealReelsService } from './real/reelsService';
import { reelsService as MockReelsService } from './mocks/reelsService';

export const reelsService = USE_MOCKS ? MockReelsService : RealReelsService;
