import { eventTracker } from './EventTracker';
import { stateLogger } from './StateLogger';

/**
 * NetworkInterceptor: Wrapper global para a Fetch API.
 * Adiciona rastreabilidade a cada requisição de saída.
 */
export const initNetworkInterceptor = () => {
    const originalFetch = window.fetch;

    // Se o fetch original não existir, não há o que interceptar
    if (!originalFetch) return;

    const interceptedFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        const url = typeof input === 'string' 
            ? input 
            : (input instanceof URL ? input.href : (input as Request).url);
            
        const start = performance.now();
        const requestId = crypto.randomUUID();

        // Evita logar o próprio coletor para não entrar em loop infinito
        const isTelemetry = url.includes('/api/events/ingest');

        try {
            const response = await originalFetch(input, init);
            const duration = performance.now() - start;

            if (!isTelemetry) {
                stateLogger.push(`API_CALL: ${url}`, 'api', { 
                    status: response.status, 
                    duration: `${duration.toFixed(0)}ms`,
                    requestId 
                });

                // Loga performance se a API estiver lenta (> 2s)
                if (duration > 2000) {
                    eventTracker.trackAction('SLOW_API_DETECTED', { url, duration, requestId });
                }
            }

            return response;
        } catch (error: any) {
            if (!isTelemetry) {
                // Ignore geolocation and maps failures as critical errors (common with adblockers)
                const lowerUrl = url.toLowerCase();
                const isGeo = 
                    lowerUrl.includes('ipapi.co') || 
                    lowerUrl.includes('ipwho.is') || 
                    lowerUrl.includes('nominatim') || 
                    lowerUrl.includes('openstreetmap.org') ||
                    lowerUrl.includes('geo.api');

                if (isGeo) {
                    stateLogger.push(`GEO_FETCH_FAIL (Likely AdBlock/Browser Block): ${url}`, 'system');
                } else {
                    eventTracker.trackCriticalError(error, `NETWORK_FETCH_FAILURE: ${url}`);
                }
            }
            throw error;
        }
    };

    try {
        // Tenta atribuição direta (padrão na maioria dos navegadores)
        (window as any).fetch = interceptedFetch;
    } catch (e) {
        // Fallback para ambientes onde 'fetch' é definido apenas como getter
        try {
            Object.defineProperty(window, 'fetch', {
                value: interceptedFetch,
                configurable: true,
                writable: true,
                enumerable: true
            });
        } catch (err) {
            console.warn("⚠️ [NetworkInterceptor] Não foi possível interceptar a Fetch API. Telemetria de rede desativada.");
        }
    }
};