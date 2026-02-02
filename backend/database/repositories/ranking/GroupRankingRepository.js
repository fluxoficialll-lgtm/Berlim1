
import { query } from '../../pool.js';

/**
 * REPOSITÓRIO DE RANKING: Focado em volume de membros
 */
export const GroupRankingRepository = {
    /**
     * Retorna os grupos ordenados pelo maior número de membros
     * @param {string} type - 'public', 'private', 'vip' ou 'all'
     * @param {number} limit - Quantidade de itens (Padrão 100)
     */
    async getTopGroups(type = 'all', limit = 100) {
        let filter = '';
        if (type === 'vip') filter = "WHERE (data->>'isVip')::boolean = true";
        else if (type === 'private') filter = "WHERE (data->>'isPrivate')::boolean = true AND (data->>'isVip')::boolean = false";
        else if (type === 'public') filter = "WHERE (data->>'isPrivate')::boolean = false AND (data->>'isVip')::boolean = false";

        const res = await query(`
            SELECT 
                data,
                jsonb_array_length(COALESCE(data->'memberIds', '[]'::jsonb)) as member_count
            FROM groups 
            ${filter} 
            ORDER BY member_count DESC, updated_at DESC 
            LIMIT $1
        `, [limit]);

        return res.rows.map(r => {
            const groupData = typeof r.data === 'string' ? JSON.parse(r.data) : r.data;
            return {
                ...groupData,
                memberCount: parseInt(r.member_count)
            };
        });
    }
};
