
import { dbManager } from '../../../../databaseManager.js';

/**
 * POST /api/admin/execute/finance/gateways
 * Ativa ou desativa gateways de pagamento na plataforma.
 */
export default async (req, res) => {
    try {
        const { activeGateways } = req.body;

        if (!activeGateways || !Array.isArray(activeGateways)) {
            return res.status(400).json({ error: "Lista de gateways inválida." });
        }

        // Busca configuração atual
        const currentRes = await dbManager.query("SELECT value FROM platform_settings WHERE key = 'system_config'");
        let config = currentRes.rows[0]?.value || {};
        
        config.activeGateways = activeGateways;

        await dbManager.query(
            "INSERT INTO platform_settings (key, value) VALUES ('system_config', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
            [JSON.stringify(config)]
        );

        console.log(`🏦 [Gateways] Configuração atualizada: ${activeGateways.join(', ')}`);

        res.json({ 
            success: true, 
            activeGateways: config.activeGateways 
        });
    } catch (e) {
        console.error("[Admin POST finance/gateways] Error:", e.message);
        res.status(500).json({ error: "Erro ao atualizar gateways." });
    }
};
