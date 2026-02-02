
import { Group } from '../../types';
import { db } from '../../database';
import { ROLE_WEIGHTS } from '../../constants/RoleWeights';

/**
 * AccessPolicy Engine
 * Centraliza a lógica de "quem pode fazer o quê" no ecossistema Flux.
 */
export const AccessPolicy = {
    
    // --- BASIC CHECKERS ---

    isOwner(userId: string | null, group: Group): boolean {
        if (!userId) return false;
        return group.creatorId === userId;
    },

    /**
     * Unificação de Estado Administrativo (Incoerência 4)
     * Agora checa tanto o array legado adminIds quanto o novo sistema de Cargos (Roles).
     */
    isAdmin(userId: string | null, group: Group): boolean {
        if (!userId) return false;
        if (this.isOwner(userId, group)) return true;
        
        // 1. Checa no array fixo de IDs (Legado)
        const isLegacyAdmin = group.adminIds?.includes(userId) || false;
        if (isLegacyAdmin) return true;

        // 2. Checa no sistema de Cargos (Roles) - NOVO ✅
        // Se o usuário tem um cargo atribuído que possui a permissão 'isAdmin' ativa
        const userRoleId = (group as any).userRoles?.[userId]; // Mapeamento usuário -> roleId
        if (userRoleId && group.roles) {
            const role = group.roles.find(r => r.id === userRoleId);
            if (role?.permissions.isAdmin) return true;
        }

        return false;
    },

    /**
     * Retorna o peso numérico do cargo do usuário dentro do grupo.
     */
    getUserAuthorityWeight(userId: string | null, group: Group): number {
        if (!userId) return 0;
        if (this.isOwner(userId, group)) return ROLE_WEIGHTS['Dono'];
        
        // Busca peso dinâmico baseado no cargo atribuído
        const userRoleId = (group as any).userRoles?.[userId];
        if (userRoleId && group.roles) {
            const role = group.roles.find(r => r.id === userRoleId);
            if (role) return role.permissions.isAdmin ? ROLE_WEIGHTS['Admin'] : (role.priority * 10);
        }

        if (this.isAdmin(userId, group)) return ROLE_WEIGHTS['Admin'];
        
        return ROLE_WEIGHTS['Membro'];
    },

    // --- CONTENT ACCESS ---

    /**
     * Define se o usuário pode visualizar o chat e mídias do grupo.
     */
    canViewContent(userId: string | null, group: Group): boolean {
        if (this.isOwner(userId, group)) return true;
        if (!group.isVip && !group.isPrivate) return true; // Público
        
        if (!userId) return false;

        // Se for VIP, precisa ter assinatura ativa no banco
        if (group.isVip) {
            return db.vipAccess.check(userId, group.id);
        }

        // Se for privado, precisa estar na lista de membros
        return group.memberIds?.includes(userId) || false;
    },

    /**
     * Define se o usuário pode enviar mensagens em um canal específico.
     */
    canPostMessage(userId: string | null, group: Group, channelId?: string): boolean {
        if (!userId) return false;
        
        // Administradores e Donos ignoram restrições de chat
        if (this.isAdmin(userId, group)) return true;

        // Regra Global: Grupo configurado como "Apenas Admins"
        if (group.settings?.onlyAdminsPost) return false;

        // Regra de Canal: Canal configurado como "Apenas Admins"
        if (channelId && channelId !== 'general') {
            const channel = group.channels?.find(c => c.id === channelId);
            if (channel?.onlyAdminsPost) return false;
        }

        return true;
    },

    // --- MANAGEMENT & MODERATION ---

    /**
     * Define se o usuário pode acessar a tela de configurações e editar dados do grupo.
     */
    canManageSettings(userId: string | null, group: Group): boolean {
        return this.isAdmin(userId, group);
    },

    /**
     * Define se o usuário A pode realizar uma ação (kick/ban/promote) no usuário B.
     */
    canModerateTarget(actorId: string | null, targetId: string, group: Group): boolean {
        if (!actorId) return false;
        if (actorId === targetId) return false; 

        const actorWeight = this.getUserAuthorityWeight(actorId, group);
        const targetWeight = this.getUserAuthorityWeight(targetId, group);

        // Um moderador só age sobre alguém de peso estritamente menor.
        return actorWeight > targetWeight;
    },

    /**
     * Define se o usuário pode ver os logs de faturamento do grupo.
     */
    canViewRevenue(userId: string | null, group: Group): boolean {
        return this.isOwner(userId, group);
    },

    /**
     * Define se o usuário pode criar canais ou pastas (Modo Plataforma).
     */
    canManageStructure(userId: string | null, group: Group): boolean {
        return this.isAdmin(userId, group);
    }
};
