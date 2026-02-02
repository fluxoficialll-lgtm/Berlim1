
const SYNC_METADATA_KEY = 'flux_sync_metadata';

interface SyncMetadata {
    lastFullSync: number;
    lastDeltaSync: number;
    serviceCheckpoints: Record<string, number>;
}

export const SyncState = {
    getMetadata: (): SyncMetadata => {
        const raw = localStorage.getItem(SYNC_METADATA_KEY);
        return raw ? JSON.parse(raw) : {
            lastFullSync: 0,
            lastDeltaSync: 0,
            serviceCheckpoints: {}
        };
    },

    updateCheckpoint: (serviceName: string) => {
        const meta = SyncState.getMetadata();
        meta.serviceCheckpoints[serviceName] = Date.now();
        meta.lastDeltaSync = Date.now();
        localStorage.setItem(SYNC_METADATA_KEY, JSON.stringify(meta));
    },

    setFullSyncComplete: () => {
        const meta = SyncState.getMetadata();
        meta.lastFullSync = Date.now();
        localStorage.setItem(SYNC_METADATA_KEY, JSON.stringify(meta));
    },

    shouldDoFullSync: (): boolean => {
        const meta = SyncState.getMetadata();
        const oneHour = 60 * 60 * 1000;
        return (Date.now() - meta.lastFullSync) > oneHour;
    }
};
