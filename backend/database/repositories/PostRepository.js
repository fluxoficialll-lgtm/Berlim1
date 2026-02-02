
import { query } from '../pool.js';

const mapRowToPost = (row) => {
    if (!row) return null;
    const metadata = typeof row.data === 'string' ? JSON.parse(row.data) : (row.data || {});
    return {
        ...metadata,
        id: row.id,
        authorId: row.author_id,
        likesCount: row.likes_count,
        viewsCount: row.views_count,
        isAd: row.is_ad,
        isAdult: row.is_adult,
        createdAt: row.created_at
    };
};

export const PostRepository = {
    async create(post) {
        const { id, authorId, isAd, isAdult, ...data } = post;
        await query(`
            INSERT INTO posts (id, author_id, is_ad, is_adult, data)
            VALUES ($1, $2, $3, $4, $5)
        `, [id, authorId, !!isAd, !!isAdult, JSON.stringify(data)]);
        return true;
    },

    async list(limit = 50, cursor = null) {
        let sql = 'SELECT * FROM posts ';
        const params = [limit];
        
        if (cursor) {
            sql += 'WHERE created_at < $2 ';
            params.push(cursor);
        }
        
        sql += 'ORDER BY created_at DESC LIMIT $1';
        
        const res = await query(sql, params);
        return res.rows.map(mapRowToPost);
    },

    async delete(id) {
        await query('DELETE FROM posts WHERE id = $1', [id]);
        return true;
    },

    async addComment(id, comment) {
        await query(`
            UPDATE posts 
            SET data = jsonb_set(data, '{comments}', COALESCE(data->'comments', '[]'::jsonb) || $2::jsonb)
            WHERE id = $1
        `, [id, JSON.stringify(comment)]);
    }
};
