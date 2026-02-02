
import { dbManager } from '../../../../databaseManager.js';

export default async (req, res) => {
    try {
        const intervals = {
            hoje: "created_at >= CURRENT_DATE",
            d30: "created_at >= CURRENT_DATE - INTERVAL '30 days'"
        };

        const sql = `
            SELECT 
                COUNT(*) FILTER (WHERE ${intervals.hoje}) as hoje,
                COUNT(*) FILTER (WHERE ${intervals.d30}) as d30,
                COUNT(*) as total
            FROM posts
            WHERE (data->>'type') = 'video'
        `;

        const result = await dbManager.query(sql);
        const row = result.rows[0];

        res.json({
            success: true,
            source: 'local_db_query',
            data: {
                hoje: parseInt(row.hoje || 0),
                d30: parseInt(row.d30 || 0),
                total: parseInt(row.total || 0)
            }
        });
    } catch (e) {
        res.status(500).json({ error: "Erro ao consultar reels no banco local." });
    }
};
