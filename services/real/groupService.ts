
import { IGroupService } from '../groupService.interface';
import { GroupCore } from './groups/GroupCore';
import { GroupModeration } from './groups/GroupModeration';
import { GroupInvite } from './groups/GroupInvite';
import { VipManager } from './groups/VipManager';
import { RankingService } from './groups/RankingService';

/**
 * RealGroupService atua como um HUB (Fachada) que compõe as funcionalidades
 * de sub-serviços especializados, mantendo a compatibilidade com a interface global.
 */
export const RealGroupService: IGroupService = {
    // CRUD & Core
    fetchGroups: GroupCore.fetchGroups,
    getGroupsSync: GroupCore.getGroupsSync,
    getGroupsPaginated: GroupCore.getGroupsPaginated,
    
    // Agora delegando para o RankingService especializado
    getAllGroupsForRanking: async (type: any) => RankingService.getRankedList(type),
    
    getGroupById: GroupCore.getGroupById,
    fetchGroupById: GroupCore.fetchGroupById,
    createGroup: GroupCore.createGroup,
    updateGroup: GroupCore.updateGroup,
    deleteGroup: GroupCore.deleteGroup,

    // Membros & Moderação
    joinGroup: GroupModeration.joinGroup,
    getGroupMembers: GroupModeration.getGroupMembers,
    getPendingMembers: GroupModeration.getPendingMembers,
    removeMember: GroupModeration.removeMember,
    banMember: GroupModeration.banMember,
    promoteMember: GroupModeration.promoteMember,
    demoteMember: GroupModeration.demoteMember,
    approveMember: GroupModeration.approveMember,
    rejectMember: GroupModeration.rejectMember,
    leaveGroup: GroupModeration.leaveGroup,

    // Links & Convites
    addGroupLink: GroupInvite.addGroupLink,
    removeGroupLink: GroupInvite.removeGroupLink,
    joinGroupByLinkCode: GroupInvite.joinGroupByLinkCode,

    // VIP Logic
    checkVipStatus: VipManager.checkVipStatus
};
