
import { FeeRepository } from '../../../../database/repositories/financial/FeeRepository.js';
import { dbManager } from '../../../../databaseManager.js';
import { FinancialAuditLogger } from '../../../../services/audit/FinancialAuditLogger.js';

/**
 * PATCH /api/admin/execute/finance/fee-rules
 */
export default async (req, res) => {
    try {
        const { id, data } = req.body;
        if (!id || !data) return res.status(400).json({ error: "ID da regra e dados de atualização são obrigatórios." });

        // Busca dados atuais para o log antes de atualizar ou usa os novos enviados
        const currentRuleRes = await dbManager.query("SELECT * FROM platform_fee_rules WHERE id = $1", [id]);
        const currentRule = currentRuleRes.rows[0];

        if (!currentRule) {
            return res.status(404).json({ error: "Regra não encontrada." });
        }

        await FeeRepository.updateRule(id, data);

        // Dispara Log Visual no Terminal com os dados finais
        FinancialAuditLogger.logChange({
            provider: currentRule.provider,
            country_code: currentRule.country_code,
            currency: data.currency || currentRule.currency,
            method: currentRule.method,
            fixed_fee: data.fixed_fee ?? currentRule.fixed_fee,
            percent_fee: data.percent_fee ?? currentRule.percent_fee
        });

        res.json({ success: true, message: "Regra de taxa atualizada com sucesso." });
    } catch (e) {
        res.status(500).json({ error: "Falha ao atualizar taxas: " + e.message });
    }
};
