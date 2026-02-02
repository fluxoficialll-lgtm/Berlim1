import { PixelEventName } from '../../../types/pixel.types';
import { EngagementMapping } from './EngagementMapping';

/**
 * Dicionário de tradução para TikTok
 */
export const TikTokMapping: Record<string, PixelEventName> = {
  'VIEW_VIP_DOOR': 'PageView',
  'LEAD_CAPTURED': 'CompleteRegistration',
  'CHECKOUT_STARTED': 'InitiateCheckout',
  'PAYMENT_SUCCESS': 'Purchase',
  'ADD_TO_CART': 'AddToCart',
  
  // Mescla com os eventos de engajamento estratégico
  ...EngagementMapping
};