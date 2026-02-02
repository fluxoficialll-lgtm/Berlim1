
import { dbManager } from '../../../../databaseManager.js';

/**
 * GET /api/admin/execute/stats/users
 * Retorna métricas de retenção, onboarding e tipos de perfis.
 */
export default async (req, res) => {
    try {
        const sqlUsers = `
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE is_profile_completed = true) as completed,
                COUNT(DISTINCT seller_id) as sellers,
                COUNT(DISTINCT owner_id) as advertisers,
                COUNT(*) FILTER (WHERE referred_by_id IS NOT NULL) as total_referrals
            FROM users 
            LEFT JOIN marketplace ON users.id = marketplace.seller_id
            LEFT JOIN ads ON users.id = ads.owner_id
        `;

        const result = await dbManager.query(sqlUsers);
        const r = result.rows[0];

        res.json({
            success: true,
            data: {
                totalUsers: parseInt(r.total),
                completedProfiles: parseInt(r.completed),
                activeSellers: parseInt(r.sellers),
                activeAdvertisers: parseInt(r.advertisers),
                referralNetworkSize: parseInt(r.total_referrals)
            }
        });
    } catch (e) {
        console.error("[Stats:Users] Error:", e.message);
        res.status(500).json({ error: "Erro ao carregar dados de usuários." });
    }
};
