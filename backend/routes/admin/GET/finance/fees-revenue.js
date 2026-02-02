
import { dbManager } from '../../../../databaseManager.js';

/**
 * GET /api/admin/execute/finance/fees-revenue
 * Formato: Padrão B (Monetário)
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
                COALESCE(SUM((data->>'platformProfit')::numeric) FILTER (WHERE ${intervals.hoje}), 0) as today_amount,
                COALESCE(SUM((data->>'platformProfit')::numeric) FILTER (WHERE ${intervals.ontem}), 0) as yesterday_amount,
                COALESCE(SUM((data->>'platformProfit')::numeric) FILTER (WHERE ${intervals.d30}), 0) as amount_30d,
                COALESCE(SUM((data->>'platformProfit')::numeric) FILTER (WHERE ${intervals.d60}), 0) as amount_60d,
                COALESCE(SUM((data->>'platformProfit')::numeric) FILTER (WHERE ${intervals.d90}), 0) as amount_90d,
                COALESCE(SUM((data->>'platformProfit')::numeric) FILTER (WHERE ${intervals.d180}), 0) as amount_180d,
                COALESCE(SUM((data->>'platformProfit')::numeric), 0) as total_lifetime
            FROM financial_transactions
            WHERE status = 'paid'
        `;

        const result = await dbManager.query(sql);
        const row = result.rows[0];

        res.json({
            today_amount: parseFloat(row.today_amount || 0),
            yesterday_amount: parseFloat(row.yesterday_amount || 0),
            amount_30d: parseFloat(row.amount_30d || 0),
            amount_60d: parseFloat(row.amount_60d || 0),
            amount_90d: parseFloat(row.amount_90d || 0),
            amount_180d: parseFloat(row.amount_180d || 0),
            total_lifetime: parseFloat(row.total_lifetime || 0)
        });
    } catch (e) {
        res.status(500).json({ error: "Erro ao calcular lucro com taxas." });
    }
};
