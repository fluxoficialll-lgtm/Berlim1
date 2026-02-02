
import { dbManager } from '../../../../databaseManager.js';

/**
 * Comando: insights
 * Resolve informações detalhadas da plataforma ou de um usuário específico.
 * Substitui o AdminAggregatorRepository.
 */
export default async (req, res) => {
    try {
        const { userId } = req.query;
        let individual = null;

        // 1. Se houver userId, busca rastro do perfil e social graph
        if (userId) {
            const userRes = await dbManager.query(`
                SELECT 
                    u.id, u.email, u.handle, u.data->'profile' as profile,
                    (SELECT COUNT(*) FROM relationships WHERE following_id = u.id AND status = 'accepted') as followers,
                    (SELECT COUNT(*) FROM relationships WHERE follower_id = u.id AND status = 'accepted') as following
                FROM users u WHERE u.id = $1
            `, [userId]);

            if (userRes.rows[0]) {
                const row = userRes.rows[0];
                individual = {
                    id: row.id,
                    email: row.email,
                    handle: `@${row.handle}`,
                    nickname: row.profile?.nickname || row.profile?.name,
                    avatar: row.profile?.photoUrl,
                    stats: {
                        followers: parseInt(row.followers),
                        following: parseInt(row.following)
                    }
                };
            }
        }

        // 2. Coleta métricas de conteúdo (Geral ou por Usuário)
        const filter = userId ? `WHERE ${userId.includes('-') ? 'author_id' : 'author_email'} = '${userId}'` : '';
        const filterMarket = userId ? `WHERE seller_id = '${userId}'` : '';
        const filterGroups = userId ? `WHERE creator_id = '${userId}'` : '';
        const filterReports = userId ? `WHERE target_id = '${userId}'` : '';

        const statsSql = `
            SELECT 
                (SELECT COUNT(*) FROM posts ${userId ? `WHERE author_id = '${userId}' AND (data->>'type') != 'video'` : "WHERE (data->>'type') != 'video'"}) as posts,
                (SELECT COUNT(*) FROM posts ${userId ? `WHERE author_id = '${userId}' AND (data->>'type') = 'video'` : "WHERE (data->>'type') = 'video'"}) as reels,
                (SELECT COUNT(*) FROM marketplace ${filterMarket}) as products,
                (SELECT COUNT(*) FROM groups ${filterGroups}) as groups,
                (SELECT COUNT(*) FROM reports ${filterReports}) as reports,
                (SELECT pg_database_size(current_database())) as db_size_bytes
        `;

        const statsRes = await dbManager.query(statsSql);
        const s = statsRes.rows[0];

        res.json({
            success: true,
            timestamp: Date.now(),
            data: {
                individual,
                metrics: {
                    posts: parseInt(s.posts),
                    reels: parseInt(s.reels),
                    marketplace: parseInt(s.products),
                    groups: parseInt(s.groups),
                    reports: parseInt(s.reports)
                },
                infrastructure: {
                    databaseSize: parseInt(s.db_size_bytes)
                }
            }
        });

    } catch (e) {
        console.error("[Admin Command Error - insights]:", e.message);
        res.status(500).json({ error: e.message });
    }
};
