
import { PixelEventData, PixelUserData, PixelConfig } from '../../types/pixel.types';
import { metaBrowserService } from './MetaBrowserService';
import { metaCapiService } from './MetaCapiService';
import { generateDeterministicEventId } from './logic/DeterministicId';
import { eventGuard } from './logic/EventGuard';
import { pixelPayloadBuilder } from './logic/PixelPayloadBuilder';
import { pixelPolicy } from './logic/PixelPolicy';

class PixelOrchestrator {
  private config: PixelConfig = {};
  private processingEvents = new Set<string>();

  init(config: PixelConfig) {
    this.config = config;
    if (config.metaId) {
      metaBrowserService.init(config.metaId);
    }
  }

  async track(eventName: string, data: PixelEventData = {}, userData: PixelUserData = {}) {
    const activePixelId = this.config.metaId;
    if (!activePixelId) return;

    const contentId = data.content_ids?.[0] || 'global';
    const lockKey = `${activePixelId}_${eventName}_${contentId}`;

    // 1. PREVENÇÃO DE DUPLICIDADE (Memória + LocalStorage)
    if (this.processingEvents.has(lockKey)) return;
    if (!eventGuard.canTrack(eventName, activePixelId, contentId)) return;
    
    if (pixelPolicy.isSingleton(eventName)) {
        this.processingEvents.add(lockKey);
        eventGuard.markAsTracked(eventName, activePixelId, contentId);
    }

    try {
        // Enriquecimento de dados (Email, FBP, FBC, IP) para garantir Match Quality de "cada pessoa"
        const enrichedUser = await pixelPayloadBuilder.buildUserData(userData);
        const enrichedEventData = pixelPayloadBuilder.buildEventData(eventName, data);

        const eventId = await generateDeterministicEventId(
          eventName, 
          enrichedUser.email || enrichedUser.fbp || 'anon', 
          contentId
        );

        const finalData = { ...enrichedEventData, event_id: eventId };

        // 2. ROTEAMENTO EXCLUSIVO (Apenas CAPI para AddPaymentInfo conforme solicitado)
        if (pixelPolicy.shouldRouteToBrowser(eventName)) {
          await metaBrowserService.track(eventName, finalData, enrichedUser);
        } 
        else if (pixelPolicy.shouldRouteToCapi(eventName) && this.config.pixelToken) {
          // AddPaymentInfo cairá aqui, disparando via servidor
          await metaCapiService.track(activePixelId, this.config.pixelToken, eventName, eventId, finalData, enrichedUser);
          console.debug(`🚀 [Pixel:CAPI] ${eventName} enviado com sucesso.`);
        }
    } catch (err) {
        console.error(`❌ [PixelOrchestrator] Falha ao trackear ${eventName}:`, err);
    } finally {
        // Delay para limpar memória, mantendo a trava do LocalStorage ativa permanentemente para o usuário
        setTimeout(() => this.processingEvents.delete(lockKey), 2000);
    }
  }
}

export const pixelOrchestrator = new PixelOrchestrator();
