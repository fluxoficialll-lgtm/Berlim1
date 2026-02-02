
/**
 * StateLogger: O gravador de caixa-preta do Flux.
 * Mantém um histórico circular das últimas ações do usuário para prover contexto em erros.
 */

interface UserBreadcrumb {
    timestamp: number;
    action: string;
    category: 'navigation' | 'interaction' | 'api' | 'system';
    data?: any;
}

class StateLogger {
    private buffer: UserBreadcrumb[] = [];
    private readonly MAX_LOGS = 15;

    public push(action: string, category: UserBreadcrumb['category'] = 'interaction', data?: any) {
        const entry: UserBreadcrumb = {
            timestamp: Date.now(),
            action,
            category,
            data
        };

        this.buffer.push(entry);
        if (this.buffer.length > this.MAX_LOGS) {
            this.buffer.shift();
        }

        // Em dev, espelhamos no console de forma discreta
        if (process.env.NODE_ENV !== 'production') {
            console.debug(`[Telemetry:${category}] ${action}`, data || '');
        }
    }

    public getSnapshot(): UserBreadcrumb[] {
        return [...this.buffer];
    }

    public clear() {
        this.buffer = [];
    }
}

export const stateLogger = new StateLogger();
