
import { pixelPolicy } from './PixelPolicy';

/**
 * EventGuard: O "segurança" do Pixel.
 * Garante que eventos importantes não sejam disparados mais de uma vez
 * por usuário/sessão/produto.
 */
export const eventGuard = {
  /**
   * Verifica se o evento pode ser disparado.
   */
  canTrack: (eventName: string, pixelId: string, contentId: string = 'global'): boolean => {
    // Se não for singleton pela política, pode disparar livremente
    if (!pixelPolicy.isSingleton(eventName)) {
      return true;
    }

    const contextId = pixelPolicy.requiresContentContext(eventName) ? contentId : 'global';
    
    // Chave única: Pixel + Evento + Contexto (ex: lead_grupo123)
    const storageKey = `flux_px_guard_${pixelId}_${eventName}_${contextId}`;
    
    if (localStorage.getItem(storageKey) === 'true') {
      console.warn(`🛡️ [PixelGuard] Disparo duplicado de ${eventName} para ${contextId} foi bloqueado.`);
      return false;
    }

    return true;
  },

  /**
   * Marca o evento como disparado para este usuário no cache persistente.
   */
  markAsTracked: (eventName: string, pixelId: string, contentId: string = 'global') => {
    if (!pixelPolicy.isSingleton(eventName)) return;

    const contextId = pixelPolicy.requiresContentContext(eventName) ? contentId : 'global';
    const storageKey = `flux_px_guard_${pixelId}_${eventName}_${contextId}`;
    
    localStorage.setItem(storageKey, 'true');
  },

  /**
   * Limpa as travas de um pixel específico (útil em logouts ou testes).
   */
  clearGuards: (pixelId: string) => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(`flux_px_guard_${pixelId}`)) {
        localStorage.removeItem(key);
      }
    });
  }
};
