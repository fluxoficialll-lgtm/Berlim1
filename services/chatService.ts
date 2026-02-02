
import { USE_MOCKS } from '../mocks';
import { chatService as RealChatService } from './real/chatService';
import { chatService as MockChatService } from './mocks/chatService';

export const chatService = USE_MOCKS ? MockChatService : RealChatService;
