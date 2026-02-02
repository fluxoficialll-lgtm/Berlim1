
import { dbManager } from '../../../../databaseManager.js';

/**
 * GET /api/admin/execute/stats/content
 * Retorna volume de inventário e crescimento cronológico de grupos e posts.
 */
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

        const sqlContent = `
            SELECT 
                -- Métricas Cronológicas de Grupos
                COUNT(id) FILTER (WHERE ${intervals.hoje}) as groups_today,
                COUNT(id) FILTER (WHERE ${intervals.ontem}) as groups_yesterday,
                COUNT(id) FILTER (WHERE ${intervals.d30}) as groups_30d,
                COUNT(id) FILTER (WHERE ${intervals.d60}) as groups_60d,
                COUNT(id) FILTER (WHERE ${intervals.d90}) as groups_90d,
                COUNT(id) FILTER (WHERE ${intervals.d180}) as groups_180d,
                COUNT(id) as groups_total,
                
                -- Distribuição de Tipos (Snapshot)
                COUNT(id) FILTER (WHERE is_vip = true) as groups_vip,
                COUNT(id) FILTER (WHERE (data->>'isPrivate')::boolean = true AND is_vip = false) as groups_private,

                -- Métricas de Outros Conteúdos
                (SELECT COUNT(*) FROM posts WHERE (data->>'type') != 'video') as total_posts,
                (SELECT COUNT(*) FROM posts WHERE (data->>'type') = 'video') as total_reels,
                (SELECT COUNT(*) FROM marketplace) as total_products
            FROM groups
        `;

        const result = await dbManager.query(sqlContent);
        const r = result.rows[0];

        res.json({
            success: true,
            data: {
                counts: {
                    posts: parseInt(r.total_posts),
                    reels: parseInt(r.total_reels),
                    products: parseInt(r.total_products)
                },
                groups: {
                    today_count: parseInt(r.groups_today),
                    yesterday_count: parseInt(r.groups_yesterday),
                    count_30d: parseInt(r.groups_30d),
                    count_60d: parseInt(r.groups_60d),
                    count_90d: parseInt(r.groups_90d),
                    count_180d: parseInt(r.groups_180d),
                    total_lifetime: parseInt(r.groups_total),
                    // Metadados de distribuição mantidos para compatibilidade de gráficos
                    vip: parseInt(r.groups_vip),
                    private: parseInt(r.groups_private),
                    public: parseInt(r.groups_total) - (parseInt(r.groups_vip) + parseInt(r.groups_private))
                }
            }
        });
    } catch (e) {
        console.error("[Stats:Content] Error:", e.message);
        res.status(500).json({ error: "Erro ao carregar dados cronológicos de conteúdo." });
    }
};
