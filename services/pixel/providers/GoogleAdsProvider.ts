
import { IPixelProvider } from './BaseProvider';
import { PixelEventData, PixelUserData } from '../../../types/pixel.types';

export class GoogleAdsProvider implements IPixelProvider {
  id = 'google';

  init(pixelId: string) {
    if (typeof window === 'undefined' || !pixelId) return;
    
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${pixelId}`;
    document.head.appendChild(script);

    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) { (window as any).dataLayer.push(arguments); }
    (window as any).gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', pixelId);
  }

  async track(eventName: string, data?: PixelEventData, userData?: PixelUserData) {
    if (!(window as any).gtag) return;

    // Mapeamento simples para Google Ads
    const googleEventMap: Record<string, string> = {
      'Purchase': 'purchase',
      'InitiateCheckout': 'begin_checkout',
      'PageView': 'page_view'
    };

    const mappedEvent = googleEventMap[eventName] || eventName;

    (window as any).gtag('event', mappedEvent, {
      value: data?.value,
      currency: data?.currency,
      transaction_id: data?.transaction_id || data?.event_id,
      items: data?.content_ids?.map(id => ({ item_id: id, item_name: data.content_name }))
    });
  }
}
