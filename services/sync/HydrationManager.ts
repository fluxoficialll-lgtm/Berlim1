import { SyncState } from './SyncState';

/**
 * HydrationManager
 * Gerencia o estado de prontidão dos módulos vitais do app.
 * Impede que o usuário veja estados inconsistentes (ex: saldo 0) durante o carregamento inicial.
 */
class HydrationManager {
    private readyModules = new Set<string>();
    private listeners = new Set<(isReady: boolean) => void>();

    private readonly CRITICAL_MODULES = ['AUTH', 'GROUPS', 'WALLET'];

    public markReady(module: string) {
        this.readyModules.add(module);
        if (this.isFullyHydrated()) {
            this.notify(true);
        }
    }

    public isFullyHydrated(): boolean {
        return this.CRITICAL_MODULES.every(m => this.readyModules.has(m));
    }

    public subscribe(cb: (isReady: boolean) => void) {
        this.listeners.add(cb);
        return () => this.listeners.delete(cb);
    }

    private notify(isReady: boolean) {
        this.listeners.forEach(cb => cb(isReady));
    }

    public reset() {
        this.readyModules.clear();
        this.notify(false);
    }
}

export const hydrationManager = new HydrationManager();