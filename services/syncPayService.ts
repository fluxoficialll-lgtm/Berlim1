
import { USE_MOCKS } from '../mocks';
import { syncPayService as RealSyncPayService } from './real/syncPayService';
import { syncPayService as MockSyncPayService } from './mocks/syncPayService';

export const syncPayService = USE_MOCKS ? MockSyncPayService : RealSyncPayService;
