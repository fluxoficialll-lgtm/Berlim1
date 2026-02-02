
import { dbManager } from '../../databaseManager.js';

/**
 * AiPerformanceLog: Monitor de inteligência artificial.
 */
export const AiPerformanceLog = {
    /**
     * Registra o resultado de uma operação de IA para análise de 'alucinação' ou custo.
     */
    async record(model, context, metrics) {
        const { duration, success, tokenCount, traceId, prompt } = metrics;

        try {
            // Logamos para o sistema de eventos do banco
            // No futuro, isso alimentará o painel de 'IA Health' no admin
            console.log(`[AI_AUDIT] Model: ${model} | Success: ${success} | Latency: ${duration}ms | Tokens: ${tokenCount || 'N/A'}`);
            
            // Opcional: Se falhar, registra evidência para retreinamento
            if (!success) {
                console.error(`[AI_FAILURE] Trace: ${traceId} | Context: ${context}`);
            }
        } catch (e) {
            // Auditoria nunca deve quebrar o fluxo principal
        }
    }
};
