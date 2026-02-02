
import { query } from '../pool.js';

export const RelationshipRepository = {
    async create({ followerId, followingId, ...data }) {
        const id = `${followerId}_${followingId}`;
        await query(`
            INSERT INTO relationships (id, follower_id, following_id, data)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (id) DO NOTHING
        `, [id, followerId, followingId, JSON.stringify(data)]);
    },

    async delete(followerId, followingId) {
        const id = `${followerId}_${followingId}`;
        await query('DELETE FROM relationships WHERE id = $1', [id]);
    },

    async findByFollower(followerId) {
        const res = await query('SELECT * FROM relationships WHERE follower_id = $1', [followerId]);
        return res.rows.map(r => ({
            id: r.id,
            followerId: r.follower_id,
            followingId: r.following_id,
            ...(typeof r.data === 'string' ? JSON.parse(r.data) : (r.data || {}))
        }));
    },

    async getTopCreators() {
        const res = await query(`
            SELECT following_id, COUNT(*) as followers_count
            FROM relationships
            GROUP BY following_id
            ORDER BY followers_count DESC
            LIMIT 50
        `);
        return res.rows;
    }
};
