
export const CTA_OPTIONS_CONFIG = [
    { label: 'conferir',    icon: 'fa-eye',                 allowUrl: true,  allowGroup: true },
    { label: 'participar',  icon: 'fa-user-group',          allowUrl: false, allowGroup: true },
    { label: 'comprar',     icon: 'fa-cart-shopping',       allowUrl: true,  allowGroup: true },
    { label: 'assinar',     icon: 'fa-credit-card',         allowUrl: true,  allowGroup: true },
    { label: 'entrar',      icon: 'fa-arrow-right-to-bracket', allowUrl: false, allowGroup: true },
    { label: 'descubra',    icon: 'fa-compass',             allowUrl: true,  allowGroup: true },
    { label: 'baixar',      icon: 'fa-download',            allowUrl: true,  allowGroup: false },
    { label: 'saiba mais',  icon: 'fa-circle-info',         allowUrl: true,  allowGroup: true }
];

export type AdFlowStep = 'campaign' | 'adset' | 'ad';
