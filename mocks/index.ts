
import { envService } from '../services/envService';

export * from './users.mock';
export * from './posts.mock';
export * from './marketplace.mock';
export * from './groups.mock';
export * from './campaigns.mock';
export * from './chats.mock';
export * from './notifications.mock';

/**
 * Define se o app deve injetar dados fictícios para visualização.
 */
export const USE_MOCKS = envService.isDemoMode();
