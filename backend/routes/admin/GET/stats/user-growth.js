
import { dbManager } from '../../../../databaseManager.js';

/**
 * Ação: user-growth
 * Categoria: stats
 * Método: GET
 * Resolve: /api/admin/execute/stats/user-growth
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
                COUNT(*) FILTER (WHERE ${intervals.hoje}) as hoje,
                COUNT(*) FILTER (WHERE ${intervals.ontem}) as ontem,
                COUNT(*) FILTER (WHERE ${intervals.d30}) as d30,
                COUNT(*) FILTER (WHERE ${intervals.d60}) as d60,
                COUNT(*) FILTER (WHERE ${intervals.d90}) as d90,
                COUNT(*) FILTER (WHERE ${intervals.d180}) as d180,
                COUNT(*) as total
            FROM users
        `;

        const result = await dbManager.query(sql);
        const row = result.rows[0];

        // Converte strings do PG para números reais
        const stats = {
            hoje: parseInt(row.hoje || 0),
            ontem: parseInt(row.ontem || 0),
            d30: parseInt(row.d30 || 0),
            d60: parseInt(row.d60 || 0),
            d90: parseInt(row.d90 || 0),
            d180: parseInt(row.d180 || 0),
            total: parseInt(row.total || 0)
        };

        res.json({
            success: true,
            timestamp: Date.now(),
            data: stats
        });

    } catch (e) {
        console.error("[Admin Command Error - user-growth]:", e.message);
        res.status(500).json({ 
            error: "Falha ao calcular crescimento de usuários.",
            details: e.message 
        });
    }
};
