
import { API_BASE } from '../../../apiConfig';
import { authService } from '../../authService';

export const GroupAuditService = {
    async logAction(groupId: string, action: string, targetInfo: string) {
        const user = authService.getCurrentUser();
        if (!user) return;

        try {
            await fetch(`${API_BASE}/api/audit/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    groupId,
                    adminId: user.id,
                    adminName: user.profile?.nickname || user.profile?.name || 'Admin',
                    action,
                    targetInfo
                })
            });
        } catch (e) {
            console.warn("[Audit] Failed to send remote log", e);
        }
    }
};
