
import { dbManager } from '../../../../databaseManager.js';

export default async (req, res) => {
    try {
        const sqlDbSize = "SELECT pg_database_size(current_database()) as size_bytes";
        const sqlHistory = "SELECT * FROM infrastructure_telemetry ORDER BY created_at DESC LIMIT 30";

        const [sizeRes, historyRes] = await Promise.all([
            dbManager.query(sqlDbSize),
            dbManager.query(sqlHistory)
        ]);

        res.json({
            success: true,
            data: {
                currentDatabaseSizeBytes: parseInt(sizeRes.rows[0].size_bytes),
                history: historyRes.rows
            }
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
