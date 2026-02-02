
import { dbManager } from '../../../../databaseManager.js';

/**
 * DELETE /api/admin/execute/finance/fee-rules
 * Remove uma regra de taxa específica.
 */
export default async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: "O ID da regra é obrigatório para exclusão." });
        }

        const result = await dbManager.query("DELETE FROM platform_fee_rules WHERE id = $1", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Regra não encontrada." });
        }

        res.json({ 
            success: true, 
            message: "Regra removida. O sistema aplicará as taxas de fallback global." 
        });
    } catch (e) {
        console.error("[Admin DELETE finance/fee-rules] Error:", e.message);
        res.status(500).json({ error: "Erro ao remover regra: " + e.message });
    }
};
