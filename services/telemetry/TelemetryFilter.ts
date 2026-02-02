/**
 * TelemetryFilter
 * Filtra erros conhecidos e benignos para manter os logs críticos limpos.
 */

const BENIGN_ERROR_PATTERNS = [
    /ResizeObserver loop completed/i,
    /ResizeObserver loop limit exceeded/i,
    /Failed to fetch.*nominatim/i,
    /Failed to fetch.*ipapi/i,
    /Failed to fetch.*ipwho/i,
    /Geolocation error.*permission denied/i,
    /script error/i,
    /Non-Error exception captured/i
];

export const TelemetryFilter = {
    /**
     * Retorna true se o erro for relevante para rastreio.
     */
    shouldTrack: (error: any): boolean => {
        if (!error) return false;

        let message = '';
        if (typeof error === 'string') {
            message = error;
        } else if (error instanceof Error) {
            message = error.message;
        } else if (error.message) {
            message = String(error.message);
        } else {
            message = String(error);
        }
        
        // Verifica se a mensagem bate com algum padrão benigno conhecido
        const isBenign = BENIGN_ERROR_PATTERNS.some(pattern => pattern.test(message));
        
        return !isBenign;
    },

    /**
     * Classifica o nível de severidade do erro.
     */
    getSeverity: (error: Error | string): 'LOW' | 'MEDIUM' | 'CRITICAL' => {
        const message = String(error).toLowerCase();
        
        if (message.includes('auth') || message.includes('login') || message.includes('permission')) {
            return 'CRITICAL';
        }
        
        if (message.includes('fetch') || message.includes('network')) {
            return 'MEDIUM';
        }

        return 'LOW';
    }
};