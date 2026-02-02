
import { db } from '../../../database';
import { API_BASE } from '../../../apiConfig';

/**
 * AtomicCounterService
 * Gerencia contadores numéricos para evitar o cálculo de .length em arrays gigantes.
 */
export const AtomicCounterService = {
    /**
     * Sincroniza o contador local e dispara atualização remota.
     */
    updateMemberCount: async (groupId: string, delta: number) => {
        const group = db.groups.findById(groupId);
        if (!group) return;

        // Atualização Otimista
        const currentCount = group.memberCount || group.memberIds?.length || 0;
        group.memberCount = Math.max(0, currentCount + delta);
        db.groups.update(group);

        // Sync em Background
        try {
            const action = delta > 0 ? 'increment' : 'decrement';
            fetch(`${API_BASE}/api/groups/${groupId}/${action}-members`, {
                method: 'POST'
            }).catch(() => {});
        } catch (e) {}
    }
};
