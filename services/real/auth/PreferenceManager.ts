
import { NotificationSettings, PaymentProviderConfig, SecuritySettings } from '../../../types';
import { db } from '../../../database';
import { API_BASE } from '../../../apiConfig';

const API_USERS = `${API_BASE}/api/users`;

export const PreferenceManager = {
  async updateNotificationSettings(email: string, settings: NotificationSettings) {
      const response = await fetch(`${API_USERS}/update`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, updates: { notificationSettings: settings } })
      });
      const data = await response.json();
      if (response.ok && data.user) {
          db.users.set(data.user);
          localStorage.setItem('cached_user_profile', JSON.stringify(data.user));
      }
  },

  async updateSecuritySettings(email: string, settings: SecuritySettings) {
      const response = await fetch(`${API_USERS}/update`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, updates: { securitySettings: settings } })
      });
      const data = await response.json();
      if (response.ok && data.user) {
          db.users.set(data.user);
          localStorage.setItem('cached_user_profile', JSON.stringify(data.user));
      }
  },

  /**
   * Atualiza as configurações de pagamento com MERGE DIRETO NO BANCO
   * Não depende mais do db.users.get(email) local para iniciar
   */
  async updatePaymentConfig(email: string, config: PaymentProviderConfig) {
      if (!email) throw new Error("E-mail do usuário não identificado.");

      // 1. Prepara o payload de atualização
      // Buscamos o estado atual direto do banco para o merge via backend
      // No front, apenas enviamos o que queremos mudar
      const updates: any = {
          paymentConfig: config.isConnected ? config : undefined
      };

      // 2. Persiste no PostgreSQL (Fonte da Verdade)
      const response = await fetch(`${API_USERS}/update`, { 
          method: 'PUT', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ 
              email: email.toLowerCase().trim(), 
              updates 
          }) 
      });

      if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Falha ao sincronizar chaves com o servidor.");
      }

      const result = await response.json();

      // 3. HIDRATAÇÃO DO CACHE: Atualiza o LocalStorage com o retorno real do PostgreSQL
      if (result.user) {
          db.users.set(result.user);
          localStorage.setItem('cached_user_profile', JSON.stringify(result.user));
          localStorage.setItem('user_id', result.user.id);
      }
      
      // Notifica o restante do app sobre a mudança de estado (botões, badges, etc)
      window.dispatchEvent(new Event('storage'));
  }
};
