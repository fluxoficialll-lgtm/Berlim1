
export type GatewayId = 'syncpay' | 'stripe' | 'paypal' | 'btc' | string;

export const GATEWAY_CURRENCIES: Record<GatewayId, string[]> = {
    'syncpay': ['BRL'],
    'stripe': ['BRL', 'USD', 'EUR'],
    'paypal': ['BRL', 'USD', 'EUR'],
    'btc_native': ['BTC']
};

export const DEFAULT_CURRENCY_FOR_GATEWAY: Record<GatewayId, string> = {
    'syncpay': 'BRL',
    'stripe': 'BRL',
    'paypal': 'BRL',
    'btc_native': 'BTC'
};
