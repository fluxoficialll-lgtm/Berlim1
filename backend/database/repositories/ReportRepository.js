
import { query } from '../pool.js';

export const ReportRepository = {
    async create({ targetId, reporterId, reason }) {
        await query(`
            INSERT INTO reports (target_id, reporter_id, reason)
            VALUES ($1, $2, $3)
        `, [targetId, reporterId, reason]);
    }
};
