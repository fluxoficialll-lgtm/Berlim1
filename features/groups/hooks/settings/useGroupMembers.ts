
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Group, User, GroupRole } from '../../../../types';
import { groupService } from '../../../../services/groupService';
import { authService } from '../../../../services/authService';
import { db } from '../../../../database';

export const useGroupMembers = (group: Group | null) => {
  const [members, setMembers] = useState<User[]>([]);
  const [pendingRequests, setPendingRequests] = useState<User[]>([]);
  const [roles, setRoles] = useState<GroupRole[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const currentUserId = authService.getCurrentUserId();

  const refreshMembers = useCallback((groupId: string) => {
    if (!groupId) return;
    try {
        const rawMembers = groupService.getGroupMembers(groupId) || [];
        setMembers(rawMembers);
        setPendingRequests(groupService.getPendingMembers(groupId) || []);
    } catch (e) {
        console.error("Erro ao carregar membros do grupo:", e);
    }
  }, []);

  useEffect(() => {
    if (group) {
      setRoles(group.roles || []);
      refreshMembers(group.id);

      const unsub = db.subscribe('groups', () => refreshMembers(group.id));
      return () => unsub();
    }
  }, [group, refreshMembers]);

  const filteredMembers = useMemo(() => {
      const activeMembers = members || [];
      const term = searchQuery.toLowerCase().trim();
      if (!term) return activeMembers;

      return activeMembers.filter(m => {
          const name = m.profile?.name?.toLowerCase() || '';
          const nickname = m.profile?.nickname?.toLowerCase() || '';
          return name.includes(term) || nickname.includes(term);
      });
  }, [members, searchQuery]);

  const mappedMembers = useMemo(() => {
      if (!group) return [];
      const safeFiltered = filteredMembers || [];
      
      // O grupo armazena o mapa de cargos em userRoles (id_usuario: id_cargo)
      const userRolesMap = (group as any).userRoles || {};

      return safeFiltered.map(u => ({
          id: u.id,
          name: u.profile?.nickname || u.profile?.name || 'Membro Flux',
          role: u.id === group.creatorId ? 'Dono' : (group.adminIds?.includes(u.id) ? 'Admin' : 'Membro'),
          roleId: userRolesMap[u.id], // ID do cargo customizado atribuído
          isMe: u.id === currentUserId,
          avatar: u.profile?.photoUrl
      }));
  }, [filteredMembers, group, currentUserId]);

  return {
    state: { 
        members: mappedMembers, 
        pendingRequests, 
        roles,
        searchQuery 
    },
    actions: { 
        setMembers, 
        setPendingRequests, 
        setRoles, 
        refreshMembers,
        setSearchQuery 
    },
    getMembersPayload: () => ({ roles })
  };
};
