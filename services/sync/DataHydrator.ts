
import { sqlite } from '../../database/engine';
import { API_BASE } from '../../apiConfig';

/**
 * DataHydrator: O sincronizador inteligente.
 * Garante que o LocalStorage não fique obsoleto após um servidor reiniciar.
 */
export const dataHydrator = {
    /**
     * Sincroniza tabelas específicas buscando apenas o que mudou (Deltas).
     */
    async hydrate(table: string) {
        const localData = sqlite.getTableData(table);
        
        // Pega o timestamp do item mais recente que temos localmente
        const lastSync = localData.reduce((max, item) => 
            Math.max(max, item.updated_at || item.timestamp || 0), 0
        );

        try {
            const response = await fetch(`${API_BASE}/api/sync/delta?table=${table}&since=${lastSync}`);
            if (response.ok) {
                const { deltas } = await response.json();
                
                if (deltas && deltas.length > 0) {
                    console.log(`♻️ [Hydrator] Aplicando ${deltas.length} atualizações na tabela ${table}`);
                    
                    // Merge inteligente: substitui se já existe, adiciona se é novo
                    const updatedData = [...localData];
                    deltas.forEach((remoteItem: any) => {
                        const index = updatedData.findIndex(i => i.id === remoteItem.id);
                        if (index > -1) {
                            updatedData[index] = { ...updatedData[index], ...remoteItem };
                        } else {
                            updatedData.push(remoteItem);
                        }
                    });

                    sqlite.saveTableData(table, updatedData);
                }
            }
        } catch (e) {
            console.warn(`[Hydrator] Falha ao sincronizar ${table}. Operando em modo offline.`);
        }
    },

    /**
     * Boot de resiliência total.
     */
    async hydrateAll() {
        const tables = ['users', 'groups', 'posts', 'marketplace'];
        await Promise.all(tables.map(t => this.hydrate(t)));
    }
};
