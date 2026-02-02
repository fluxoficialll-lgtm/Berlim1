
import { dbManager } from '../../../../databaseManager.js';

/**
 * Ação: banned-stats | Categoria: users
 * Consulta direta ao banco para usuários suspensos.
 */
export default async (req, res) => {
    try {
        const intervals = {
            hoje: "created_at >= CURRENT_DATE",
            ontem: "created_at >= CURRENT_DATE - INTERVAL '1 day' AND created_at < CURRENT_DATE",
            d30: "created_at >= CURRENT_DATE - INTERVAL '30 days'",
            total: "1=1"
        };

        const sql = `
            SELECT 
                COUNT(*) FILTER (WHERE ${intervals.hoje} AND is_banned = true) as hoje,
                COUNT(*) FILTER (WHERE ${intervals.ontem} AND is_banned = true) as ontem,
                COUNT(*) FILTER (WHERE ${intervals.d30} AND is_banned = true) as d30,
                COUNT(*) FILTER (WHERE is_banned = true) as total
            FROM users
        `;

        const result = await dbManager.query(sql);
        const row = result.rows[0];

        res.json({
            success: true,
            source: 'local_db_query',
            data: {
                hoje: parseInt(row.hoje || 0),
                ontem: parseInt(row.ontem || 0),
                d30: parseInt(row.d30 || 0),
                total: parseInt(row.total || 0)
            }
        });
    } catch (e) {
        res.status(500).json({ error: "Erro ao consultar banidos no banco local." });
    }
};
