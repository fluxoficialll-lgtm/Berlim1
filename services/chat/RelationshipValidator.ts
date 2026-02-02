
import { db } from '../../database';
import { groupService } from '../groupService';
import { chatService } from '../chatService';

export const RelationshipValidator = {
    /**
     * Valida se a interação entre dois usuários é permitida.
     */
    canInteract: (myId: string, targetId: string): { allowed: boolean; reason?: string } => {
        // 1. Checa bloqueio mútuo no banco local/cache
        const isBlocked = chatService.hasBlockingRelationship(myId, targetId);
        if (isBlocked) {
            return { allowed: false, reason: 'BLOCK_ACTIVE' };
        }

        // 2. Aqui poderiam entrar regras de "Somente seguidores" ou "Privacidade"
        return { allowed: true };
    },

    /**
     * Valida se o usuário ainda tem permissão para postar em um grupo/canal específico.
     */
    canPostInGroup: (userId: string, groupId: string, channelId?: string): boolean => {
        const group = groupService.getGroupById(groupId);
        if (!group) return false;

        const isOwner = group.creatorId === userId;
        const isAdmin = group.adminIds?.includes(userId);

        // Se o grupo é VIP e o usuário não é admin, checa o acesso
        if (group.isVip && !isOwner && !isAdmin) {
            const vipStatus = groupService.checkVipStatus(groupId, userId);
            if (vipStatus !== 'active' && vipStatus !== 'grace_period') return false;
        }

        // Checa se o canal específico é "Apenas Admins"
        if (channelId && channelId !== 'general') {
            const channel = group.channels?.find(c => c.id === channelId);
            if (channel?.onlyAdminsPost && !isAdmin && !isOwner) return false;
        }

        // Checa configuração global do grupo
        if (group.settings?.onlyAdminsPost && !isAdmin && !isOwner) return false;

        return true;
    }
};
