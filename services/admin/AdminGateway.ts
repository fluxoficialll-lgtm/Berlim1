
import { internalConnector } from './InternalConnector';
import { AdminDashboardData } from '../screenService';

/**
 * AdminGateway
 * Ponto de entrada unificado para o Control Plane.
 */
export const AdminGateway = {
  /**
   * Busca métricas globais via Dispatcher
   */
  getDashboard: async (): Promise<AdminDashboardData> => {
    const res = await internalConnector.call<{ data: AdminDashboardData }>('/api/admin/execute/stats/dashboard');
    return res.data;
  },

  /**
   * Aplica restrição via Dispatcher
   */
  restrictAccount: async (userId: string, reason: string) => {
    return await internalConnector.call('/api/admin/execute/users/restrict', {
      method: 'POST',
      body: JSON.stringify({ userId, reason })
    });
  },

  /**
   * Ativa manutenção via Dispatcher
   */
  toggleMaintenance: async (enabled: boolean, message?: string) => {
    return await internalConnector.call('/api/admin/execute/system/maintenance', {
      method: 'PATCH',
      body: JSON.stringify({ enabled, message })
    });
  },

  /**
   * Busca logs de auditoria de um grupo específico
   */
  getGroupAuditLogs: async (groupId: string) => {
    return await internalConnector.call<{ logs: any[] }>(`/api/admin/execute/audit/group-logs?groupId=${groupId}`);
  },

  /**
   * Atualiza taxas financeiras via Dispatcher
   */
  updateFeeRule: async (ruleId: string, updates: any) => {
    return await internalConnector.call('/api/admin/execute/finance/fee-rules', {
      method: 'PATCH',
      body: JSON.stringify({ id: ruleId, data: updates })
    });
  },

  /**
   * Gera ranking de métodos de pagamento
   */
  getPaymentRanking: async (country?: string) => {
    const path = country ? `/api/admin/execute/analytics/payment-methods?country=${country}` : '/api/admin/execute/analytics/payment-methods';
    return await internalConnector.call<{ ranking: any[] }>(path);
  },

  /**
   * Força captura de saúde da infraestrutura
   */
  snapshotInfrastructure: async () => {
    return await internalConnector.call('/api/admin/execute/system/snapshot-storage', {
      method: 'POST'
    });
  },

  /**
   * Purga de logs via Dispatcher
   */
  purgeLogs: async (days: number) => {
    return await internalConnector.call(`/api/admin/execute/system/purge-logs?days=${days}`, {
      method: 'DELETE'
    });
  }
};
