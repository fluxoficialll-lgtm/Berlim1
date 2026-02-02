
/**
 * TRAFFIC LOGGER - Fluxo de Dados e Payloads
 */
export const trafficLogger = {
    logInbound: (req) => {
        const isHealthCheck = (req.path === '/' || req.path === '/api/ping') && (req.method === 'GET' || req.method === 'HEAD');
        const traceId = req.headers['x-flux-trace-id'] || 'no-trace';
        
        if (isHealthCheck) {
            // Log de batimento cardíaco (opcional: você pode comentar para limpar o painel)
            console.log(`[HEALTH] 💓 PING | ${req.method} ${req.path} | Trace: ${traceId}`);
            return;
        }

        const size = req.headers['content-length'] || 0;
        console.log(`[INBOUND] 📡 REQUEST | ${req.method} ${req.path} | Size: ${size}b | Trace: ${traceId}`);
    },

    logOutbound: (req, res, duration) => {
        const traceId = req.headers['x-flux-trace-id'] || 'no-trace';
        const isHealthCheck = (req.path === '/' || req.path === '/api/ping');
        
        if (isHealthCheck) return; // Silencia saída de pings para não poluir

        const statusIcon = res.statusCode < 400 ? '✅' : '❌';
        const statusType = res.statusCode < 400 ? 'SUCCESS' : 'FAILURE';

        console.log(`[OUTBOUND] ${statusIcon} ${statusType} | ${res.statusCode} | ${req.method} ${req.path} | ${duration}ms | Trace: ${traceId}`);
    },

    logCors: (req) => {
        console.log(`[SECURITY] 🛡️ CORS_PREFLIGHT | Origin: ${req.headers.origin || 'unknown'}`);
    }
};
