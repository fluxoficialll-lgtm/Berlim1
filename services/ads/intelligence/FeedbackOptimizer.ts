
import { db } from '../../../database';

interface OptimizationWeights {
  topicBonus: Record<string, number>;
  timeWeights: number[]; // 24h
  globalEfficiency: number;
}

export const FeedbackOptimizer = {
  STORAGE_KEY: 'flux_ads_dna_weights',

  /**
   * Aprende com uma conversão bem sucedida.
   */
  recordSuccess(campaignId: string, userId: string) {
    const weights = this.getWeights();
    const ad = db.ads.getAll().find(a => a.id === campaignId);
    if (!ad) return;

    // Extrai palavras-chave do anúncio vencedor
    const keywords = ad.creative.text.toLowerCase().split(' ').filter(w => w.length > 4);
    
    keywords.forEach(word => {
      weights.topicBonus[word] = (weights.topicBonus[word] || 1.0) + 0.05;
      // Cap de bônus para evitar viés infinito
      if (weights.topicBonus[word] > 3.0) weights.topicBonus[word] = 3.0;
    });

    // Aprende o horário de conversão
    const hour = new Date().getHours();
    weights.timeWeights[hour] += 0.1;
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(weights));
  },

  /**
   * Retorna o multiplicador de inteligência baseado no histórico de aprendizado.
   */
  getHeuristicMultiplier(adText: string): number {
    const weights = this.getWeights();
    const words = adText.toLowerCase().split(' ');
    const hour = new Date().getHours();
    
    let score = 1.0;
    
    // Bônus de tópico que já converteu
    words.forEach(w => {
      if (weights.topicBonus[w]) score *= (weights.topicBonus[w] * 0.5 + 0.5);
    });

    // Bônus de horário produtivo
    const timeFactor = weights.timeWeights[hour] || 1.0;
    
    return score * Math.min(timeFactor, 2.0);
  },

  // Fix: removed 'private' modifier which is not allowed in object literals
  getWeights(): OptimizationWeights {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : {
        topicBonus: {},
        timeWeights: new Array(24).fill(1.0),
        globalEfficiency: 1.0
      };
    } catch {
      return { topicBonus: {}, timeWeights: new Array(24).fill(1.0), globalEfficiency: 1.0 };
    }
  }
};
