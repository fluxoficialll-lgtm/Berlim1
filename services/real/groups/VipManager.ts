
import { db } from '@/database';

export const VipManager = {
    checkVipStatus(groupId: string, userId: string): 'active' | 'none' | 'expired' | 'grace_period' {
        const access = db.vipAccess.get(userId, groupId);
        if (!access) return 'none';
        if (access.status === 'active') {
            if (access.expiresAt && Date.now() > access.expiresAt) {
                if (Date.now() - access.expiresAt < 24 * 60 * 60 * 1000) return 'grace_period';
                return 'expired';
            }
            return 'active';
        }
        return 'none';
    }
};
