
import { Relationship } from '../../types';
import { db } from '../../database';
import { authService } from '../authService';
import { MOCK_USERS } from '../../mocks';

export const relationshipService = {
  syncRelationships: async () => {},
  followUser: async (handle: string) => {
      const me = authService.getCurrentUserId();
      const target = authService.getUserByHandle(handle);
      if (me && target) {
          const rel: Relationship = { followerId: me, followingId: target.id, followingUsername: handle, status: 'accepted' };
          db.relationships.add(rel);
          return 'following';
      }
      return 'none';
  },
  unfollowUser: async (handle: string) => {
      const me = authService.getCurrentUserId();
      const target = authService.getUserByHandle(handle);
      if (me && target) db.relationships.remove(me, target.id);
  },
  isFollowing: (handle: string) => {
      const me = authService.getCurrentUserId();
      const target = authService.getUserByHandle(handle);
      if (!me || !target) return 'none';
      const all = db.relationships.getAll();
      return all.some(r => r.followerId === me && r.followingId === target.id) ? 'following' : 'none';
  },
  getFollowers: (handle: string) => [],
  getFollowing: (id: string) => [],
  getMutualFriends: async () => [],
  
  /**
   * Retorna o ranking mockado baseado nos usuários de demonstração
   */
  getTopCreators: async () => {
      // Simula um delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = Object.values(MOCK_USERS);
      
      // Mapeia usuários para o formato RankedUser com números fixos para o mock
      const ranking = users.map((u, index) => ({
          ...u,
          followerCount: (users.length - index) * 1250 + Math.floor(Math.random() * 500)
      }));

      // Ordena por número de seguidores
      return ranking.sort((a, b) => b.followerCount - a.followerCount);
  },
  
  acceptFollowRequest: async () => {},
  rejectFollowRequest: async () => {}
};
