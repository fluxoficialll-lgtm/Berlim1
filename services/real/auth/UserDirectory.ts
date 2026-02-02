
import { User } from '../../../types';
import { db } from '@/database';
import { API_BASE } from '../../../apiConfig';

const API_USERS = `${API_BASE}/api/users`;

export const UserDirectory = {
  async syncRemoteUsers(currentUserId: string | null) {
      try {
          const response = await fetch(`${API_USERS}/sync`);
          if (response.ok) {
              const data = await response.json();
              if (data && Array.isArray(data.users)) {
                  data.users.forEach((user: User) => {
                      if (currentUserId && user.id === currentUserId) return;
                      db.users.set(user);
                  });
              }
          }
      } catch (e) { console.warn("⚠️ [Sync] Falha ao sincronizar usuários."); }
  },

  async searchUsers(query: string): Promise<User[]> {
      try {
          const res = await fetch(`${API_USERS}/search?q=${encodeURIComponent(query)}`);
          if (res.ok) {
              return await res.json() || [];
          }
      } catch (e) { console.warn("Search fetch failed"); }
      return [];
  },

  async fetchUserByHandle(handle: string, fallbackEmail?: string): Promise<User | undefined> {
      if (!handle) return undefined;
      const clean = handle.replace('@', '').toLowerCase().trim();
      const users = await this.searchUsers(clean);
      const found = users.find((u: any) => u.profile?.name === clean);
      if (found) db.users.set(found); 
      return found;
  },

  getUserByHandle(handle: string): User | undefined {
      const clean = handle.replace('@', '').toLowerCase().trim();
      return Object.values(db.users.getAll()).find(u => u.profile?.name === clean);
  },

  getAllUsers(): User[] {
      return Object.values(db.users.getAll());
  }
};
