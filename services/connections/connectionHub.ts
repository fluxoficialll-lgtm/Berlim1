
import { geminiConnection } from './gemini.connection';
import { paymentConnection } from './payment.connection';

/**
 * CONNECTION HUB
 * Centraliza o acesso a todos os serviços externos.
 * Facilita o monitoramento de saúde (Health Check) global.
 */
export const connectionHub = {
  ai: geminiConnection,
  gateways: paymentConnection,

  /**
   * Verifica se o sistema básico está operacional
   */
  async checkHealth(): Promise<boolean> {
    try {
      // Exemplo: Ping simples no backend
      const res = await fetch('/ping');
      return res.ok;
    } catch {
      return false;
    }
  }
};
