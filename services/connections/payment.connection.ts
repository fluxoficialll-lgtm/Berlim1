
import { BaseConnection } from "./base.connection";
import { ConnectionResponse } from "./types";

export class PaymentConnection extends BaseConnection {
  /**
   * Wrapper para fetch API com tratamento de erros de gateway
   */
  public async request<T>(
    url: string, 
    options: RequestInit, 
    providerName: string
  ): Promise<ConnectionResponse<T>> {
    return this.withRetry(async () => {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          // Tratamento específico exigido para erro de entidade não encontrada (API Key expirada/inválida)
          if (data.error?.message?.includes("Requested entity was not found")) {
              throw new Error(`GATEWAY_AUTH_ERROR: ${providerName}`);
          }
          
          return {
            success: false,
            error: data.error || data.message || `Erro no provedor ${providerName}`,
            statusCode: response.status
          };
        }

        return {
          success: true,
          data: data as T
        };
      } catch (err: any) {
        console.error(`[${providerName} Connection Error]:`, err.message);
        throw err;
      }
    });
  }
}

export const paymentConnection = new PaymentConnection();
