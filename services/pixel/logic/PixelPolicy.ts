
import { PixelEventName } from '../../../types/pixel.types';

/**
 * Eventos que devem ocorrer apenas UMA vez por contexto (usuário/produto)
 */
export const SINGLETON_EVENTS: PixelEventName[] = [
  'PageView',
  'Lead',
  'CompleteRegistration',
  'Purchase', // Proteção contra disparos duplicados de compra
  'InitiateCheckout',
  'AddPaymentInfo',
  'ViewContent',
  'GalleryInteraction' // Proteção para não poluir com múltiplas interações na mesma sessão
];

/**
 * Roteamento Exclusivo: Define quais eventos vão pelo navegador e quais vão pelo servidor.
 */
const BROWSER_ROUTING: PixelEventName[] = [
  'PageView',
  'ViewContent',
  'TimeStay30s',
  'TimeStay60s',
  'GalleryInteraction', // Browser
  'GalleryZoom'
];

const CAPI_ROUTING: PixelEventName[] = [
  'Lead',
  'InitiateCheckout',
  'AddPaymentInfo',
  'Purchase' // CAPI
];

export const pixelPolicy = {
  isSingleton: (eventName: string): boolean => {
    return SINGLETON_EVENTS.includes(eventName as PixelEventName);
  },

  shouldRouteToBrowser: (eventName: string): boolean => {
    return BROWSER_ROUTING.includes(eventName as PixelEventName);
  },

  shouldRouteToCapi: (eventName: string): boolean => {
    return CAPI_ROUTING.includes(eventName as PixelEventName);
  },

  /**
   * Define se o evento precisa de contexto de produto (ID do Grupo) para a trava de singleton.
   */
  requiresContentContext: (eventName: string): boolean => {
    return ['Lead', 'ViewContent', 'InitiateCheckout', 'Purchase', 'AddPaymentInfo', 'GalleryInteraction', 'PageView'].includes(eventName);
  }
};
