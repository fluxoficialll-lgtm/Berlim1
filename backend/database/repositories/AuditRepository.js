
import { query } from '../pool.js';

export const AuditRepository = {
    async createLog({ groupId, adminId, adminName, action, targetInfo }) {
        await query(`
            INSERT INTO audit_logs (group_id, admin_id, admin_name, action, target_info)
            VALUES ($1, $2, $3, $4, $5)
        `, [groupId, adminId, adminName, action, targetInfo]);
        return true;
    },

    async getLogsByGroup(groupId, limit = 50) {
        const res = await query(`
            SELECT * FROM audit_logs 
            WHERE group_id = $1 
            ORDER BY timestamp DESC 
            LIMIT $2
        `, [groupId, limit]);
        return res.rows;
    }
};
