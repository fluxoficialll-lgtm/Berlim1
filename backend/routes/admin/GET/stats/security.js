
import { dbManager } from '../../../../databaseManager.js';

/**
 * GET /api/admin/execute/stats/security
 * Retorna fila de moderação e usuários restritos.
 */
export default async (req, res) => {
    try {
        const sqlSecurity = `
            SELECT 
                COUNT(*) FILTER (WHERE status = 'pending') as pending_reports,
                COUNT(*) FILTER (WHERE status = 'resolved') as resolved_reports,
                (SELECT COUNT(*) FROM users WHERE is_banned = true) as banned_users
            FROM reports
        `;

        const result = await dbManager.query(sqlSecurity);
        const r = result.rows[0];

        res.json({
            success: true,
            data: {
                reports: {
                    pending: parseInt(r.pending_reports || 0),
                    resolved: parseInt(r.resolved_reports || 0)
                },
                bans: {
                    total: parseInt(r.banned_users || 0)
                }
            }
        });
    } catch (e) {
        console.error("[Stats:Security] Error:", e.message);
        res.status(500).json({ error: "Erro ao carregar dados de segurança." });
    }
};
