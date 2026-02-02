
import { User } from '../../types';
import { db } from '@/database';
import { API_BASE } from '../../apiConfig';

const API_USERS = `${API_BASE}/api/users`;

export const userSearchService = {
  syncRemoteUsers: async (currentUserId: string | null) => {
      try {
          const response = await fetch(`${API_USERS}/sync`);
          const data = await response.json();
          if (data && Array.isArray(data.users)) {
              data.users.forEach((user: User) => {
                  if (currentUserId && user.id === currentUserId) return;
                  db.users.set(user);
              });
          }
      } catch (e) { console.warn("⚠️ [Sync] Falha ao sincronizar usuários."); }
  },

  searchUsers: async (query: string): Promise<User[]> => {
      try {
          const res = await fetch(`${API_USERS}/search?q=${encodeURIComponent(query)}`);
          return await res.json() || [];
      } catch (e) { return []; }
  },

  fetchUserByHandle: async (handle: string, fallbackEmail?: string): Promise<User | undefined> => {
      if (!handle) return undefined;
      const clean = handle.replace('@', '').toLowerCase().trim();
      const users = await userSearchService.searchUsers(clean);
      const found = users.find((u: any) => u.profile?.name === clean);
      if (found) db.users.set(found); 
      return found;
  },

  getUserByHandle: (handle: string): User | undefined => {
      const clean = handle.replace('@', '').toLowerCase().trim();
      return Object.values(db.users.getAll()).find(u => u.profile?.name === clean);
  },

  getAllUsers: (): User[] => Object.values(db.users.getAll())
};
