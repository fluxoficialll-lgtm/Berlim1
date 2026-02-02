
import { PixelUserData, PixelEventData } from '../../../types/pixel.types';
import { authService } from '../../authService';
import { geoService } from '../../geoService';
import { trafficSource } from '../context/TrafficSource';
import { anonymizeUserData } from '../utils/pixelHasher';
import { Capacitor } from '@capacitor/core';

export const pixelPayloadBuilder = {
  async buildUserData(override?: PixelUserData): Promise<PixelUserData> {
    const user = authService.getCurrentUser();
    const utms = trafficSource.getOriginData();
    const geo = await geoService.detectCountry();

    // Helper para extrair cookies específicos com segurança
    const getCookie = (name: string) => {
        if (typeof document === 'undefined') return undefined;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return undefined;
    };

    // 1. Coleta de identificadores de primeira parte (First Party Cookies)
    // O Meta usa o _fbp para identificar o navegador de forma persistente
    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc') || utms.fbclid;

    const rawData: PixelUserData = {
      email: override?.email || user?.email || localStorage.getItem('guest_email_capture') || undefined,
      phone: override?.phone || user?.profile?.phone || undefined,
      firstName: override?.firstName || user?.profile?.nickname || user?.profile?.name || undefined,
      externalId: user?.id || undefined,
      country: geo?.countryCode || 'BR',
      userAgent: navigator.userAgent,
      fbp,
      fbc,
      ip: geo?.ip || '0.0.0.0'
    };

    // 2. Hashização segura (SHA-256) antes da transmissão
    return await anonymizeUserData(rawData);
  },

  buildEventData(eventName: string, data: PixelEventData): PixelEventData {
    return {
      ...data,
      event_source_url: window.location.href,
      action_source: Capacitor.isNativePlatform() ? 'app' : 'website'
    };
  }
};
