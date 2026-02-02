
import { NotificationSettings, PaymentProviderConfig, User, SecuritySettings } from '../../types';
import { db } from '@/database';
import { API_BASE } from '../../apiConfig';

const API_USERS = `${API_BASE}/api/users`;

export const preferenceService = {
  updateNotificationSettings: async (email: string, settings: NotificationSettings) => {
      await fetch(`${API_USERS}/update`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, updates: { notificationSettings: settings } })
      });
      const user = db.users.get(email);
      if (user) {
          user.notificationSettings = settings;
          db.users.set(user);
          localStorage.setItem('cached_user_profile', JSON.stringify(user));
      }
  },

  updateSecuritySettings: async (email: string, settings: SecuritySettings) => {
      await fetch(`${API_USERS}/update`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, updates: { securitySettings: settings } })
      });
      const user = db.users.get(email);
      if (user) {
          user.securitySettings = settings;
          db.users.set(user);
          localStorage.setItem('cached_user_profile', JSON.stringify(user));
      }
  },

  updateLanguage: async (email: string, language: string) => {
      try {
          await fetch(`${API_USERS}/update`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, updates: { language } })
          });
      } catch (e) {
          console.warn("Language update failed on server, updating locally only.");
      }
      
      const allUsers = db.users.getAll();
      const user = Object.values(allUsers).find(u => u.email === email);
      if (user) {
          user.language = language;
          db.users.set(user);
          localStorage.setItem('cached_user_profile', JSON.stringify(user));
          localStorage.setItem('app_language', language);
      }
  },

  updatePaymentConfig: async (email: string, config: PaymentProviderConfig) => {
      await fetch(`${API_USERS}/update`, { 
          method: 'PUT', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ email, updates: { paymentConfig: config } }) 
      });
      const user = db.users.get(email);
      if (user) {
          user.paymentConfig = config;
          db.users.set(user);
          localStorage.setItem('cached_user_profile', JSON.stringify(user));
      }
  }
};
