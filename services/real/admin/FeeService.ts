
import { internalConnector } from '../../admin/InternalConnector';

export interface FeeRulePayload {
    id?: string;
    provider: 'stripe' | 'syncpay' | 'paypal';
    country_code: string;
    currency: 'BRL' | 'USD' | 'EUR';
    method: string;
    method_name: string;
    fixed_fee: number;
    percent_fee: number;
    is_active: boolean;
    priority?: number;
}

/**
 * FeeService
 * Gerencia a comunicação dos cards de taxas do painel com o Dispatcher do servidor.
 */
export const FeeService = {
    /**
     * Busca todas as regras de taxas configuradas no sistema
     */
    async listAllRules(): Promise<FeeRulePayload[]> {
        const response = await internalConnector.call<{ success: boolean, data: FeeRulePayload[] }>(
            '/api/admin/execute/finance/rules', 
            { method: 'GET' }
        );
        return response.data || [];
    },

    /**
     * Salva uma regra. Decide automaticamente entre POST (nova) ou PATCH (existente)
     * Baseia-se no ID ou no prefixo 'temp_' gerado pela UI.
     */
    async syncRule(payload: FeeRulePayload): Promise<any> {
        const isNew = !payload.id || payload.id.startsWith('temp_');

        if (isNew) {
            // Remove o ID temporário antes de enviar para criação
            const { id, ...cleanPayload } = payload;
            return await internalConnector.call('/api/admin/execute/finance/rules', {
                method: 'POST',
                body: JSON.stringify(cleanPayload)
            });
        } else {
            // Envia para atualização via PATCH
            return await internalConnector.call('/api/admin/execute/finance/rules', {
                method: 'PATCH',
                body: JSON.stringify({
                    id: payload.id,
                    data: {
                        fixed_fee: payload.fixed_fee,
                        percent_fee: payload.percent_fee,
                        is_active: payload.is_active,
                        currency: payload.currency
                    }
                })
            });
        }
    },

    /**
     * Remove uma regra de taxa
     */
    async deleteRule(id: string): Promise<any> {
        return await internalConnector.call(`/api/admin/execute/finance/rules?id=${id}`, {
            method: 'DELETE'
        });
    }
};
