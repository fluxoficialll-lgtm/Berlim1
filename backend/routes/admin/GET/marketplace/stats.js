
import { dbManager } from '../../../../databaseManager.js';

export default async (req, res) => {
    try {
        const sql = `
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as hoje
            FROM marketplace
        `;
        const result = await dbManager.query(sql);
        const row = result.rows[0];

        res.json({
            success: true,
            data: {
                total: parseInt(row.total || 0),
                hoje: parseInt(row.hoje || 0)
            }
        });
    } catch (e) {
        res.status(500).json({ error: "Erro no banco local." });
    }
};
