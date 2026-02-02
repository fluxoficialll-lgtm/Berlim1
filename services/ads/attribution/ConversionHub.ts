import { FingerprintService } from './FingerprintService';

interface AttributionData {
  adId: string;
  campaignId: string;
  timestamp: number;
  type: 'click' | 'view';
}

export const ConversionHub = {
  STORAGE_KEY: 'flux_attr_trail',
  WINDOW_DAYS: 30,

  /**
   * Registra um ponto de contato com o anúncio.
   */
  async recordTouchpoint(adId: string, campaignId: string, type: 'click' | 'view') {
    await FingerprintService.getFingerprint();
    const trail = this.getTrail();
    
    // Atualiza ou adiciona o touchpoint
    trail[adId] = {
      adId,
      campaignId,
      timestamp: Date.now(),
      type
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trail));
  },

  /**
   * Resolve a atribuição no momento da venda.
   * Retorna os IDs das campanhas que influenciaram esta conversão.
   */
  getAttributedCampaigns(): string[] {
    const trail = this.getTrail();
    const now = Date.now();
    const windowMs = this.WINDOW_DAYS * 24 * 60 * 60 * 1000;

    // Fix: Explicitly type the values array to avoid unknown type errors
    const values = Object.values(trail) as AttributionData[];

    return values
      .filter(t => (now - t.timestamp) < windowMs)
      .sort((a, b) => b.timestamp - a.timestamp) // Prioriza Last Click
      .map(t => t.campaignId);
  },

  // Fix: Removed 'private' modifier which is not allowed in object literals
  getTrail(): Record<string, AttributionData> {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }
};