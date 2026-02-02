
import { TrafficSourceData } from '../../../types/pixel.types';

const STORAGE_KEY = 'flux_traffic_origin';

export const trafficSource = {
  /**
   * Analisa a URL e salva a origem se encontrar parâmetros de marketing.
   */
  capture: () => {
    const params = new URLSearchParams(window.location.search);
    const utms: TrafficSourceData = {};
    
    const utmKeys: (keyof TrafficSourceData)[] = [
      'utm_source', 'utm_medium', 'utm_campaign', 
      'utm_content', 'utm_term', 'fbclid', 'ttclid', 'gclid'
    ];

    let hasMarketingData = false;
    utmKeys.forEach(key => {
      // Fix: casting key to string to resolve Argument of type 'string | number | symbol' is not assignable to parameter of type 'string'
      const val = params.get(key as string);
      if (val) {
        utms[key] = val;
        hasMarketingData = true;
      }
    });

    if (hasMarketingData) {
      // Salva no localStorage para persistir entre abas e recarregamentos
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...utms,
        timestamp: Date.now()
      }));
      console.log("🚦 [TrafficSource] Origem de tráfego capturada:", utms);
    }
  },

  /**
   * Retorna a origem salva para anexar nos eventos de conversão.
   */
  getOriginData: (): TrafficSourceData => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    
    try {
      const parsed = JSON.parse(raw);
      // Atribuição válida por 30 dias (padrão de mercado)
      if (Date.now() - parsed.timestamp > 30 * 24 * 60 * 60 * 1000) {
        localStorage.removeItem(STORAGE_KEY);
        return {};
      }
      return parsed;
    } catch {
      return {};
    }
  }
};
