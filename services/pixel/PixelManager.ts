import { PixelEventData, PixelUserData, PixelConfig } from '../../types/pixel.types';
import { IPixelProvider } from './providers/BaseProvider';
import { MetaProvider } from './providers/MetaProvider';
import { TikTokProvider } from './providers/TikTokProvider';
import { GoogleAdsProvider } from './providers/GoogleAdsProvider';
import { API_BASE } from '../../apiConfig';
import { eventGuard } from './logic/EventGuard';
import { generateDeterministicEventId } from './logic/DeterministicId';
import { advancedMatcher } from './logic/AdvancedMatcher';
import { trafficSource } from './context/TrafficSource';

const BROWSER_EVENTS = ['PageView', 'ViewContent', 'TimeStay30s', 'GalleryInteraction', 'GalleryZoom'];
const SERVER_ONLY_EVENTS = ['Lead', 'InitiateCheckout', 'Purchase'];

class PixelManager {
  private providers: IPixelProvider[] = [];
  private activeConfigs: PixelConfig = {};

  constructor() {
    this.providers.push(new MetaProvider());
    this.providers.push(new TikTokProvider());
    this.providers.push(new GoogleAdsProvider());
    
    if (typeof window !== 'undefined') trafficSource.capture();
  }

  init(config: PixelConfig) {
    this.activeConfigs = config;
    if (config.metaId) this.providers.find(p => p.id === 'meta')?.init(config.metaId);
    if (config.tiktokId) this.providers.find(p => p.id === 'tiktok')?.init(config.tiktokId);
    if (config.googleId) this.providers.find(p => p.id === 'google')?.init(config.googleId);
  }

  async track(internalEvent: string, data: PixelEventData = {}, userData: PixelUserData = {}) {
    const contentId = data.content_ids?.[0] || 'global';
    const activePixelId = this.activeConfigs.metaId || 'default';

    if (!eventGuard.canTrack(internalEvent, activePixelId, contentId)) return;

    const enrichedUser = advancedMatcher.enrich(userData);
    const trafficInfo = trafficSource.getOriginData();

    const eventId = await generateDeterministicEventId(
      internalEvent, 
      enrichedUser.email || enrichedUser.fbp || 'anon', 
      contentId
    );

    const finalEventData = { 
      ...data, 
      ...trafficInfo,
      event_id: eventId 
    };

    // 1. Roteamento Browser (Scripts JS)
    // Apenas envia se o evento for categorizado como browser.
    if (BROWSER_EVENTS.includes(internalEvent)) {
      this.providers.forEach(provider => {
        if (provider.id === 'meta' && !this.activeConfigs.metaId) return;
        if (provider.id === 'tiktok' && !this.activeConfigs.tiktokId) return;
        if (provider.id === 'google' && !this.activeConfigs.googleId) return;
        provider.track(internalEvent, finalEventData, enrichedUser);
      });
    }

    // 2. Roteamento CAPI (Conversões API)
    // Lead, Checkout e Purchase são centralizados aqui para proteção total.
    if (SERVER_ONLY_EVENTS.includes(internalEvent) && this.activeConfigs.metaId && this.activeConfigs.pixelToken) {
      await this.relayToCapiHub(internalEvent, finalEventData, enrichedUser, eventId);
    }

    eventGuard.markAsTracked(internalEvent, activePixelId, contentId);
  }

  private async relayToCapiHub(eventName: string, data: any, userData: any, eventId: string) {
    try {
      await fetch(`${API_BASE}/api/tracking/capi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: 'meta',
          pixelId: this.activeConfigs.metaId,
          accessToken: this.activeConfigs.pixelToken,
          eventName: eventName,
          eventId: eventId,
          eventData: data,
          userData,
          url: window.location.href
        })
      });
    } catch (e) {
      console.warn("[PixelManager] Falha ao enviar evento para o servidor CAPI.");
    }
  }
}

export const pixelManager = new PixelManager();