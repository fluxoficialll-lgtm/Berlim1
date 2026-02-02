
import { FeeRepository } from '../../../../database/repositories/financial/FeeRepository.js';
import { FinancialAuditLogger } from '../../../../services/audit/FinancialAuditLogger.js';

/**
 * POST /api/admin/execute/finance/rules
 * Payload esperado: { provider, method, country_code, currency, fixed_fee, percent_fee, is_active }
 */
export default async (req, res) => {
    try {
        const data = req.body;

        if (!data.provider || !data.method) {
            return res.status(400).json({ error: "Campos 'provider' e 'method' são obrigatórios." });
        }

        // Validação de Moedas Permitidas para Liquidação
        const allowedCurrencies = ['BRL', 'USD', 'EUR'];
        if (data.currency && !allowedCurrencies.includes(data.currency.toUpperCase())) {
            return res.status(400).json({ 
                error: `A moeda ${data.currency} não é suportada para liquidação. Use BRL, USD ou EUR.` 
            });
        }

        const savedRule = await FeeRepository.saveRule(data);

        // Log visual no terminal do servidor
        FinancialAuditLogger.logChange({
            provider: savedRule.provider,
            country_code: savedRule.country_code,
            currency: savedRule.currency,
            method: savedRule.method,
            fixed_fee: savedRule.fixed_fee,
            percent_fee: savedRule.percent_fee
        });

        res.json({ 
            success: true, 
            message: "Regra de taxa sincronizada com sucesso.",
            rule: savedRule 
        });
    } catch (e) {
        console.error("[Dispatcher:POST:finance/rules] Error:", e.message);
        res.status(500).json({ error: "Falha ao processar salvamento de taxa: " + e.message });
    }
};
