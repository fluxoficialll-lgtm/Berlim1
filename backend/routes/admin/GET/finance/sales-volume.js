
import { dbManager } from '../../../../databaseManager.js';

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
            FROM financial_transactions
            WHERE type = 'sale' AND status = 'paid'
        `;

        const result = await dbManager.query(sql);
        const r = result.rows[0];

        res.json({
            success: true,
            data: {
                hoje: parseInt(r.hoje),
                ontem: parseInt(r.ontem),
                d30: parseInt(r.d30),
                d60: parseInt(r.d60),
                d90: parseInt(r.d90),
                d180: parseInt(r.d180),
                total: parseInt(r.total)
            }
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
