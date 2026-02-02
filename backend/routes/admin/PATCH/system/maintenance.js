
import { dbManager } from '../../../../databaseManager.js';

export default async (req, res) => {
    try {
        const { enabled, message } = req.body;
        const currentRes = await dbManager.query("SELECT value FROM platform_settings WHERE key = 'system_config'");
        let config = currentRes.rows[0]?.value || {};
        config.maintenanceMode = !!enabled;
        if (message) config.maintenanceMessage = message;

        await dbManager.query(
            "INSERT INTO platform_settings (key, value) VALUES ('system_config', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
            [JSON.stringify(config)]
        );
        res.json({ success: true, maintenanceMode: config.maintenanceMode });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
