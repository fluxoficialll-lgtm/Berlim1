
import { Group, User, GroupLink } from '../types';

export interface IGroupService {
    fetchGroups(): Promise<Group[]>;
    getGroupsSync(): Group[];
    getGroupsPaginated(offset: number, limit: number): { groups: Group[]; hasMore: boolean };
    getAllGroupsForRanking(type: string): Promise<Group[]>;
    getGroupById(id: string): Group | undefined;
    fetchGroupById(id: string): Promise<Group | null>;
    createGroup(group: Group): Promise<void>;
    updateGroup(group: Group): Promise<void>;
    deleteGroup(id: string): Promise<void>;
    joinGroup(groupId: string): 'joined' | 'pending' | 'full' | 'banned' | 'error';
    checkVipStatus(groupId: string, userId: string): 'active' | 'none' | 'expired' | 'grace_period';
    getGroupMembers(groupId: string): User[];
    getPendingMembers(groupId: string): User[];
    addGroupLink(groupId: string, name: string, maxUses?: number, expiresAt?: string): GroupLink | null;
    removeGroupLink(groupId: string, linkId: string): void;
    removeMember(groupId: string, userId: string): void;
    banMember(groupId: string, userId: string): void;
    promoteMember(groupId: string, userId: string): void;
    demoteMember(groupId: string, userId: string): void;
    approveMember(groupId: string, userId: string): void;
    rejectMember(groupId: string, userId: string): void;
    leaveGroup(groupId: string): Promise<void>;
    joinGroupByLinkCode(code: string): { success: boolean; message: string; groupId?: string };
}
