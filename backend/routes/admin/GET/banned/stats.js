
/**
 * ROTA INTERMEDIÁRIA: Usuários Banidos
 * Categoria: banned
 * Ação: stats
 * Resolve: /api/admin/execute/banned/stats
 */

export default async (req, res) => {
    try {
        const coreUrl = process.env.CORE_API_URL;
        const adminToken = process.env.VITE_ADMIN_TOKEN || 'ADMIN_TOKEN_V3';

        if (!coreUrl) return res.status(500).json({ error: "CORE_API_URL não definida." });

        const response = await fetch(`${coreUrl.replace(/\/$/, '')}/v1/admin/users/banned-stats`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${adminToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`Core API Error: ${response.status}`);

        const rawData = await response.json();

        const normalizedData = {
            hoje: rawData.today_count || 0,
            ontem: rawData.yesterday_count || 0,
            d30: rawData.count_30d || 0,
            d60: rawData.count_60d || 0,
            d90: rawData.count_90d || 0,
            d180: rawData.count_180d || 0,
            total: rawData.total_lifetime || 0
        };

        res.json({ success: true, source: 'app_core_bridge', data: normalizedData });
    } catch (e) {
        res.status(502).json({ error: "Falha ao conectar com o serviço de dados.", details: e.message });
    }
};
