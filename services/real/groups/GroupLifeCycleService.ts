
import { db } from '@/database';
import { Group, AuditLog } from '../../../types';
import { ROLE_WEIGHTS } from '../../../constants/RoleWeights';
import { GroupCore } from './GroupCore';

export const GroupLifeCycleService = {
    /**
     * Processa a saída de um membro e decide o destino do grupo.
     */
    async processDeparture(groupId: string, userId: string): Promise<{ action: 'left' | 'transferred' | 'dissolved' }> {
        const group = db.groups.findById(groupId);
        if (!group) throw new Error("Grupo não encontrado.");

        const isOwner = group.creatorId === userId;
        const remainingMemberIds = (group.memberIds || []).filter(id => id !== userId);

        // 1. Verificar se era o último membro
        if (remainingMemberIds.length === 0) {
            await GroupCore.deleteGroup(groupId);
            return { action: 'dissolved' };
        }

        // 2. Se o dono está saindo, precisamos de um sucessor
        if (isOwner) {
            const newOwnerId = this.calculateSuccessor(group, userId);
            
            // Atualiza o grupo com o novo dono
            group.creatorId = newOwnerId;
            group.memberIds = remainingMemberIds;
            
            // Adiciona na minutista
            const log: AuditLog = {
                id: `log_${Date.now()}`,
                adminId: 'system',
                adminName: 'Flux Intelligence',
                action: 'TROCA_POSSE_AUTO',
                target: `O dono anterior saiu. Nova posse transferida para o membro mais forte.`,
                timestamp: Date.now()
            };
            group.auditLogs = [log, ...(group.auditLogs || [])];
            
            await GroupCore.updateGroup(group);
            return { action: 'transferred' };
        }

        // 3. Saída de membro comum
        group.memberIds = remainingMemberIds;
        group.adminIds = (group.adminIds || []).filter(id => id !== userId);
        
        await GroupCore.updateGroup(group);
        return { action: 'left' };
    },

    /**
     * Algoritmo de Sucessão: Escolhe o membro mais forte ou sorteia entre iguais.
     */
    // Fix: Removed 'private' modifier which is not allowed in object literals
    calculateSuccessor(group: Group, leavingUserId: string): string {
        const allMembers = group.memberIds || [];
        const remaining = allMembers.filter(id => id !== leavingUserId);
        
        const candidates = remaining.map(id => {
            let role = 'Membro';
            if (group.adminIds?.includes(id)) role = 'Admin';
            // Nota: Lógica de 'Moderador' pode ser expandida aqui via roles
            return { id, weight: ROLE_WEIGHTS[role] || 10 };
        });

        // Encontra o maior peso presente entre os restantes
        const maxWeight = Math.max(...candidates.map(c => c.weight));
        
        // Filtra todos que possuem esse peso máximo (empate)
        const finalists = candidates.filter(c => c.weight === maxWeight);

        // Seleção aleatória em caso de empate de peso
        const chosen = finalists[Math.floor(Math.random() * finalists.length)];
        
        return chosen.id;
    }
};
