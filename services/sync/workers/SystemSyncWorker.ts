
import { notificationService } from '../../notificationService';
import { authService } from '../../authService';
import { API_BASE } from '../../../apiConfig';
import { db } from '../../../database';
import { hydrationManager } from '../HydrationManager';

export const SystemSyncWorker = {
    name: 'SystemWorker',

    async syncHighPriority() {
        const email = authService.getCurrentUserEmail();
        if (!email) {
            hydrationManager.markReady('AUTH');
            return;
        }

        try {
            // Executamos a sincronização de integridade primeiro pois ela popula o perfil
            await Promise.all([
                this.syncIntegrityStatus(email),
                this.syncNotifications()
            ]);
        } catch (e) {
            console.warn("⚠️ [Sync] Falha no check de sistema:", e);
        } finally {
            hydrationManager.markReady('AUTH');
        }
    },

    async syncNotifications() {
        console.log("🔔 [Sync] Sincronizando notificações...");
        await notificationService.syncNotifications();
    },

    async syncIntegrityStatus(email: string) {
        try {
            const res = await fetch(`${API_BASE}/api/users/update?email=${encodeURIComponent(email)}`);
            if (res.ok) {
                const data = await res.json();
                const user = data.user;
                
                if (user) {
                    if (user.isBanned) {
                        authService.logout();
                        window.location.reload();
                        return;
                    }
                    
                    // CRÍTICO: Sincroniza o cache local com os dados reais do Postgres
                    console.log("♻️ [Sync] Hidratando perfil do usuário via PostgreSQL");
                    db.users.set(user);
                    localStorage.setItem('cached_user_profile', JSON.stringify(user));
                    localStorage.setItem('user_id', user.id);
                }
            }
        } catch (e) {
            console.warn("⚠️ [Sync] Falha ao verificar integridade, mantendo estado local.");
        }
    }
};
