
import { AiRequestOptions, AiResponse } from '../types';

/**
 * BaseAiProvider
 * Define o contrato que qualquer IA integrada deve seguir.
 */
export abstract class BaseAiProvider {
  abstract readonly id: string;
  
  /**
   * Método principal de geração de conteúdo.
   */
  abstract generate<T = string>(prompt: string, options: AiRequestOptions): Promise<AiResponse<T>>;
}
