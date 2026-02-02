import { pixelOrchestrator } from './pixel/PixelOrchestrator';
import { PixelEventData, PixelUserData } from '../../types/pixel.types';
import { API_BASE } from '../../apiConfig';
import { trackingService } from '../trackingService';

/**
 * metaPixelService
 * Fachada de compatibilidade para o sistema Flux.
 * Agora delega a inteligência de rota para o PixelOrchestrator.
 */
export const metaPixelService = {
    init: (pixelId: string, pixelToken?: string) => {
        pixelOrchestrator.init({ metaId: pixelId, pixelToken });
    },

    /**
     * trackPageView agora utiliza o Orchestrator para garantir
     * que o EventGuard valide o disparo único por usuário/sessão.
     */
    trackPageView: (pixelId: string) => {
        if (!pixelId) return;
        metaPixelService.init(pixelId);
        
        // Agora passa pelo orquestrador que contém a trava do EventGuard
        pixelOrchestrator.track('PageView', {
            content_type: 'website'
        });
    },

    trackRecruitmentAccess: async (ref: string) => {
        if (!ref) return;
        try {
            const response = await fetch(`${API_BASE}/api/tracking/pixel-info?ref=${encodeURIComponent(ref)}`);
            if (response.ok) {
                const { pixelId, pixelToken } = await response.json();
                if (pixelId) {
                    // Inicializa com token para garantir CAPI se necessário
                    metaPixelService.init(pixelId, pixelToken);
                    metaPixelService.trackPageView(pixelId);
                }
            }
        } catch (e) {
            console.warn("[Pixel] Falha ao carregar pixel de afiliado.");
        }
    },

    trackLead: (pixelId: string, userData?: PixelUserData, groupId?: string) => {
        pixelOrchestrator.track('Lead', { 
            content_ids: groupId ? [groupId] : [],
            content_type: 'product_group'
        }, userData);
    },

    trackViewContent: (pixelId: string, data: PixelEventData, userDataOverride?: PixelUserData) => {
        pixelOrchestrator.track('ViewContent', data, userDataOverride);
    },

    trackInitiateCheckout: (pixelId: string, data: PixelEventData, userDataOverride?: PixelUserData) => {
        pixelOrchestrator.track('InitiateCheckout', data, userDataOverride);
    }
};

export const getCookie = (name: string): string | undefined => {
    try {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) return match[2];
    } catch (e) { return undefined; }
    return undefined;
};