
import { db } from '../../../database';
import { VipAccess } from '../../../types';

/**
 * VipManagementService: Especialista em ciclo de vida de assinaturas.
 */
export const VipManagementService = {
    /**
     * Verifica se o acesso está ativo, lidando com prazos de carência.
     */
    checkAccess: (userId: string, groupId: string): 'active' | 'none' | 'expired' | 'grace_period' => {
        const access = db.vipAccess.get(userId, groupId);
        if (!access) return 'none';
        
        const now = Date.now();
        const GRACE_PERIOD_MS = 24 * 60 * 60 * 1000; // 24h de tolerância

        if (access.status === 'active') {
            if (access.expiresAt && now > access.expiresAt) {
                return (now - access.expiresAt < GRACE_PERIOD_MS) ? 'grace_period' : 'expired';
            }
            return 'active';
        }
        return 'none';
    },

    /**
     * Calcula o tempo restante de acesso para exibição na UI.
     */
    getRemainingDays: (userId: string, groupId: string): number => {
        const access = db.vipAccess.get(userId, groupId);
        if (!access?.expiresAt) return 0;
        const diff = access.expiresAt - Date.now();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    },

    /**
     * Registra uma nova venda ou renovação.
     */
    grantAccess: async (userId: string, groupId: string, txId: string, durationDays?: number) => {
        const expiresAt = durationDays ? Date.now() + (durationDays * 24 * 60 * 60 * 1000) : undefined;
        
        const access: VipAccess = {
            userId,
            groupId,
            status: 'active',
            purchaseDate: Date.now(),
            transactionId: txId,
            expiresAt
        };

        db.vipAccess.grant(access);
    }
};
