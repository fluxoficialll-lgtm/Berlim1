import { IPixelProvider } from './BaseProvider';
import { PixelEventData, PixelUserData } from '../../../types/pixel.types';
import { MetaMapping } from '../mappings/MetaMapping';
import { mapToMetaParams } from '../mappings/params/MetaParams';
import { anonymizeUserData } from '../utils/pixelHasher';

export class MetaProvider implements IPixelProvider {
  id = 'meta';

  init(pixelId: string) {
    if (typeof window === 'undefined' || !pixelId) return;
    
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
  }

  async track(internalEvent: string, data?: PixelEventData, userData?: PixelUserData) {
    if (!(window as any).fbq) return;

    const eventName = MetaMapping[internalEvent] || internalEvent;
    
    // 1. Anonimiza PII (SHA-256)
    const hashedUserData = await anonymizeUserData(userData || {});
    
    // 2. Mescla com dados técnicos do navegador
    const fullUserData = {
      ...hashedUserData,
      userAgent: navigator.userAgent,
      fbp: document.cookie.match(/_fbp=([^;]+)/)?.[1],
      fbc: document.cookie.match(/_fbc=([^;]+)/)?.[1]
    };

    // 3. Traduz para o esquema do Meta
    const metaParams = mapToMetaParams(fullUserData, data);

    // 4. Dispara via Navegador
    (window as any).fbq('track', eventName, metaParams, { 
      eventID: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}` 
    });
  }
}
