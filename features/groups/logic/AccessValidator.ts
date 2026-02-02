import { Group, VipAccess } from '../../../types';

export const AccessValidator = {
  isAccessExpired: (access?: VipAccess): boolean => {
    if (!access) return true;
    if (!access.expiresAt) return false; // Vitalício
    return Date.now() > access.expiresAt;
  },

  getAccessStatus: (group: Group, userId: string, access?: VipAccess) => {
    if (group.creatorId === userId) return 'owner';
    if (!group.isVip) return 'free_member';
    if (!access) return 'none';
    if (AccessValidator.isAccessExpired(access)) return 'expired';
    return 'active_vip';
  }
};