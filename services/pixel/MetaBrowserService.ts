
import { PixelEventData, PixelUserData } from '../../types/pixel.types';
import { anonymizeUserData } from './utils/pixelHasher';
import { mapToMetaParams } from './mappings/params/MetaParams';

// Cache para evitar reinicialização do mesmo Pixel ID
const initializedPixels = new Set<string>();

/**
 * MetaBrowserService
 * Responsabilidade: Interação direta com o script do Facebook (fbq)
 */
export const metaBrowserService = {
  init: (pixelId: string) => {
    if (typeof window === 'undefined' || !pixelId) return;
    
    // Se o pixel já foi inicializado nesta carga de página, ignora
    if (initializedPixels.has(pixelId)) return;

    if (!(window as any).fbq) {
      (function(f:any,b:any,e:any,v:any,n?:any,t?:any,s?:any)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!(window as any)._fbq)(window as any)._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)})(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
    }

    (window as any).fbq('init', pixelId);
    initializedPixels.add(pixelId);
    console.debug(`[Meta Pixel] Inicializado: ${pixelId}`);
  },

  track: async (eventName: string, data?: PixelEventData, userData?: PixelUserData) => {
    if (!(window as any).fbq) return;

    // Converte dados do usuário para Hash SHA-256 (Padrão Meta)
    const hashedUserData = await anonymizeUserData(userData || {});
    
    // Traduz para o dicionário do Meta
    const metaParams = mapToMetaParams(hashedUserData, data);

    (window as any).fbq('track', eventName, metaParams, { 
      eventID: data?.event_id 
    });
  }
};
