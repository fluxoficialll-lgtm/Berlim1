
import { query } from '../../pool.js';

export const FeeRepository = {
    /**
     * Resolve a regra de taxa mais precisa para o contexto
     */
    async resolveBestRule(provider, method, countryCode = 'ALL') {
        const res = await query(`
            SELECT * FROM platform_fee_rules 
            WHERE provider = $1 
              AND method = $2 
              AND (country_code = $3 OR country_code = 'ALL')
              AND is_active = TRUE
            ORDER BY 
              (CASE WHEN country_code = $3 THEN 2 ELSE 1 END) DESC, -- Prefere país específico
              priority DESC
            LIMIT 1
        `, [provider, method, countryCode]);
        
        return res.rows[0];
    },

    /**
     * Salva ou atualiza uma regra de taxa (UPSERT)
     */
    async saveRule(data) {
        const { 
            provider, method, country_code, currency, 
            fixed_fee, percent_fee, is_active, priority 
        } = data;

        const sql = `
            INSERT INTO platform_fee_rules (
                provider, method, country_code, currency, 
                fixed_fee, percent_fee, is_active, priority
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (provider, method, country_code) 
            DO UPDATE SET
                currency = EXCLUDED.currency,
                fixed_fee = EXCLUDED.fixed_fee,
                percent_fee = EXCLUDED.percent_fee,
                is_active = EXCLUDED.is_active,
                priority = EXCLUDED.priority,
                updated_at = NOW()
            RETURNING *;
        `;

        const res = await query(sql, [
            provider.toLowerCase(),
            method.toLowerCase(),
            (country_code || 'ALL').toUpperCase(),
            (currency || 'BRL').toUpperCase(),
            fixed_fee || 0,
            percent_fee || 0,
            is_active ?? true,
            priority || 0
        ]);

        return res.rows[0];
    },

    /**
     * Verifica se o usuário possui campanhas de anúncios ativas (Condição de Isenção)
     */
    async hasActiveCampaigns(userId) {
        const res = await query(`
            SELECT id FROM ads 
            WHERE owner_id = $1 
              AND (data->>'status') = 'active'
            LIMIT 1
        `, [userId]);
        return res.rows.length > 0;
    },

    async getAllRules() {
        const res = await query('SELECT * FROM platform_fee_rules ORDER BY provider, method, country_code');
        return res.rows;
    },

    async updateRule(id, data) {
        const { fixed_fee, percent_fee, is_active, priority, currency } = data;
        await query(`
            UPDATE platform_fee_rules 
            SET fixed_fee = COALESCE($2, fixed_fee),
                percent_fee = COALESCE($3, percent_fee),
                is_active = COALESCE($4, is_active),
                priority = COALESCE($5, priority),
                currency = COALESCE($6, currency),
                updated_at = NOW()
            WHERE id = $1
        `, [id, fixed_fee, percent_fee, is_active, priority, currency]);
        return true;
    }
};
