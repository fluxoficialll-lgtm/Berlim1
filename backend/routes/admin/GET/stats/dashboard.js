
import financial from './financial.js';
import content from './content.js';
import security from './security.js';
import users from './users.js';

/**
 * GET /api/admin/execute/stats/dashboard
 * Agregador de Snapshots. 
 * Invoca os submódulos internamente e consolida os resultados.
 */
export default async (req, res) => {
    try {
        // Função interna para capturar o retorno JSON dos módulos sem disparar requisições HTTP reais
        const capture = async (handler) => {
            try {
                let capturedData = null;
                const mockRes = { 
                    json: (body) => { capturedData = body.data; }, 
                    status: () => mockRes 
                };
                await handler(req, mockRes);
                return capturedData;
            } catch (e) {
                console.error(`[Dashboard Orchestrator] Sub-module fail:`, e.message);
                return null;
            }
        };

        // Execução paralela para performance máxima
        const [finData, contentData, secData, userData] = await Promise.all([
            capture(financial),
            capture(content),
            capture(security),
            capture(users)
        ]);

        res.json({
            success: true,
            timestamp: Date.now(),
            data: {
                financial: finData?.summary || {},
                content: contentData || {},
                security: secData || {},
                users: userData || {}
            }
        });
    } catch (e) {
        console.error("[Dashboard Orchestrator] Fatal Error:", e.message);
        res.status(500).json({ error: "Erro crítico ao consolidar dashboard: " + e.message });
    }
};
