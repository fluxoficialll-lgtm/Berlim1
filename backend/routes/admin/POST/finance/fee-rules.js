
import { dbManager } from '../../../../databaseManager.js';
import { FinancialAuditLogger } from '../../../../services/audit/FinancialAuditLogger.js';

/**
 * POST /api/admin/execute/finance/fee-rules
 * Cadastra uma nova regra de taxa.
 * Tipos suportados: %, % + Fixo, Fixo.
 */
export default async (req, res) => {
    try {
        const { 
            provider, 
            method, 
            country_code, 
            currency, 
            fixed_fee, 
            percent_fee, 
            priority, 
            is_active 
        } = req.body;

        if (!provider || !method) {
            return res.status(400).json({ error: "Provedor e Método são obrigatórios." });
        }

        const sql = `
            INSERT INTO platform_fee_rules (
                provider, method, country_code, currency, fixed_fee, percent_fee, priority, is_active
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (provider, method, country_code) DO UPDATE SET
                currency = EXCLUDED.currency,
                fixed_fee = EXCLUDED.fixed_fee,
                percent_fee = EXCLUDED.percent_fee,
                priority = EXCLUDED.priority,
                is_active = EXCLUDED.is_active,
                updated_at = NOW()
        `;

        await dbManager.query(sql, [
            provider.toLowerCase(),
            method.toLowerCase(),
            (country_code || 'ALL').toUpperCase(),
            (currency || 'BRL').toUpperCase(),
            fixed_fee || 0,
            percent_fee || 0,
            priority || 0,
            is_active ?? true
        ]);

        // Dispara Log Visual no Terminal
        FinancialAuditLogger.logChange({
            provider,
            country_code: country_code || 'ALL',
            currency: currency || 'BRL',
            method,
            fixed_fee,
            percent_fee
        });

        res.json({ 
            success: true, 
            message: "Configuração de taxa salva com sucesso." 
        });
    } catch (e) {
        console.error("[Admin POST finance/fee-rules] Error:", e.message);
        res.status(500).json({ error: "Erro ao salvar regra: " + e.message });
    }
};
