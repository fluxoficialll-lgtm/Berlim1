
import { db } from '../../../database';
import { User } from '../../../types';

/**
 * IdentityOrchestrator
 * Centraliza a resolução de identidade para garantir que UUID seja a única chave de relação.
 */
export const IdentityOrchestrator = {
    /**
     * Resolve um usuário completo a partir de qualquer identificador.
     */
    resolveUser: (identifier: string): User | undefined => {
        if (!identifier) return undefined;
        
        const allUsers = Object.values(db.users.getAll());
        const cleanId = identifier.toLowerCase().trim();

        return allUsers.find(u => 
            u.id === identifier || 
            u.email.toLowerCase() === cleanId || 
            u.profile?.name?.toLowerCase() === cleanId.replace('@', '')
        );
    },

    /**
     * Retorna o UUID garantido de um identificador.
     */
    getUuid: (identifier: string): string | undefined => {
        return IdentityOrchestrator.resolveUser(identifier)?.id;
    },

    /**
     * Retorna o identificador de exibição seguro (Handle).
     */
    getDisplayHandle: (identifier: string): string => {
        const user = IdentityOrchestrator.resolveUser(identifier);
        return user?.profile?.name ? `@${user.profile.name}` : 'usuário';
    }
};
