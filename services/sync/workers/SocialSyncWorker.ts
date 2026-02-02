
import { groupService } from '../../groupService';
import { chatService } from '../../chatService';
import { relationshipService } from '../../relationshipService';
import { authService } from '../../authService';
import { hydrationManager } from '../HydrationManager';

export const SocialSyncWorker = {
    name: 'SocialWorker',
    
    async syncHighPriority() {
        const email = authService.getCurrentUserEmail();
        
        try {
            // Grupos e Chats são essenciais para a comunicação
            await Promise.all([
                groupService.fetchGroups().catch(() => {}),
                email ? chatService.syncChats().catch(() => {}) : Promise.resolve()
            ]);
        } finally {
            // Garante liberação do carregamento mesmo se a API falhar
            hydrationManager.markReady('GROUPS');
        }
    },

    async syncLowPriority() {
        const email = authService.getCurrentUserEmail();
        
        try {
            // Relacionamentos e diretório de usuários podem carregar depois
            await Promise.all([
                relationshipService.syncRelationships().catch(() => {}),
                authService.syncRemoteUsers().catch(() => {})
            ]);
        } catch (e) {
            console.warn("👥 [Sync] Falha no background sync social.");
        }
    }
};
