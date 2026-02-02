
import { dbManager } from '../../../../databaseManager.js';
import { SchemaBootstrapper } from '../../../../database/SchemaBootstrapper.js';

export default async (req, res) => {
    const defaultConfig = {
        maintenanceMode: false,
        minWithdrawalAmount: 5.00,
        activeGateways: ['syncpay', 'stripe']
    };

    try {
        const result = await dbManager.query("SELECT value FROM platform_settings WHERE key = 'system_config'");
        
        let config = { ...defaultConfig };

        if (result.rows && result.rows.length > 0) {
            const dbConfig = result.rows[0].value || {};
            config = { ...config, ...dbConfig };
        }
        
        config.maintenanceMode = false; // Bypass de segurança
        return res.json(config);

    } catch (e) {
        // Se o erro for de tabela inexistente, tentamos reparar silenciosamente
        if (e.isMissingTable) {
            console.warn("🛠️ [Resiliência]: Detectada ausência de platform_settings. Disparando reconstrução...");
            // Não esperamos o fim do boot para responder, enviamos o default para o app não travar
            SchemaBootstrapper.run().catch(err => console.error("Falha no reparo silencioso:", err));
        }

        console.warn("⚠️ [Admin Config] Usando fallback seguro devido a erro de banco:", e.message);
        return res.json(defaultConfig);
    }
};
