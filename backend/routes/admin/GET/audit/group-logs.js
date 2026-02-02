
import { dbManager } from '../../../../databaseManager.js';

/**
 * GET /api/admin/execute/audit/group-logs?groupId=...
 */
export default async (req, res) => {
    try {
        const { groupId } = req.query;
        if (!groupId) return res.status(400).json({ error: "groupId é obrigatório." });

        const logs = await dbManager.audit.getLogsByGroup(groupId);
        res.json({ success: true, logs });
    } catch (e) {
        res.status(500).json({ error: "Erro ao buscar logs de auditoria." });
    }
};
