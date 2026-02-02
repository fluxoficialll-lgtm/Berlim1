
import { RetryConfig } from './types';

export class BaseConnection {
  protected defaultRetryConfig: RetryConfig = {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 5000
  };

  protected async withRetry<T>(
    operation: () => Promise<T>,
    config: RetryConfig = this.defaultRetryConfig
  ): Promise<T> {
    let lastError: any;
    let delay = config.initialDelay;

    for (let i = 0; i <= config.maxRetries; i++) {
      try {
        return await operation();
      } catch (err: any) {
        lastError = err;
        
        // Se for erro de autenticação ou erro fatal do Gemini, não tenta novamente
        if (err.message?.includes('API_KEY_INVALID') || err.message?.includes('Requested entity was not found')) {
            throw err;
        }

        if (i < config.maxRetries) {
          console.warn(`[Connection] Tentativa ${i + 1} falhou. Tentando novamente em ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay = Math.min(delay * 2, config.maxDelay);
        }
      }
    }

    throw lastError;
  }
}
