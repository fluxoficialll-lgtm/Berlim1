
/**
 * BRIDGE LOGGER - Camada de Segurança e Validação de Tokens
 */
export const bridgeLogger = {
    logAccessGranted: (req, context) => {
        const clientId = req.headers['x-flux-client-id'] || 'unknown';
        console.log(`[AUTH] ✅ ACCESS_GRANTED | Mode: ${context} | Client: ${clientId}`);
    },

    logAccessRefused: (req, reason) => {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        console.warn(`[SECURITY] ❌ ACCESS_REFUSED | Reason: ${reason} | IP: ${ip} | Path: ${req.path}`);
    },

    logAuthMissing: (req) => {
        console.error(`[SECURITY] 🚫 AUTH_MISSING | Blocked: No credentials for ${req.path}`);
    }
};
