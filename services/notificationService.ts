
import { USE_MOCKS } from '../mocks';
import { notificationService as RealService } from './real/notificationService';
import { notificationService as MockService } from './mocks/notificationService';

export const notificationService = USE_MOCKS ? MockService : RealService;
