
import { AiRequestOptions, AiResponse } from '../types';
import { GeminiProvider } from '../providers/GeminiProvider';
import { tokenGuard } from './TokenGuard';
import { authService } from '../../authService';

class AiOrchestrator {
  private providers = [new GeminiProvider()];
  private defaultProvider = 'gemini';

  /**
   * Executa uma tarefa de IA de forma segura e otimizada.
   */
  async run<T = string>(prompt: string, options: AiRequestOptions): Promise<T> {
    const user = authService.getCurrentUser();
    const userId = user?.id || 'anonymous_guest';

    // 1. Validação de Segurança e Orçamento
    if (!tokenGuard.canProcess(userId)) {
      console.warn(`[AiOrchestrator] Rate limit hit for user ${userId}`);
      throw new Error("Limite de requisições de IA atingido. Tente novamente em 1 minuto.");
    }

    // 2. Seleção de Provedor
    const provider = this.providers.find(p => p.id === this.defaultProvider);
    if (!provider) throw new Error("AI_PROVIDER_NOT_FOUND");

    const startTime = performance.now();
    
    try {
        // 3. Execução da Tarefa
        const result = await provider.generate<T>(prompt, options);
        
        // 4. Auditoria e Registro
        const duration = performance.now() - startTime;
        console.log(`[AI_AUDIT] Task: ${options.task} | Provider: ${result.provider} | Model: ${result.model} | Latency: ${duration.toFixed(0)}ms`);
        
        tokenGuard.record(userId);
        return result.content;
    } catch (error: any) {
        console.error(`[AiOrchestrator] Critical error in task ${options.task}:`, error.message);
        throw error;
    }
  }
}

export const aiOrchestrator = new AiOrchestrator();
