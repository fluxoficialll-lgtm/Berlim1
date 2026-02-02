import { GroupRole } from '../../../types';

export const DEFAULT_MODERATOR_ROLE: Partial<GroupRole> = {
  name: 'Moderador',
  color: '#00c2ff',
  permissions: {
    isAdmin: false,
    canEditGroupInfo: false,
    canManageRoles: false,
    canViewAuditLogs: true,
    canViewRevenue: false,
    canSendMessages: true,
    canDeleteMessages: true,
    canPinMessages: true,
    canBypassSlowMode: true,
    canKickMembers: true,
    canBanMembers: false,
    canApproveMembers: true,
    canInviteMembers: true,
    canManageFolders: false,
    canManageFiles: false,
    canPostScheduled: false,
    canManageAds: false
  }
};