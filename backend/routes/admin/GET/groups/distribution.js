
import { dbManager } from '../../../../databaseManager.js';

export default async (req, res) => {
    try {
        const sql = `
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE is_vip = true) as vip,
                COUNT(*) FILTER (WHERE (data->>'isPrivate')::boolean = true AND is_vip = false) as privado,
                COUNT(*) FILTER (WHERE (data->>'isPrivate')::boolean = false AND is_vip = false) as publico
            FROM groups
        `;

        const result = await dbManager.query(sql);
        const r = result.rows[0];
        const total = parseInt(r.total) || 1; // Evita divisão por zero

        res.json({
            success: true,
            data: {
                counts: {
                    publico: parseInt(r.publico),
                    privado: parseInt(r.privado),
                    vip: parseInt(r.vip)
                },
                percentages: {
                    publico: Math.round((parseInt(r.publico) / total) * 100),
                    privado: Math.round((parseInt(r.privado) / total) * 100),
                    vip: Math.round((parseInt(r.vip) / total) * 100)
                }
            }
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
