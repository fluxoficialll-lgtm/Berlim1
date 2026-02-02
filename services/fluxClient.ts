
import { API_BASE } from '../apiConfig';

/**
 * FLUX CLIENT (The Connection Brain)
 * Centraliza 100% do tráfego da plataforma, garantindo governança,
 * rastreabilidade (Trace-ID) e gestão inteligente de tokens.
 */

export interface FluxRequestOptions extends RequestInit {
  timeout?: number;
  isAdminAction?: boolean;
}

const PROTOCOL_VERSION = '4.2.0';

class FluxClient {
  private static instance: FluxClient;
  private clientId: string;

  private constructor() {
    this.clientId = localStorage.getItem('flux_instance_id') || `flx_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('flux_instance_id', this.clientId);
  }

  public static getInstance(): FluxClient {
    if (!FluxClient.instance) {
      FluxClient.instance = new FluxClient();
    }
    return FluxClient.instance;
  }

  /**
   * Executa chamadas HTTP injetando inteligência de cabeçalhos e segurança.
   */
  public async call<T>(path: string, options: FluxRequestOptions = {}): Promise<T> {
    const { timeout = 15000, isAdminAction = false, ...fetchOptions } = options;
    const url = path.startsWith('http') ? path : `${API_BASE}${path}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    const traceId = `trc_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    
    const headers = new Headers(fetchOptions.headers || {});
    headers.set('Content-Type', 'application/json');
    headers.set('X-Flux-Client-ID', this.clientId);
    headers.set('X-Flux-Trace-ID', traceId);
    headers.set('X-Protocol-Version', PROTOCOL_VERSION);
    
    // Decisão de Token: Prioridade para Admin se solicitado, senão token de usuário
    const adminToken = process.env.VITE_ADMIN_TOKEN || 'ADMIN_TOKEN_V3';
    const userToken = localStorage.getItem('auth_token');

    if (isAdminAction || path.includes('/admin/')) {
        headers.set('Authorization', `Bearer ${adminToken}`);
        headers.set('X-Admin-Action', 'true');
    } else if (userToken) {
        headers.set('Authorization', `Bearer ${userToken}`);
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal
      });

      clearTimeout(timer);

      // Interceptor de Erros Críticos do Gemini/Backend
      if (response.status === 404 || response.status === 401) {
        const errorData = await response.json().catch(() => ({}));
        
        if (errorData.error?.message?.includes("Requested entity was not found")) {
            console.error("🚨 [FluxClient] API KEY DO GEMINI INVÁLIDA OU EXPIRADA");
            throw new Error("API_KEY_REQUIRED");
        }
      }

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.error || `HTTP_ERROR_${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error("TIMEOUT: O servidor demorou demais para responder.");
      }
      throw error;
    }
  }
}

export const fluxClient = FluxClient.getInstance();
