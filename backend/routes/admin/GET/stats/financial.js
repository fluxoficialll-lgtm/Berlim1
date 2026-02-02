
import { dbManager } from '../../../../databaseManager.js';

/**
 * GET /api/admin/execute/stats/financial
 * Retorna snapshot financeiro e rankings de métodos/gateways.
 */
export default async (req, res) => {
    try {
        const intervals = {
            hoje: "created_at >= CURRENT_DATE",
            ontem: "created_at >= CURRENT_DATE - INTERVAL '1 day' AND created_at < CURRENT_DATE"
        };

        const sqlMetrics = `
            SELECT 
                COALESCE(SUM(amount), 0) as gmv_total,
                COUNT(*) as tx_total,
                COALESCE(SUM((data->>'platformProfit')::numeric), SUM(amount * 0.10)) as profit_est,
                COALESCE(SUM(amount) FILTER (WHERE ${intervals.hoje}), 0) as gmv_hoje,
                COALESCE(SUM(amount) FILTER (WHERE ${intervals.ontem}), 0) as gmv_ontem
            FROM financial_transactions 
            WHERE status = 'paid'
        `;

        const sqlMethods = `
            SELECT 
                method_name as method, 
                COUNT(*) as count, 
                SUM(amount) as volume
            FROM payment_methods_usage
            GROUP BY method_name 
            ORDER BY volume DESC
        `;

        const [metricsRes, methodsRes] = await Promise.all([
            dbManager.query(sqlMetrics),
            dbManager.query(sqlMethods)
        ]);

        const m = metricsRes.rows[0];
        
        res.json({
            success: true,
            data: {
                summary: {
                    totalGMV: parseFloat(m.gmv_total),
                    totalTransactions: parseInt(m.tx_total),
                    estimatedProfit: parseFloat(m.profit_est),
                    growth24h: parseFloat(m.gmv_hoje) - parseFloat(m.gmv_ontem)
                },
                rankings: {
                    methods: methodsRes.rows.map(r => ({
                        method: r.method,
                        count: parseInt(r.count),
                        volume: parseFloat(r.volume || 0)
                    }))
                }
            }
        });
    } catch (e) {
        console.error("[Stats:Financial] Error:", e.message);
        res.status(500).json({ error: "Erro ao carregar dados financeiros." });
    }
};
