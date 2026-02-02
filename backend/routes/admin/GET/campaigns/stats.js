
import { dbManager } from '../../../../databaseManager.js';

/**
 * GET /api/admin/execute/campaigns/stats
 * Formato: Padrão C (Misto)
 */
export default async (req, res) => {
    try {
        const intervals = {
            hoje: "created_at >= CURRENT_DATE",
            ontem: "created_at >= CURRENT_DATE - INTERVAL '1 day' AND created_at < CURRENT_DATE",
            d30: "created_at >= CURRENT_DATE - INTERVAL '30 days'",
            d60: "created_at >= CURRENT_DATE - INTERVAL '60 days'",
            d90: "created_at >= CURRENT_DATE - INTERVAL '90 days'"
        };

        const sql = `
            SELECT 
                COUNT(*) FILTER (WHERE (data->>'status') = 'active') as active_count,
                COUNT(*) FILTER (WHERE (data->>'status') = 'draft' OR (data->>'status') = 'pending') as draft_count,
                COALESCE(SUM((data->>'budget')::numeric) FILTER (WHERE ${intervals.hoje}), 0) as today_revenue,
                COALESCE(SUM((data->>'budget')::numeric) FILTER (WHERE ${intervals.ontem}), 0) as yesterday_revenue,
                COALESCE(SUM((data->>'budget')::numeric) FILTER (WHERE ${intervals.d30}), 0) as revenue_30d,
                COALESCE(SUM((data->>'budget')::numeric) FILTER (WHERE ${intervals.d60}), 0) as revenue_60d,
                COALESCE(SUM((data->>'budget')::numeric) FILTER (WHERE ${intervals.d90}), 0) as revenue_90d,
                COALESCE(SUM((data->>'budget')::numeric), 0) as total_revenue
            FROM ads
        `;

        const result = await dbManager.query(sql);
        const row = result.rows[0];

        res.json({
            active_count: parseInt(row.active_count || 0),
            draft_count: parseInt(row.draft_count || 0),
            today_revenue: parseFloat(row.today_revenue || 0),
            yesterday_revenue: parseFloat(row.yesterday_revenue || 0),
            revenue_30d: parseFloat(row.revenue_30d || 0),
            revenue_60d: parseFloat(row.revenue_60d || 0),
            revenue_90d: parseFloat(row.revenue_90d || 0),
            total_revenue: parseFloat(row.total_revenue || 0)
        });
    } catch (e) {
        res.status(500).json({ error: "Erro ao consultar estatísticas de campanhas." });
    }
};
