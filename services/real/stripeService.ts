
import { API_BASE } from '../../apiConfig';
import { Group } from '../../types';
import { connectionHub } from '../connections/connectionHub';

const PROXY_BASE = `${API_BASE}/api/stripe`;

export const stripeService = {
    authenticate: async (secretKey: string) => {
        return stripeService.verifyCredentials(secretKey);
    },

    verifyCredentials: async (secretKey: string) => {
        const response = await connectionHub.gateways.request<any>(
            `${PROXY_BASE}/auth-token`,
            {
                method: 'POST',
                body: JSON.stringify({ secretKey })
            },
            'Stripe'
        );
        
        if (!response.success) throw new Error(response.error);
        return response.data;
    },

    /**
     * Cria um PaymentIntent para processamento interno (Custom UI)
     * Usado para Pix, OXXO, SEPA e Cards sem sair do app.
     */
    createPaymentIntent: async (group: Group, ownerEmail: string, paymentMethodType: string) => {
        const response = await connectionHub.gateways.request<any>(
            `${PROXY_BASE}/create-intent`,
            {
                method: 'POST',
                body: JSON.stringify({ 
                    group, 
                    ownerEmail, 
                    paymentMethodType,
                    currency: group.currency?.toLowerCase() || 'brl'
                })
            },
            'Stripe'
        );

        if (!response.success) throw new Error(response.error);
        return response.data; // Retorna client_secret e dados do método (ex: next_action para Pix)
    },

    /**
     * Legado: Mantido para quem ainda prefere o checkout externo da Stripe
     */
    createCheckoutSession: async (group: Group, ownerEmail: string) => {
        const successUrl = `${window.location.origin}/#/vip-group-sales/${group.id}?session_id={CHECKOUT_SESSION_ID}&success=true`;
        const cancelUrl = `${window.location.origin}/#/vip-group-sales/${group.id}?success=false`;

        const response = await connectionHub.gateways.request<any>(
            `${PROXY_BASE}/create-session`,
            {
                method: 'POST',
                body: JSON.stringify({ group, ownerEmail, successUrl, cancelUrl })
            },
            'Stripe'
        );

        if (!response.success) throw new Error(response.error);
        return response.data;
    },

    checkSessionStatus: async (sessionId: string, ownerEmail: string) => {
        const response = await connectionHub.gateways.request<any>(
            `${PROXY_BASE}/check-status`,
            {
                method: 'POST',
                body: JSON.stringify({ sessionId, ownerEmail })
            },
            'Stripe'
        );

        if (!response.success) throw new Error(response.error);
        return response.data;
    }
};
