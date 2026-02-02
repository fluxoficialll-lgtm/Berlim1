
import { PixelEventData, PixelUserData } from '../../types/pixel.types';
import { API_BASE } from '../../apiConfig';

/**
 * MetaCapiService
 * Responsabilidade: Redirecionar eventos para o Backend (Conversões API)
 * Eventos: Lead, InitiateCheckout, Purchase
 */
export const metaCapiService = {
  track: async (pixelId: string, accessToken: string, eventName: string, eventId: string, data?: PixelEventData, userData?: PixelUserData) => {
    console.log(`🚀 [Meta CAPI] Encaminhando para Hub: ${eventName} (${eventId})`);
    
    try {
      const response = await fetch(`${API_BASE}/api/tracking/capi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: 'meta',
          pixelId,
          accessToken,
          eventName,
          eventId,
          eventData: data,
          userData: {
            ...userData,
            userAgent: navigator.userAgent,
            ip: '0.0.0.0' // O backend resolverá o IP real
          },
          url: window.location.href
        })
      });

      if (!response.ok) {
        console.warn(`[Meta CAPI] Servidor retornou erro, mas o fluxo segue.`);
      }
    } catch (e) {
      console.error("[Meta CAPI] Erro de rede ao tentar CAPI:", e);
    }
  }
};
