
import { AdminInfrastructureRepository } from '../../../../database/repositories/admin/AdminInfrastructureRepository.js';

/**
 * POST /api/admin/execute/system/snapshot-storage
 */
export default async (req, res) => {
    try {
        const success = await AdminInfrastructureRepository.recordSnapshot();
        if (success) {
            res.json({ success: true, message: "Métricas de armazenamento e DB capturadas." });
        } else {
            res.status(500).json({ error: "O motor de telemetria falhou ao ler o disco." });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
