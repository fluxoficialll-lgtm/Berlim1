import { MasterHealthService } from '../../../../services/admin/MasterHealthService.js';

/**
 * GET /api/admin/execute/system/master-health
 */
export default async (req, res) => {
    try {
        const health = await MasterHealthService.checkAll();
        res.json({
            success: true,
            timestamp: Date.now(),
            data: health
        });
    } catch (e) {
        res.status(500).json({ error: "Falha ao auditar saúde financeira: " + e.message });
    }
};