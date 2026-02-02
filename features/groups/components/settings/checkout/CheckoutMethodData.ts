export interface MethodOption {
    id: string;
    label: string;
    icon: string;
    color: string;
    badge?: string;
}

export const PROVIDER_METHODS: Record<string, Record<string, MethodOption[]>> = {
    syncpay: {
        BR: [
            { id: 'pix', label: 'Pix', icon: 'fa-pix', color: '#00ff82', badge: 'Instantâneo' },
            { id: 'boleto', label: 'Boleto', icon: 'fa-barcode', color: '#aaa' }
        ]
    },
    stripe: {
        BR: [
            { id: 'pix', label: 'Pix', icon: 'fa-pix', color: '#00ff82' },
            { id: 'card', label: 'Cartão de Crédito', icon: 'fa-credit-card', color: '#00c2ff' },
            { id: 'debit_card', label: 'Cartão de Débito', icon: 'fa-credit-card', color: '#5dade2' },
            { id: 'boleto', label: 'Boleto', icon: 'fa-barcode', color: '#aaa' },
            { id: 'link', label: 'Link', icon: 'fa-link', color: '#00d66f' },
            { id: 'wallet', label: 'Wallets', icon: 'fa-brands fa-apple-pay', color: '#fff' }
        ],
        US: [
            { id: 'card', label: 'Credit Card', icon: 'fa-credit-card', color: '#00c2ff' },
            { id: 'ach', label: 'ACH Direct Debit', icon: 'fa-building-columns', color: '#85929e' },
            { id: 'link', label: 'Link', icon: 'fa-link', color: '#00d66f' },
            { id: 'wallet', label: 'Wallets', icon: 'fa-brands fa-google-pay', color: '#fff' }
        ],
        EU: [
            { id: 'sofort', label: 'Sofort / Klarna', icon: 'fa-money-bill-transfer', color: '#f39c12' },
            { id: 'sepa', label: 'SEPA Direct Debit', icon: 'fa-university', color: '#2ecc71' },
            { id: 'klarna', label: 'Klarna BNPL', icon: 'fa-shopping-bag', color: '#ffb3c6' },
            { id: 'card', label: 'Credit Card', icon: 'fa-credit-card', color: '#00c2ff' },
            { id: 'link', label: 'Link', icon: 'fa-link', color: '#00d66f' },
            { id: 'wallet', label: 'Wallets', icon: 'fa-brands fa-apple-pay', color: '#fff' }
        ],
        GB: [
            { id: 'card', label: 'Debit / Credit Card', icon: 'fa-credit-card', color: '#00c2ff' },
            { id: 'bacs', label: 'BACS Direct Debit', icon: 'fa-building-columns', color: '#5dade2' },
            { id: 'link', label: 'Link', icon: 'fa-link', color: '#00d66f' },
            { id: 'wallet', label: 'Wallets', icon: 'fa-brands fa-apple-pay', color: '#fff' }
        ],
        IN: [
            { id: 'upi', label: 'UPI Pay', icon: 'fa-mobile-screen-button', color: '#ff9933' },
            { id: 'card', label: 'International Card', icon: 'fa-credit-card', color: '#00c2ff' },
            { id: 'link', label: 'Link', icon: 'fa-link', color: '#00d66f' },
            { id: 'wallet', label: 'Wallets', icon: 'fa-brands fa-google-pay', color: '#fff' }
        ],
        JP: [
            { id: 'konbini', label: 'Konbini', icon: 'fa-shop', color: '#27ae60' },
            { id: 'card', label: 'Credit Card (JCB)', icon: 'fa-credit-card', color: '#00c2ff' },
            { id: 'link', label: 'Link', icon: 'fa-link', color: '#00d66f' },
            { id: 'wallet', label: 'Wallets', icon: 'fa-brands fa-apple-pay', color: '#fff' }
        ],
        MX: [
            { id: 'oxxo', label: 'OXXO Cash', icon: 'fa-barcode', color: '#e74c3c' },
            { id: 'card', label: 'Crédito Parcelado', icon: 'fa-credit-card', color: '#00c2ff' },
            { id: 'debit_card', label: 'Débito', icon: 'fa-credit-card', color: '#5dade2' },
            { id: 'link', label: 'Link', icon: 'fa-link', color: '#00d66f' },
            { id: 'wallet', label: 'Wallets', icon: 'fa-brands fa-apple-pay', color: '#fff' }
        ],
        CA: [
            { id: 'interac', label: 'Interac e-Transfer', icon: 'fa-exchange-alt', color: '#e74c3c' },
            { id: 'card', label: 'Credit Card', icon: 'fa-credit-card', color: '#00c2ff' },
            { id: 'pad', label: 'Pre-auth Debit (PAD)', icon: 'fa-university', color: '#5dade2' },
            { id: 'link', label: 'Link', icon: 'fa-link', color: '#00d66f' },
            { id: 'wallet', label: 'Wallets', icon: 'fa-brands fa-apple-pay', color: '#fff' }
        ],
        AU: [
            { id: 'card', label: 'Credit Card', icon: 'fa-credit-card', color: '#00c2ff' },
            { id: 'becs', label: 'BECS Direct Debit', icon: 'fa-university', color: '#85929e' },
            { id: 'afterpay', label: 'Afterpay', icon: 'fa-clock-rotate-left', color: '#b2fce4' },
            { id: 'link', label: 'Link', icon: 'fa-link', color: '#00d66f' },
            { id: 'wallet', label: 'Wallets', icon: 'fa-brands fa-google-pay', color: '#fff' }
        ],
        SG: [
            { id: 'paynow', label: 'PayNow', icon: 'fa-qrcode', color: '#635bff' },
            { id: 'grabpay', label: 'GrabPay', icon: 'fa-wallet', color: '#00b14f' },
            { id: 'card', label: 'Credit Card', icon: 'fa-credit-card', color: '#00c2ff' },
            { id: 'link', label: 'Link', icon: 'fa-link', color: '#00d66f' },
            { id: 'wallet', label: 'Wallets', icon: 'fa-brands fa-google-pay', color: '#fff' }
        ],
        DEFAULT: [
            { id: 'card', label: 'Credit Card', icon: 'fa-credit-card', color: '#00c2ff' },
            { id: 'link', label: 'Link', icon: 'fa-link', color: '#00d66f' },
            { id: 'wallet', label: 'Wallets', icon: 'fa-brands fa-apple-pay', color: '#fff' }
        ]
    }
};