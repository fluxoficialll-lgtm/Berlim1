
import { Group, User } from '../../../types';
import { db } from '@/database';
import { authService } from '../../authService';
import { GroupCore } from './GroupCore';
import { GroupLifeCycleService } from './GroupLifeCycleService';
import { IdentityOrchestrator } from '../auth/IdentityOrchestrator';
import { AtomicCounterService } from './AtomicCounterService';

export const GroupModeration = {
    joinGroup(groupId: string): 'joined' | 'pending' | 'full' | 'banned' | 'error' {
        const userId = authService.getCurrentUserId();
        const group = db.groups.findById(groupId);
        if (!userId || !group) return 'error';

        // Normalização de Identidade: Garante que estamos usando UUID
        const normalizedUserId = IdentityOrchestrator.getUuid(userId) || userId;

        if (group.memberIds?.includes(normalizedUserId)) return 'joined';
        if (group.bannedUserIds?.includes(normalizedUserId)) return 'banned';
        
        // Uso de contador numérico otimizado
        const currentCount = group.memberCount || group.memberIds?.length || 0;
        if (group.settings?.memberLimit && currentCount >= group.settings.memberLimit) return 'full';

        if (group.isPrivate || group.settings?.approveMembers) {
            group.pendingMemberIds = [...(group.pendingMemberIds || []), normalizedUserId];
            GroupCore.updateGroup(group);
            return 'pending';
        }

        group.memberIds = [...(group.memberIds || []), normalizedUserId];
        GroupCore.updateGroup(group);
        
        // Incremento Atômico
        AtomicCounterService.updateMemberCount(groupId, 1);
        
        return 'joined';
    },

    getGroupMembers(groupId: string): User[] {
        const group = db.groups.findById(groupId);
        if (!group) return [];
        
        const allUsers = db.users.getAll();
        return (group.memberIds || [])
            .map(id => IdentityOrchestrator.resolveUser(id))
            .filter((u): u is User => !!u && !!u.profile);
    },

    getPendingMembers(groupId: string): User[] {
        const group = db.groups.findById(groupId);
        if (!group) return [];
        
        return (group.pendingMemberIds || [])
            .map(id => IdentityOrchestrator.resolveUser(id))
            .filter((u): u is User => !!u && !!u.profile);
    },

    removeMember(groupId: string, userId: string) {
        const group = db.groups.findById(groupId);
        if (group) {
            const uuid = IdentityOrchestrator.getUuid(userId) || userId;
            group.memberIds = group.memberIds?.filter(id => id !== uuid);
            group.adminIds = group.adminIds?.filter(id => id !== uuid);
            GroupCore.updateGroup(group);
            AtomicCounterService.updateMemberCount(groupId, -1);
        }
    },

    banMember(groupId: string, userId: string) {
        const group = db.groups.findById(groupId);
        if (group) {
            const uuid = IdentityOrchestrator.getUuid(userId) || userId;
            group.memberIds = group.memberIds?.filter(id => id !== uuid);
            group.adminIds = group.adminIds?.filter(id => id !== uuid);
            group.bannedUserIds = [...(group.bannedUserIds || []), uuid];
            GroupCore.updateGroup(group);
            AtomicCounterService.updateMemberCount(groupId, -1);
        }
    },

    promoteMember(groupId: string, userId: string) {
        const group = db.groups.findById(groupId);
        if (group) {
            const uuid = IdentityOrchestrator.getUuid(userId) || userId;
            const currentAdmins = group.adminIds || [];
            if (!currentAdmins.includes(uuid)) {
                group.adminIds = [...currentAdmins, uuid];
                GroupCore.updateGroup(group);
            }
        }
    },

    demoteMember(groupId: string, userId: string) {
        const group = db.groups.findById(groupId);
        if (group) {
            const uuid = IdentityOrchestrator.getUuid(userId) || userId;
            group.adminIds = group.adminIds?.filter(id => id !== uuid);
            GroupCore.updateGroup(group);
        }
    },

    approveMember(groupId: string, userId: string) {
        const group = db.groups.findById(groupId);
        if (group) {
            const uuid = IdentityOrchestrator.getUuid(userId) || userId;
            group.pendingMemberIds = group.pendingMemberIds?.filter(id => id !== uuid);
            const currentMembers = group.memberIds || [];
            if (!currentMembers.includes(uuid)) {
                group.memberIds = [...currentMembers, uuid];
                GroupCore.updateGroup(group);
                AtomicCounterService.updateMemberCount(groupId, 1);
            }
        }
    },

    rejectMember(groupId: string, userId: string) {
        const group = db.groups.findById(groupId);
        if (group) {
            const uuid = IdentityOrchestrator.getUuid(userId) || userId;
            group.pendingMemberIds = group.pendingMemberIds?.filter(id => id !== uuid);
            GroupCore.updateGroup(group);
        }
    },

    async leaveGroup(groupId: string) {
        const userId = authService.getCurrentUserId();
        if (!userId) return;
        const result = await GroupLifeCycleService.processDeparture(groupId, userId);
        if (result.action === 'left' || result.action === 'transferred') {
            AtomicCounterService.updateMemberCount(groupId, -1);
        }
    }
};
