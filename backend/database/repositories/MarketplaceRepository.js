
import { query } from '../pool.js';

const mapRowToItem = (row) => {
    if (!row) return null;
    const metadata = typeof row.data === 'string' ? JSON.parse(row.data) : (row.data || {});
    return {
        ...metadata,
        id: row.id,
        sellerId: row.seller_id,
        createdAt: row.created_at
    };
};

export const MarketplaceRepository = {
    async create(item) {
        const { id, sellerId, ...data } = item;
        await query(`
            INSERT INTO marketplace (id, seller_id, data)
            VALUES ($1, $2, $3)
            ON CONFLICT (id) DO UPDATE SET data = $3
        `, [id, sellerId, JSON.stringify(data)]);
        return true;
    },

    async list() {
        const res = await query('SELECT * FROM marketplace ORDER BY created_at DESC');
        return res.rows.map(mapRowToItem);
    },

    async findById(id) {
        const res = await query('SELECT * FROM marketplace WHERE id = $1', [id]);
        return mapRowToItem(res.rows[0]);
    },

    async delete(id) {
        await query('DELETE FROM marketplace WHERE id = $1', [id]);
        return true;
    }
};
