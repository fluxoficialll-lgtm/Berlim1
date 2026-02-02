
import { query } from '../pool.js';

export const ChatRepository = {
    async findById(id) {
        const res = await query('SELECT * FROM chats WHERE id = $1', [id]);
        if (!res.rows[0]) return null;
        const row = res.rows[0];
        return {
            id: row.id,
            updatedAt: row.updated_at,
            ...(typeof row.data === 'string' ? JSON.parse(row.data) : (row.data || {}))
        };
    },

    async findPrivate(email) {
        const res = await query(`
            SELECT * FROM chats 
            WHERE id LIKE $1 
            AND NOT (data->'deletedBy' ? $2)
            ORDER BY updated_at DESC
        `, [`%${email.toLowerCase()}%`, email.toLowerCase()]);
        
        return res.rows.map(row => ({
            id: row.id,
            updatedAt: row.updated_at,
            ...(typeof row.data === 'string' ? JSON.parse(row.data) : (row.data || {}))
        }));
    },

    async set(chatData) {
        const { id, ...data } = chatData;
        await query(`
            INSERT INTO chats (id, data, updated_at)
            VALUES ($1, $2, NOW())
            ON CONFLICT (id) DO UPDATE SET
                data = $2,
                updated_at = NOW()
        `, [id, JSON.stringify(data)]);
    },

    /**
     * Exclui ou oculta mensagens específicas
     */
    async deleteMessages(chatId, messageIds, userEmail, target) {
        const chat = await this.findById(chatId);
        if (!chat) return false;

        const email = userEmail.toLowerCase();

        if (target === 'all') {
            // Hard Delete: Remove as mensagens do array globalmente
            chat.messages = chat.messages.filter(m => !messageIds.includes(m.id));
        } else {
            // Soft Delete: Marca apenas quem excluiu dentro de cada mensagem
            chat.messages = chat.messages.map(m => {
                if (messageIds.includes(m.id)) {
                    const deletedBy = new Set(m.deletedBy || []);
                    deletedBy.add(email);
                    return { ...m, deletedBy: Array.from(deletedBy) };
                }
                return m;
            });
        }

        await this.set(chat);
        return true;
    },

    async markAsDeleted(chatId, userEmail) {
        const chat = await this.findById(chatId);
        if (!chat) return false;

        const deletedBy = new Set(chat.deletedBy || []);
        deletedBy.add(userEmail.toLowerCase());

        const participants = chatId.split('_');
        
        if (participants.every(p => deletedBy.has(p.toLowerCase()))) {
            await this.delete(chatId);
            return 'purged';
        }

        chat.deletedBy = Array.from(deletedBy);
        await this.set(chat);
        return 'hidden';
    },

    async hardDelete(id) {
        await query('DELETE FROM chats WHERE id = $1', [id]);
        return true;
    },

    async delete(id) {
        await query('DELETE FROM chats WHERE id = $1', [id]);
    }
};
