
import { dbManager } from '../../../../databaseManager.js';

/**
 * Ação: stats | Categoria: reels
 */
export default async (req, res) => {
    try {
        const sql = `
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as hoje,
                COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as d30
            FROM posts
            WHERE (data->>'type') = 'video'
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
        res.status(500).json({ error: "Erro ao consultar reels no banco local." });
    }
};
