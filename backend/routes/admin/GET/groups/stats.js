
import { dbManager } from '../../../../databaseManager.js';

/**
 * GET /api/admin/execute/groups/stats
 * Formato: Padrão A (Quantidade Cronológica)
 */
export default async (req, res) => {
    try {
        const intervals = {
            hoje: "created_at >= CURRENT_DATE",
            ontem: "created_at >= CURRENT_DATE - INTERVAL '1 day' AND created_at < CURRENT_DATE",
            d30: "created_at >= CURRENT_DATE - INTERVAL '30 days'",
            d60: "created_at >= CURRENT_DATE - INTERVAL '60 days'",
            d90: "created_at >= CURRENT_DATE - INTERVAL '90 days'",
            d180: "created_at >= CURRENT_DATE - INTERVAL '180 days'"
        };

        const sql = `
            SELECT 
                COUNT(*) FILTER (WHERE ${intervals.hoje}) as today_count,
                COUNT(*) FILTER (WHERE ${intervals.ontem}) as yesterday_count,
                COUNT(*) FILTER (WHERE ${intervals.d30}) as count_30d,
                COUNT(*) FILTER (WHERE ${intervals.d60}) as count_60d,
                COUNT(*) FILTER (WHERE ${intervals.d90}) as count_90d,
                COUNT(*) FILTER (WHERE ${intervals.d180}) as count_180d,
                COUNT(*) as total_lifetime
            FROM groups
        `;

        const result = await dbManager.query(sql);
        const row = result.rows[0];

        res.json({
            today_count: parseInt(row.today_count || 0),
            yesterday_count: parseInt(row.yesterday_count || 0),
            count_30d: parseInt(row.count_30d || 0),
            count_60d: parseInt(row.count_60d || 0),
            count_90d: parseInt(row.count_90d || 0),
            count_180d: parseInt(row.count_180d || 0),
            total_lifetime: parseInt(row.total_lifetime || 0)
        });
    } catch (e) {
        console.error("[Admin DB Error - groups/stats]:", e.message);
        res.status(500).json({ error: "Falha ao consultar estatísticas cronológicas de grupos." });
    }
};
