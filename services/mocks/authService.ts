
import { User, UserProfile, NotificationSettings, SecuritySettings, PaymentProviderConfig } from '../../types';
import { db } from '../../database';
import { MOCK_USERS } from '../../mocks';

const TOKEN_KEY = 'auth_token';
const CACHE_KEY = 'cached_user_profile';
const USER_ID_KEY = 'user_id';

export const authService = {
  isValidEmail: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
  
  login: async (email: string, password: string) => {
    const cleanEmail = email.toLowerCase().trim();
    let user = Object.values(MOCK_USERS).find(u => u.email === cleanEmail);
    
    if (!user) {
        user = {
            id: 'u-mock-' + Math.random().toString(36).substr(2, 5),
            email: cleanEmail,
            isVerified: true,
            isProfileCompleted: true,
            profile: { 
                name: cleanEmail.split('@')[0], 
                nickname: 'Usuário Teste', 
                isPrivate: false,
                photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`
            }
        };
    }

    localStorage.setItem(TOKEN_KEY, 'mock_token_' + Date.now());
    localStorage.setItem(CACHE_KEY, JSON.stringify(user));
    localStorage.setItem(USER_ID_KEY, user.id);
    
    try {
        db.users.set(user);
    } catch (e) {}
    
    return { 
        user, 
        nextStep: user.isProfileCompleted ? '/feed' : '/complete-profile' 
    };
  },

  loginWithGoogle: async (token?: string, referredBy?: string) => {
    const user = MOCK_USERS['creator'];
    localStorage.setItem(TOKEN_KEY, 'mock_token_google_' + Date.now());
    localStorage.setItem(CACHE_KEY, JSON.stringify(user));
    localStorage.setItem(USER_ID_KEY, user.id);
    try { db.users.set(user); } catch (e) {}
    return { user, nextStep: '/feed' };
  },

  register: async (email: string, password: string, referredBy?: string) => {
    localStorage.setItem('temp_register_email', email.toLowerCase().trim());
    return true;
  },

  verifyCode: async (email: string, code: string) => {
    const mockUser = {
        id: 'u-' + Math.random().toString(36).substr(2, 9),
        email: email.toLowerCase().trim(),
        isVerified: true,
        isProfileCompleted: false,
        profile: { name: email.split('@')[0], isPrivate: false }
    };
    localStorage.setItem(TOKEN_KEY, 'mock_token_' + Date.now());
    localStorage.setItem(CACHE_KEY, JSON.stringify(mockUser));
    localStorage.setItem(USER_ID_KEY, mockUser.id);
    return true;
  },

  sendVerificationCode: async (email: string) => {
      console.log("[MOCK] Código: 123456");
  },
  
  completeProfile: async (email: string, data: UserProfile) => {
    const user = authService.getCurrentUser();
    if (user) {
        user.profile = data;
        user.isProfileCompleted = true;
        localStorage.setItem(CACHE_KEY, JSON.stringify(user));
        try { db.users.set(user); } catch(e) {}
        return user;
    }
    throw new Error("Sessão expirada");
  },

  getCurrentUserId: () => localStorage.getItem(USER_ID_KEY),
  getCurrentUserEmail: () => authService.getCurrentUser()?.email || null,
  getCurrentUser: (): User | null => {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      try { return JSON.parse(cached); } catch(e) { return null; }
  },
  
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(USER_ID_KEY);
    window.location.href = '/#/';
  },

  getAllUsers: () => Object.values(MOCK_USERS),
  
  searchUsers: async (q: string) => {
      const term = q.toLowerCase();
      return Object.values(MOCK_USERS).filter(u => 
        u.profile?.name?.toLowerCase().includes(term) || 
        u.profile?.nickname?.toLowerCase().includes(term)
      );
  },

  fetchUserByHandle: async (handle: string) => {
      const clean = handle.replace('@', '').toLowerCase();
      return Object.values(MOCK_USERS).find(u => u.profile?.name === clean);
  },

  getUserByHandle: (handle: string) => {
      const clean = handle.replace('@', '').toLowerCase();
      return Object.values(MOCK_USERS).find(u => u.profile?.name === clean);
  },

  updateHeartbeat: () => {},
  checkUsernameAvailability: async () => true,
  updateNotificationSettings: async () => {},
  updateSecuritySettings: async () => {},

  updatePaymentConfig: async (config: PaymentProviderConfig) => {
      const user = authService.getCurrentUser();
      if (user) {
          const configs = user.paymentConfigs || {};
          if (config.isConnected) {
              configs[config.providerId] = config;
              user.paymentConfig = config; // Legacy compatibility
          } else {
              delete configs[config.providerId];
              if (user.paymentConfig?.providerId === config.providerId) {
                  delete user.paymentConfig;
              }
          }
          
          user.paymentConfigs = { ...configs };
          localStorage.setItem(CACHE_KEY, JSON.stringify(user));
          
          try { 
              db.users.set(user); 
              // Força atualização em todos os listeners locais
              window.dispatchEvent(new Event('storage'));
          } catch(e) {}
      }
  },

  getUserSessions: () => [],
  revokeOtherSessions: async () => {},
  resetPassword: async () => ({ success: true }),
  changePassword: async (current: string, next: string) => { return { success: true }; },
  syncRemoteUsers: async () => {
      Object.values(MOCK_USERS).forEach(u => db.users.set(u));
  }
};
