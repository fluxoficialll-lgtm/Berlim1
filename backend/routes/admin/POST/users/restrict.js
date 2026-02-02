
import { dbManager } from '../../../../databaseManager.js';

export default async (req, res) => {
    try {
        const { userId, reason } = req.body;
        await dbManager.query(
            "UPDATE users SET is_banned = $1, data = data || $2::jsonb WHERE id = $3",
            [true, JSON.stringify({ banReason: reason }), userId]
        );
        res.json({ success: true, message: "Usuário restringido." });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
