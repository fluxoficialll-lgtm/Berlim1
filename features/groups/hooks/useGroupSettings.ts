
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { groupService } from '../../../services/groupService';
import { authService } from '../../../services/authService';
import { db } from '../../../database';
import { useModal } from '../../../components/ModalSystem';
import { Group } from '../../../types';
import { GroupLifeCycleService } from '../../../services/real/groups/GroupLifeCycleService';

// Sub-hooks modulares
import { useGroupIdentity } from './settings/useGroupIdentity';
import { useGroupModeration } from './settings/useGroupModeration';
import { useGroupVIP } from './settings/useGroupVIP';
import { useGroupStructure } from './settings/useGroupStructure';
import { useGroupMembers } from './settings/useGroupMembers';

export const useGroupSettings = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { showAlert, showConfirm } = useModal();
    const [group, setGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);
    
    const [isOwner, setIsOwner] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const identity = useGroupIdentity(group);
    const moderation = useGroupModeration(group);
    const vip = useGroupVIP(group);
    const structure = useGroupStructure(group);
    const members = useGroupMembers(group);

    useEffect(() => {
        if (id) {
            const currentUserId = authService.getCurrentUserId();
            const found = groupService.getGroupById(id);
            if (found) {
                setGroup(found);
                const owner = found.creatorId === currentUserId;
                const admin = owner || (currentUserId && found.adminIds?.includes(currentUserId)) || false;
                setIsOwner(owner);
                setIsAdmin(admin);
            }
            setLoading(false);
        }
    }, [id]);

    const handleSave = async () => {
        if (!group) return;
        const updatedGroup: Group = {
            ...group,
            ...identity.getIdentityPayload(),
            ...moderation.getModerationPayload(),
            ...vip.getVipPayload(),
            ...structure.getStructurePayload(),
            ...members.getMembersPayload()
        };
        await groupService.updateGroup(updatedGroup);
        await showAlert('Sucesso', 'Configurações sincronizadas.');
    };

    const handleLeaveDelete = async (type: 'leave' | 'delete') => {
        if (!group || !id) return;

        const currentUserId = authService.getCurrentUserId();
        if (!currentUserId) return;

        const memberCount = group.memberIds?.length || 0;

        // Caso 1: Usuário tentando sair
        if (type === 'leave') {
            let title = "Sair do Grupo";
            let message = "Deseja realmente sair desta comunidade?";
            let confirmText = "Sair";

            // Se for o último membro
            if (memberCount === 1) {
                title = "⚠️ Aviso Crítico";
                message = "Você é o último membro. Se sair agora, o grupo e todo o histórico serão APAGADOS permanentemente. Confirmar?";
                confirmText = "Apagar e Sair";
            } else if (isOwner) {
                message = "Você é o dono deste grupo. Ao sair, a posse será transferida automaticamente para o administrador ou membro mais forte. Continuar?";
            }

            if (await showConfirm(title, message, confirmText, "Cancelar")) {
                const result = await GroupLifeCycleService.processDeparture(id, currentUserId);
                if (result.action === 'dissolved') {
                    await showAlert("Grupo Encerrado", "O grupo foi removido pois não restaram membros.");
                }
                navigate('/groups');
            }
        } 
        
        // Caso 2: Dono querendo deletar manualmente
        else if (type === 'delete') {
            if (await showConfirm("EXCLUIR GRUPO", "Esta ação apagará o grupo para TODOS os membros imediatamente. Não há volta. Confirmar?", "Excluir Tudo", "Cancelar")) {
                await groupService.deleteGroup(id);
                navigate('/groups');
            }
        }
    };

    const handleMemberAction = (userId: string, action: 'kick' | 'ban' | 'promote' | 'demote') => {
        if (!id) return;
        if (action === 'kick') groupService.removeMember(id, userId);
        else if (action === 'ban') groupService.banMember(id, userId);
        else if (action === 'promote') groupService.promoteMember(id, userId);
        else if (action === 'demote') groupService.demoteMember(id, userId);
        members.actions.refreshMembers(id);
    };

    // --- FIX: Missing handlePendingAction implementation for GroupAccessPage ---
    const handlePendingAction = async (userId: string, action: 'accept' | 'deny') => {
        if (!id) return;
        if (action === 'accept') {
            groupService.approveMember(id, userId);
        } else {
            groupService.rejectMember(id, userId);
        }
        members.actions.refreshMembers(id);
    };

    // --- FIX: Missing handleManualRelease implementation for GroupVipPage ---
    const handleManualRelease = async (username: string): Promise<boolean> => {
        if (!username.trim() || !group) return false;
        const cleanHandle = username.replace('@', '').toLowerCase().trim();
        const targetUser = await authService.fetchUserByHandle(cleanHandle);
        
        if (targetUser) {
            db.vipAccess.grant({
                userId: targetUser.id,
                groupId: group.id,
                status: 'active',
                purchaseDate: Date.now(),
                transactionId: `manual_${Date.now()}_admin`
            });
            groupService.approveMember(group.id, targetUser.id);
            members.actions.refreshMembers(group.id);
            await showAlert("Sucesso", `Acesso VIP liberado para @${cleanHandle}`);
            return true;
        } else {
            await showAlert("Erro", "Usuário não encontrado.");
            return false;
        }
    };

    const form = {
        ...identity.state, ...identity.actions,
        ...moderation.state, ...moderation.actions,
        ...vip.state, ...vip.actions,
        ...structure.state, ...structure.actions,
        ...members.state, ...members.actions,
    };

    return { 
        group, 
        loading, 
        isOwner, 
        isAdmin, 
        handleSave, 
        handleLeaveDelete, 
        handleMemberAction, 
        handlePendingAction, // Fixed: Added to return object
        handleManualRelease, // Fixed: Added to return object
        form 
    };
};
