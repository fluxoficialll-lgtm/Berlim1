
import { dbManager } from '../../../../databaseManager.js';

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
                COUNT(*) FILTER (WHERE (data->>'status') = 'draft' OR (data->>'status') = 'pending') as rascunhos,
                COUNT(*) FILTER (WHERE (data->>'status') = 'active') as ativas,
                COALESCE(SUM((data->>'budget')::numeric) FILTER (WHERE ${intervals.hoje}), 0) as rev_hoje,
                COALESCE(SUM((data->>'budget')::numeric) FILTER (WHERE ${intervals.ontem}), 0) as rev_ontem,
                COALESCE(SUM((data->>'budget')::numeric) FILTER (WHERE ${intervals.d30}), 0) as rev_d30,
                COALESCE(SUM((data->>'budget')::numeric) FILTER (WHERE ${intervals.d60}), 0) as rev_d60,
                COALESCE(SUM((data->>'budget')::numeric) FILTER (WHERE ${intervals.d90}), 0) as rev_d90,
                COALESCE(SUM((data->>'budget')::numeric), 0) as total_arrecadado
            FROM ads
        `;

        const result = await dbManager.query(sql);
        const r = result.rows[0];

        res.json({
            success: true,
            data: {
                counts: {
                    rascunhos: parseInt(r.rascunhos),
                    ativas: parseInt(r.ativas)
                },
                revenue: {
                    hoje: parseFloat(r.rev_hoje),
                    ontem: parseFloat(r.rev_ontem),
                    d30: parseFloat(r.rev_d30),
                    d60: parseFloat(r.rev_d60),
                    d90: parseFloat(r.rev_d90),
                    total_arrecadado: parseFloat(r.total_arrecadado)
                }
            }
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
