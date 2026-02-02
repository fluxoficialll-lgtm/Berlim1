
import { UserProfile, User } from '../../types';
import { db } from '@/database';
import { API_BASE } from '../../apiConfig';
import { userSearchService } from './userSearchService';

const API_USERS = `${API_BASE}/api/users`;

export const profileService = {
  completeProfile: async (email: string, data: UserProfile): Promise<User> => {
      const response = await fetch(`${API_USERS}/update`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.toLowerCase().trim(), updates: { profile: data, isProfileCompleted: true } })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Erro ao atualizar perfil.");
      
      db.users.set(result.user);
      localStorage.setItem('cached_user_profile', JSON.stringify(result.user));
      return result.user;
  },

  checkUsernameAvailability: async (name: string): Promise<boolean> => {
      const results = await userSearchService.searchUsers(name);
      return !results.some(u => u.profile?.name === name.toLowerCase());
  }
};
