import { FeeAuditOrchestrator } from './fees/index.js';

/**
 * FinancialAuditLogger
 * Atua como a fachada principal de auditoria financeira.
 * Delega a formatação de taxas para o motor especializado de drivers.
 */
export const FinancialAuditLogger = {
    /**
     * Registra alterações nas regras de taxas usando drivers especializados.
     */
    logChange(data) {
        try {
            FeeAuditOrchestrator.log(data);
        } catch (e) {
            console.warn("⚠️ [Audit] Falha ao formatar log de taxa:", e.message);
            // Fallback de segurança para não perder a informação do log
            console.log(`🕒 ${new Date().toLocaleTimeString()} | 🏦 ${data.provider} | 📊 ${data.fixed_fee} + ${data.percent_fee}%`);
        }
    }
};