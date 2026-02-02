
import { query } from '../pool.js';

const mapRowToGroup = (row) => {
    if (!row) return null;
    const metadata = typeof row.data === 'string' ? JSON.parse(row.data) : (row.data || {});
    return {
        ...metadata,
        id: row.id,
        creatorId: row.creator_id,
        isVip: row.is_vip,
        memberCount: row.member_count,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
};

export const GroupRepository = {
    async create(group) {
        const { id, creatorId, isVip, ...data } = group;
        await query(`
            INSERT INTO groups (id, creator_id, is_vip, status, data, updated_at) 
            VALUES ($1, $2, $3, $4, $5, NOW()) 
            ON CONFLICT (id) DO UPDATE SET 
                is_vip = $3,
                data = $5, 
                updated_at = NOW()
        `, [id, creatorId, !!isVip, group.status || 'active', JSON.stringify(data)]);
        return true;
    },

    async findById(id) {
        const res = await query('SELECT * FROM groups WHERE id = $1', [id]);
        return mapRowToGroup(res.rows[0]);
    },

    async list() {
        const res = await query('SELECT * FROM groups ORDER BY member_count DESC');
        return res.rows.map(mapRowToGroup);
    },

    async ranking(type = 'public') {
        let filter = "WHERE status = 'active'";
        if (type === 'vip') filter += " AND is_vip = true";
        else if (type === 'private') filter += " AND (data->>'isPrivate')::boolean = true AND is_vip = false";
        else filter += " AND (data->>'isPrivate')::boolean = false AND is_vip = false";

        const res = await query(`
            SELECT * FROM groups ${filter} ORDER BY member_count DESC LIMIT 100
        `);
        return res.rows.map(mapRowToGroup);
    },

    async incrementMembers(id) {
        await query('UPDATE groups SET member_count = member_count + 1 WHERE id = $1', [id]);
    },

    async decrementMembers(id) {
        await query('UPDATE groups SET member_count = GREATEST(0, member_count - 1) WHERE id = $1', [id]);
    },

    async updateActivity(id) {
        await query('UPDATE groups SET updated_at = NOW() WHERE id = $1', [id]);
    },

    async update(group) {
        const { id, isVip, status, ...data } = group;
        await query(`
            UPDATE groups SET 
                is_vip = COALESCE($2, is_vip),
                status = COALESCE($3, status),
                data = data || $4::jsonb, 
                updated_at = NOW() 
            WHERE id = $1
        `, [id, isVip, status, JSON.stringify(data)]);
        return true;
    },

    async delete(id) {
        await query('DELETE FROM groups WHERE id = $1', [id]);
        return true;
    }
};
