
import { query } from '../pool.js';

export const AggregatorRepository = {
    /**
     * Coleta todas as estatísticas de negócio de um usuário em um único "fio" (BFF)
     */
    async getBusinessDashboard(userId) {
        // Consultas em paralelo para performance máxima
        const [postsCount, marketCount, adsCount, reportsCount, financialStats] = await Promise.all([
            // Contagem de Posts e Reels
            query(`
                SELECT 
                    COUNT(*) FILTER (WHERE (data->>'type') != 'video') as posts_count,
                    COUNT(*) FILTER (WHERE (data->>'type') = 'video') as reels_count
                FROM posts WHERE author_id = $1
            `, [userId]),

            // Contagem de Produtos
            query(`SELECT COUNT(*) as total FROM marketplace WHERE seller_id = $1`, [userId]),

            // Campanhas Ativas
            query(`SELECT COUNT(*) as total FROM ads WHERE owner_id = $1 AND (data->>'status') = 'active'`, [userId]),

            // Denúncias Pendentes
            query(`
                SELECT COUNT(*) as total FROM reports 
                WHERE target_id = $1 AND status = 'pending'
            `, [userId]),

            // Resumo Financeiro Pessoal
            query(`
                SELECT 
                    SUM(amount) FILTER (WHERE type = 'sale' AND status = 'paid') as total_revenue,
                    COUNT(*) FILTER (WHERE type = 'sale' AND status = 'paid') as sales_count
                FROM financial_transactions WHERE user_id = $1
            `, [userId])
        ]);

        const [products, campaigns] = await Promise.all([
            query(`SELECT data FROM marketplace WHERE seller_id = $1 ORDER BY created_at DESC`, [userId]),
            query(`SELECT data FROM ads WHERE owner_id = $1 ORDER BY created_at DESC`, [userId])
        ]);

        return {
            stats: {
                totalPosts: parseInt(postsCount.rows[0].posts_count || 0),
                totalReels: parseInt(postsCount.rows[0].reels_count || 0),
                totalProducts: parseInt(marketCount.rows[0].total || 0),
                activeAds: parseInt(adsCount.rows[0].total || 0),
                pendingReports: parseInt(reportsCount.rows[0].total || 0)
            },
            financial: {
                totalRevenue: parseFloat(financialStats.rows[0].total_revenue || 0),
                salesCount: parseInt(financialStats.rows[0].sales_count || 0)
            },
            lists: {
                products: products.rows.map(r => typeof r.data === 'string' ? JSON.parse(r.data) : r.data),
                campaigns: campaigns.rows.map(r => typeof r.data === 'string' ? JSON.parse(r.data) : r.data)
            }
        };
    }
};
