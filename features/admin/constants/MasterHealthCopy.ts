export type MasterStatus = 'ok' | 'pending' | 'missing_key' | 'failed' | 'invalid_token' | 'validating';

export const MASTER_HEALTH_COPY: Record<MasterStatus, { label: string; icon: string; color: string }> = {
    ok: {
        label: 'pronto para receber taxas 💰',
        icon: 'fa-circle-check',
        color: '#00ff82'
    },
    pending: {
        label: 'com pendência de configuração ⚠️',
        icon: 'fa-triangle-exclamation',
        color: '#ffaa00'
    },
    missing_key: {
        label: 'sem chave mestre ativa 🔑',
        icon: 'fa-key',
        color: '#ff4d4d'
    },
    failed: {
        label: 'sem repasse de taxas ❌',
        icon: 'fa-circle-xmark',
        color: '#ff4d4d'
    },
    invalid_token: {
        label: 'com autenticação inválida 🛠️',
        icon: 'fa-screwdriver-wrench',
        color: '#ffaa00'
    },
    validating: {
        label: 'em validação ⏳',
        icon: 'fa-spinner',
        color: '#00c2ff'
    }
};

export const PROVIDER_LABELS: Record<string, string> = {
    syncpay: 'SyncPay',
    stripe: 'Stripe',
    paypal: 'PayPal'
};