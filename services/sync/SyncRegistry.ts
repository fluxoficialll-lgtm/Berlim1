
import { Group } from '../../types';

/**
 * Interface que todo serviço que precisa de sincronização deve implementar.
 */
export interface Syncable {
    name: string;
    sync: () => Promise<void>;
    priority: 'high' | 'low';
}

const registry: Syncable[] = [];

export const SyncRegistry = {
    register: (service: Syncable) => {
        if (!registry.find(s => s.name === service.name)) {
            registry.push(service);
        }
    },
    
    getServices: () => [...registry].sort((a, b) => {
        if (a.priority === 'high' && b.priority === 'low') return -1;
        if (a.priority === 'low' && b.priority === 'high') return 1;
        return 0;
    })
};
