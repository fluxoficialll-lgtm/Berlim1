
import { FeeRepository } from '../../../../database/repositories/financial/FeeRepository.js';
import { dbManager } from '../../../../databaseManager.js';
import { FinancialAuditLogger } from '../../../../services/audit/FinancialAuditLogger.js';

/**
 * PATCH /api/admin/execute/finance/rules
 * Payload esperado: { id, data: { fixed_fee, percent_fee, is_active, currency } }
 */
export default async (req, res) => {
    try {
        const { id, data } = req.body;

        if (!id || !data) {
            return res.status(400).json({ error: "ID e dados de atualização são obrigatórios." });
        }

        // Busca a regra atual para auditoria
        const currentRes = await dbManager.query("SELECT * FROM platform_fee_rules WHERE id = $1", [id]);
        if (currentRes.rows.length === 0) {
            return res.status(404).json({ error: "Regra não encontrada para o ID fornecido." });
        }

        const current = currentRes.rows[0];
        await FeeRepository.updateRule(id, data);

        // Auditoria visual
        FinancialAuditLogger.logChange({
            provider: current.provider,
            country_code: current.country_code,
            currency: data.currency || current.currency,
            method: current.method,
            fixed_fee: data.fixed_fee ?? current.fixed_fee,
            percent_fee: data.percent_fee ?? current.percent_fee
        });

        res.json({ success: true, message: "Taxa atualizada com sucesso." });
    } catch (e) {
        console.error("[Dispatcher:PATCH:finance/rules] Error:", e.message);
        res.status(500).json({ error: "Erro interno ao atualizar regra." });
    }
};
