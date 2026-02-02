
import { Group, User } from '../../types';
import { ROLE_WEIGHTS } from '../../constants/RoleWeights';

/**
 * PermissionGuard
 * Única fonte de verdade para autorização, unificando sistema de Roles e Fallback Legacy.
 */
export const PermissionGuard = {
    /**
     * Verifica se o usuário tem permissão para uma ação.
     */
    can: (userId: string | null, group: Group, action: string): boolean => {
        if (!userId) return false;

        // 1. Dono ignora todas as travas
        if (group.creatorId === userId) return true;

        // 2. Resolve o cargo dinâmico (Role System)
        const userRoleId = (group as any).userRoles?.[userId];
        const role = group.roles?.find(r => r.id === userRoleId);

        // 3. Matriz de Decisão unificada
        switch (action) {
            case 'EDIT_GROUP':
            case 'MANAGE_ROLES':
                return role?.permissions.canEditGroupInfo || group.adminIds?.includes(userId) || false;
            
            case 'POST_MESSAGE':
                if (group.settings?.onlyAdminsPost) {
                    return role?.permissions.isAdmin || group.adminIds?.includes(userId) || false;
                }
                return true;

            case 'KICK_MEMBERS':
                return role?.permissions.canKickMembers || group.adminIds?.includes(userId) || false;

            case 'VIEW_REVENUE':
                return role?.permissions.canViewRevenue || false; // Apenas se a role permitir explicitamente

            default:
                return false;
        }
    },

    /**
     * Compara autoridade hierárquica para ações de moderação.
     */
    hasAuthorityOver: (actorId: string, targetId: string, group: Group): boolean => {
        const getWeight = (id: string) => {
            if (group.creatorId === id) return 100;
            if (group.adminIds?.includes(id)) return 70;
            return 10;
        };

        return getWeight(actorId) > getWeight(targetId);
    }
};
