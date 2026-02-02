
import { PixelEventName } from '../../../types/pixel.types';
import { EngagementMapping } from './EngagementMapping';

/**
 * Dicionário de tradução para Meta (Facebook/Instagram)
 */
export const MetaMapping: Record<string, PixelEventName> = {
  'VIEW_VIP_DOOR': 'PageView',
  'LEAD_CAPTURED': 'Lead',
  'CHECKOUT_STARTED': 'InitiateCheckout',
  'PAYMENT_SUCCESS': 'Purchase',
  'ADD_TO_CART': 'AddToCart',
  'REGISTRATION_COMPLETE': 'CompleteRegistration',
  
  // Signal Stacking
  'TIME_STAY_30S': 'ViewContent',
  'TIME_STAY_60S': 'ViewContent',
  'GALLERY_INTERACTION': 'ViewContent',
  'GALLERY_ZOOM': 'ViewContent',
  
  // Mescla com os eventos de engajamento estratégico
  ...EngagementMapping
};
