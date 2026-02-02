
import { authService } from './authService';

/**
 * API Interceptor (Resiliência de Dados)
 * Centraliza o tratamento de erros de rede e autenticação.
 */

interface RequestOptions extends RequestInit {
  timeout?: number;
}

export const safeRequest = async <T>(url: string, options: RequestOptions = {}): Promise<T> => {
  const { timeout = 10000, ...fetchOptions } = options;

  // 1. Injeção de Token Automática
  const token = localStorage.getItem('auth_token');
  const headers = new Headers(fetchOptions.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // 2. Mecanismo de Timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // 3. Tratamento Global de Erros HTTP
    
    // Sessão Expirada
    if (response.status === 401) {
      console.warn("🔐 Sessão expirada ou inválida. Protegendo conta...");
      authService.logout();
      window.location.hash = '#/';
      throw new Error("UNAUTHORIZED");
    }

    // Muitas requisições (Bot protection)
    if (response.status === 429) {
      throw new Error("Muitas requisições. Tente novamente em 60 segundos.");
    }

    // Erro de Servidor
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Falha na comunicação (${response.status})`);
    }

    return await response.json();

  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error("A conexão com o servidor demorou muito. Verifique sua internet.");
    }
    throw error;
  }
};
