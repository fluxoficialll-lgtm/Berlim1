import { query } from '../pool.js';

export const InteractionRepository = {
    /**
     * Registra uma interação única e atualiza o contador normalizado no post.
     */
    async recordUniqueInteraction(postId, userId, type) {
        try {
            const insertResult = await query(`
                INSERT INTO interactions (post_id, user_id, type)
                VALUES ($1, $2, $3)
                ON CONFLICT (post_id, user_id, type) DO NOTHING
                RETURNING id
            `, [postId, userId, type]);

            if (insertResult.rows.length > 0) {
                // Atualiza coluna numérica para performance de ranking
                const counterColumn = type === 'view' ? 'views_count' : (type === 'like' ? 'likes_count' : null);
                
                if (counterColumn) {
                    await query(`
                        UPDATE posts 
                        SET ${counterColumn} = ${counterColumn} + 1
                        WHERE id = $1
                    `, [postId]);
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error(`[InteractionRepo] Error recording ${type}:`, error.message);
            return false;
        }
    },

    async removeInteraction(postId, userId, type) {
        try {
            const deleteResult = await query(`
                DELETE FROM interactions 
                WHERE post_id = $1 AND user_id = $2 AND type = $3
                RETURNING id
            `, [postId, userId, type]);

            if (deleteResult.rows.length > 0) {
                const counterColumn = type === 'like' ? 'likes_count' : null;
                if (counterColumn) {
                    await query(`
                        UPDATE posts 
                        SET ${counterColumn} = GREATEST(0, ${counterColumn} - 1)
                        WHERE id = $1
                    `, [postId]);
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error(`[InteractionRepo] Error removing ${type}:`, error.message);
            return false;
        }
    }
};