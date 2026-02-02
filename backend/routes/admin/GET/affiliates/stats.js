
import { dbManager } from '../../../../databaseManager.js';

/**
 * Ação: stats | Categoria: affiliates
 */
export default async (req, res) => {
    try {
        const sql = `
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE referred_by_id IS NOT NULL AND created_at >= CURRENT_DATE) as hoje,
                COUNT(*) FILTER (WHERE referred_by_id IS NOT NULL AND created_at >= CURRENT_DATE - INTERVAL '30 days') as d30
            FROM users 
            WHERE referred_by_id IS NOT NULL
        `;
        const result = await dbManager.query(sql);
        const row = result.rows[0];

        res.json({
            success: true,
            data: {
                total: parseInt(row.total || 0),
                hoje: parseInt(row.hoje || 0),
                d30: parseInt(row.d30 || 0)
            }
        });
    } catch (e) {
        res.status(500).json({ error: "Erro ao consultar afiliados no banco local." });
    }
};
