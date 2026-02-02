
import { UserSession } from '../../../types';
import { db } from '@/database';
import { API_BASE } from '../../../apiConfig';
import { cryptoService } from '../../cryptoService';

const API_URL = `${API_BASE}/api/auth`;

export const IdentitySecurity = {
  updateHeartbeat(userId: string | null) { 
      if (!userId) return;
      const user = db.users.get(userId);
      if (user) { 
          user.lastSeen = Date.now(); 
          db.users.set(user); 
      } 
  },

  getUserSessions(userEmail: string | null): UserSession[] {
      if (!userEmail) return [];
      const user = db.users.get(userEmail);
      return user?.sessions || [];
  },

  async revokeOtherSessions(email: string) {
      try {
          await fetch(`${API_URL}/sessions/revoke-others`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email })
          });
      } catch (e) { console.error("Revoke sessions failed"); }
  },

  async changePassword(email: string, current: string, newPw: string) {
      const hashedCurrent = await cryptoService.hashPassword(current);
      const hashedNew = await cryptoService.hashPassword(newPw);
      
      const response = await fetch(`${API_URL}/change-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, currentPassword: hashedCurrent, newPassword: hashedNew })
      });
      
      if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Erro ao mudar senha.");
      }
      return true;
  }
};
