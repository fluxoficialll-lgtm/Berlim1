
import { query } from '../pool.js';

export const FinancialRepository = {
    async recordTransaction({ userId, type, amount, status, providerTxId, currency = 'BRL', data = {} }) {
        const res = await query(`
            INSERT INTO financial_transactions (user_id, type, amount, status, provider_tx_id, currency, data)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
        `, [userId, type, amount, status, providerTxId, currency, JSON.stringify(data)]);
        return res.rows[0].id;
    },

    async grantVipAccess(userId, groupId, status = 'active', metadata = {}) {
        const accessId = `${userId}_${groupId}`;
        const data = { status, ...metadata };
        await query(`
            INSERT INTO vip_access (id, user_id, group_id, data)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (id) DO UPDATE SET data = $4
        `, [accessId, userId, groupId, JSON.stringify(data)]);

        // Adiciona automaticamente o ID do usuário aos membros do grupo no JSONB
        await query(`
            UPDATE groups 
            SET data = jsonb_set(data, '{memberIds}', COALESCE(data->'memberIds', '[]'::jsonb) || $2::jsonb)
            WHERE id = $1 AND NOT (data->'memberIds' ? $3)
        `, [groupId, JSON.stringify(userId), userId]);
        return true;
    },

    async getFees() {
        const res = await query("SELECT value FROM platform_settings WHERE key = 'fees'");
        return res.rows[0]?.value || { sale_fee_type: "percent", sale_fee_value: 10, withdrawal_fee: 5.00 };
    },

    async updateFees(newFees) {
        await query("UPDATE platform_settings SET value = $1, updated_at = NOW() WHERE key = 'fees'", [JSON.stringify(newFees)]);
        return true;
    }
};
