
import { eventCollectorService } from '../eventCollectorService';
import { stateLogger } from './StateLogger';

/**
 * EventTracker: Centraliza o envio de telemetria rica.
 * Adiciona automaticamente o rastro do usuário (breadcrumbs) aos erros.
 */
export const eventTracker = {
    /**
     * Rastreia um erro crítico com snapshot de estado.
     */
    trackCriticalError: (error: Error | string, context: string) => {
        const errorMsg = typeof error === 'string' ? error : error.message;
        const stack = error instanceof Error ? error.stack : undefined;

        console.error(`🚨 [EventTracker] Critical Error in ${context}:`, errorMsg);

        eventCollectorService.track('user_error', {
            context,
            message: errorMsg,
            stack,
            breadcrumbs: stateLogger.getSnapshot(),
            url: window.location.href,
            ua: navigator.userAgent
        });
    },

    /**
     * Rastreia uma ação de negócio importante.
     */
    trackAction: (actionName: string, data?: any) => {
        stateLogger.push(actionName, 'interaction', data);
        eventCollectorService.track('system_health_check', {
            action: actionName,
            ...data
        });
    }
};
