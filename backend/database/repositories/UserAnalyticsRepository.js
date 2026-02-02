
import { query } from '../pool.js';

export const UserAnalyticsRepository = {
    /**
     * Retorna estatísticas globais de usuários (Ativos, Novos, Retenção)
     */
    async getGlobalUserStats() {
        const res = await query(`
            SELECT 
                COUNT(*) as total_users,
                COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as new_users_24h,
                COUNT(CASE WHEN (data->>'lastSeen')::bigint > (extract(epoch from now()) * 1000) - 300000 THEN 1 END) as active_now
            FROM users
        `);
        return res.rows[0];
    },

    /**
     * Busca o histórico de atividade de um usuário específico
     */
    async getUserActivitySummary(userId) {
        // Placeholder para futuras implementações de log de navegação
        return {
            userId,
            sessionsCount: 0,
            averageSessionDuration: 0,
            mainInterests: []
        };
    }
};
