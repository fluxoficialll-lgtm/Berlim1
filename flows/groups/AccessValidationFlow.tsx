
import { useNavigate } from 'react-router-dom';
import { groupService } from '../../services/groupService';
import { authService } from '../../services/authService';

export const useAccessValidationFlow = () => {
    const navigate = useNavigate();

    const validateGroupAccess = (groupId: string): boolean => {
        const currentUserId = authService.getCurrentUserId();
        const group = groupService.getGroupById(groupId);

        if (!group || !currentUserId) {
            navigate('/groups');
            return false;
        }

        const isOwner = group.creatorId === currentUserId;
        const isAdmin = group.adminIds?.includes(currentUserId);

        // Se for VIP, verifica status de pagamento
        if (group.isVip && !isOwner && !isAdmin) {
            const status = groupService.checkVipStatus(groupId, currentUserId);
            
            if (status === 'none' || status === 'expired') {
                navigate(`/vip-group-sales/${groupId}`);
                return false;
            }
        }

        return true;
    };

    const navigateToGroupEntry = (groupId: string) => {
        const group = groupService.getGroupById(groupId);
        if (!group) return;

        // Decide se abre o Hub de Canais ou o Chat Direto
        const hasMultipleChannels = group.channels && group.channels.length > 0;
        
        if (group.isSalesPlatformEnabled) {
            navigate(`/group-platform/${groupId}`);
        } else if (hasMultipleChannels) {
            navigate(`/group/${groupId}/channels`);
        } else {
            navigate(`/group-chat/${groupId}`);
        }
    };

    return { validateGroupAccess, navigateToGroupEntry };
};
