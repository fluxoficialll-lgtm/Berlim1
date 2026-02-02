
import { Group, User, GroupLink } from '../../types';
import { db } from '../../database';
import { authService } from '../authService';
import { IGroupService } from '../groupService.interface';
import { MOCK_GROUPS, MOCK_USERS } from '../../mocks';

export const MockGroupService: IGroupService = {
    fetchGroups: async () => {
        const all = db.groups.getAll();
        if (all.length === 0) {
            MOCK_GROUPS.forEach(g => db.groups.add(g));
            return MOCK_GROUPS;
        }
        return all;
    },

    getGroupsSync: () => db.groups.getAll().sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)),

    getGroupsPaginated: (offset, limit) => {
        const currentId = authService.getCurrentUserId();
        const all = db.groups.getAll();
        const myGroups = all.filter(g => 
            g.memberIds?.includes(currentId || '') || g.creatorId === currentId
        ).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        return { 
            groups: myGroups.slice(offset, offset + limit), 
            hasMore: offset + limit < myGroups.length 
        };
    },

    getAllGroupsForRanking: async (type) => {
        const allLocal = db.groups.getAll();
        if (allLocal.length === 0) {
            MOCK_GROUPS.forEach(g => db.groups.add(g));
        }
        
        const all = db.groups.getAll();
        if (type === 'vip') return all.filter(g => g.isVip);
        if (type === 'private') return all.filter(g => g.isPrivate && !g.isVip);
        return all.filter(g => !g.isPrivate && !g.isVip);
    },

    getGroupById: (id) => db.groups.findById(id) || MOCK_GROUPS.find(g => g.id === id),

    fetchGroupById: async (id) => {
        const local = db.groups.findById(id);
        if (local) return local;
        return MOCK_GROUPS.find(g => g.id === id) || null;
    },

    createGroup: async (group) => {
        const userId = authService.getCurrentUserId();
        group.creatorId = userId || 'mock-user';
        group.timestamp = Date.now();
        db.groups.add(group);
    },

    updateGroup: async (group) => {
        const existing = db.groups.findById(group.id);
        const merged = {
            ...existing,
            ...group,
            updated_at: new Date().toISOString()
        };
        db.groups.update(merged);
    },

    deleteGroup: async (id) => {
        db.groups.delete(id);
    },

    joinGroup: (groupId) => {
        const userId = authService.getCurrentUserId() || 'mock-user';
        const group = db.groups.findById(groupId);
        if (!group) return 'error';
        if (group.isPrivate) {
            group.pendingMemberIds = [...(group.pendingMemberIds || []), userId];
            db.groups.update(group);
            return 'pending';
        }
        group.memberIds = [...(group.memberIds || []), userId];
        db.groups.update(group);
        return 'joined';
    },

    checkVipStatus: (groupId, userId) => {
        const access = db.vipAccess.get(userId, groupId);
        return access ? 'active' : 'none';
    },

    getGroupMembers: (groupId) => {
        const group = db.groups.findById(groupId) || MOCK_GROUPS.find(g => g.id === groupId);
        if (!group) return [];
        
        const mockUsersList = Object.values(MOCK_USERS);
        const currentUserId = authService.getCurrentUserId();

        // Inteligência de Mock: Se o grupo for novo (apenas o criador), 
        // injetamos os usuários mockados para visualização da UI
        const isNewOrEmpty = !group.memberIds || group.memberIds.length <= 1;
        
        if (isNewOrEmpty) {
            // Retorna o usuário logado + todos os mocks para popular a lista
            const currentUser = currentUserId ? mockUsersList.find(u => u.id === currentUserId) : null;
            const list = [...mockUsersList];
            if (currentUser && !list.find(u => u.id === currentUser.id)) {
                list.unshift(currentUser);
            }
            return list;
        }

        // Para grupos que já possuem membros definidos (como o Networking Elite do mock)
        return mockUsersList.filter(u => group.memberIds?.includes(u.id));
    },

    getPendingMembers: (groupId) => {
        const group = db.groups.findById(groupId) || MOCK_GROUPS.find(g => g.id === groupId);
        if (!group) return [];
        
        const mockUsersList = Object.values(MOCK_USERS);
        return mockUsersList.filter(u => group.pendingMemberIds?.includes(u.id));
    },

    addGroupLink: (groupId, name, maxUses, expiresAt) => {
        const group = db.groups.findById(groupId);
        if (!group) return null;
        const link: GroupLink = { id: Date.now().toString(), name, code: 'MOCK' + Math.random().toString(36).substr(2, 4).toUpperCase(), joins: 0, createdAt: Date.now(), maxUses, expiresAt };
        group.links = [link, ...(group.links || [])];
        db.groups.update(group);
        return link;
    },

    removeGroupLink: (groupId, linkId) => {
        const group = db.groups.findById(groupId);
        if (group) {
            group.links = group.links?.filter(l => l.id !== linkId);
            db.groups.update(group);
        }
    },

    removeMember: (groupId, userId) => {
        const group = db.groups.findById(groupId);
        if (group) {
            group.memberIds = group.memberIds?.filter(id => id !== userId);
            group.adminIds = group.adminIds?.filter(id => id !== userId);
            db.groups.update(group);
        }
    },

    banMember: (groupId, userId) => {
        const group = db.groups.findById(groupId);
        if (group) {
            group.memberIds = group.memberIds?.filter(id => id !== userId);
            group.adminIds = group.adminIds?.filter(id => id !== userId);
            group.bannedUserIds = [...(group.bannedUserIds || []), userId];
            db.groups.update(group);
        }
    },

    promoteMember: (groupId, userId) => {
        const group = db.groups.findById(groupId);
        if (group) {
            group.adminIds = [...(group.adminIds || []), userId];
            db.groups.update(group);
        }
    },

    demoteMember: (groupId, userId) => {
        const group = db.groups.findById(groupId);
        if (group) {
            group.adminIds = group.adminIds?.filter(id => id !== userId);
            db.groups.update(group);
        }
    },

    approveMember: (groupId, userId) => {
        const group = db.groups.findById(groupId);
        if (group) {
            group.pendingMemberIds = group.pendingMemberIds?.filter(id => id !== userId);
            group.memberIds = [...(group.memberIds || []), userId];
            db.groups.update(group);
        }
    },

    rejectMember: (groupId, userId) => {
        const group = db.groups.findById(groupId);
        if (group) {
            group.pendingMemberIds = group.pendingMemberIds?.filter(id => id !== userId);
            db.groups.update(group);
        }
    },

    leaveGroup: async (groupId) => {
        const userId = authService.getCurrentUserId() || 'mock-user';
        const group = db.groups.findById(groupId);
        if (group) {
            group.memberIds = group.memberIds?.filter(id => id !== userId);
            db.groups.update(group);
        }
    },

    joinGroupByLinkCode: (code) => {
        return { success: true, message: "Você entrou via link!", groupId: 'g-pub-001' };
    }
};
