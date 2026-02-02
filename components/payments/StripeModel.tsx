
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { stripeService } from '../../services/stripeService';
import { authService } from '../../services/authService';
import { GeoData } from '../../services/geoService';
import { ConversionResult } from '../../services/currencyService';
import { vipSalesTracker } from '../../services/pixel/trackers/VipSalesTracker';
import { Group } from '../../types';
import { USE_MOCKS } from '../../mocks';

// Sub-views Internas
import { StripePixView } from './stripe/StripePixView';
import { StripeCardForm } from './stripe/StripeCardForm';
import { StripeOxxoView } from './stripe/StripeOxxoView';
import { StripeSepaForm } from './stripe/StripeSepaForm';
import { StripeBoletoView } from './stripe/StripeBoletoView';
import { StripeBacsForm } from './stripe/StripeBacsForm';
import { StripeUpiView } from './stripe/StripeUpiView';
import { StripeKonbiniView } from './stripe/StripeKonbiniView';
import { StripePayNowView } from './stripe/StripePayNowView';
import { StripeAchForm } from './stripe/StripeAchForm';
import { StripeInteracView } from './stripe/StripeInteracView';
import { StripeBecsForm } from './stripe/StripeBecsForm';
import { StripePadForm } from './stripe/StripePadForm';

import { RedirectionBridgeCard, RedirectionProvider } from './RedirectionBridgeCard';

interface StripeModelProps {
    group: Group;
    geo: GeoData | null;
    onSuccess: () => void;
    onError: (msg: string) => void;
    onTransactionId: (id: string) => void;
    convertedPriceInfo: ConversionResult | null;
}

type StripeView = 'selection' | 'pix' | 'card' | 'debit_card' | 'oxxo' | 'sepa' | 'klarna' | 'sofort' | 'bacs' | 'ach' | 'konbini' | 'upi' | 'processing' | 'boleto' | 'redirection' | 'link' | 'wallet' | 'interac' | 'paynow' | 'grabpay' | 'afterpay' | 'becs' | 'pad';

const STRIPE_REGIONAL_MATRIX: Record<string, any> = {
    'BR': {
        flag: '🇧🇷',
        methods: [
            { id: 'pix', icon: 'fa-pix', title: 'Pix Instantâneo', sub: 'Liberação imediata', primary: true },
            { id: 'card', icon: 'fa-credit-card', title: 'Cartão de Crédito', sub: 'À vista ou Parcelado' },
            { id: 'debit_card', icon: 'fa-credit-card', title: 'Cartão de Débito', sub: 'Pagamento imediato' },
            { id: 'boleto', icon: 'fa-barcode', title: 'Boleto Bancário', sub: 'Compensação em até 48h' },
            { id: 'link', icon: 'fa-link', title: 'Link (1-Click)', sub: 'Pagamento rápido Stripe' },
            { id: 'wallet', icon: 'fa-brands fa-apple-pay', title: 'Carteiras Digitais', sub: 'Apple / Google Pay' }
        ]
    },
    'MX': {
        flag: '🇲🇽',
        methods: [
            { id: 'oxxo', icon: 'fa-barcode', title: 'OXXO Cash', sub: 'Pago en efectivo', primary: true },
            { id: 'card', icon: 'fa-credit-card', title: 'Tarjeta Crédito', sub: 'Hasta 12 meses' },
            { id: 'debit_card', icon: 'fa-credit-card', title: 'Tarjeta Débito', sub: 'Pago imediato' },
            { id: 'link', icon: 'fa-link', title: 'Stripe Link', sub: 'Checkout rápido' },
            { id: 'wallet', icon: 'fa-brands fa-google-pay', title: 'Wallets', sub: 'Google Pay' }
        ]
    },
    'US': {
        flag: '🇺🇸',
        methods: [
            { id: 'card', icon: 'fa-credit-card', title: 'Credit Card', sub: 'Safe & Secure', primary: true },
            { id: 'ach', icon: 'fa-building-columns', title: 'Bank Debit (ACH)', sub: 'Direct transfer' },
            { id: 'link', icon: 'fa-link', title: 'Stripe Link', sub: 'One-click pay' },
            { id: 'wallet', icon: 'fa-brands fa-google-pay', title: 'Digital Wallets', sub: 'Apple / Google Pay' }
        ]
    },
    'CA': {
        flag: '🇨🇦',
        methods: [
            { id: 'interac', icon: 'fa-exchange-alt', title: 'Interac e-Transfer', sub: 'Direct from bank', primary: true },
            { id: 'card', icon: 'fa-credit-card', title: 'Credit Card', sub: 'Visa / Mastercard' },
            { id: 'pad', icon: 'fa-university', title: 'Pre-auth Debit', sub: 'Account withdrawal' },
            { id: 'link', icon: 'fa-link', title: 'Stripe Link', sub: 'Stripe Account' },
            { id: 'wallet', icon: 'fa-brands fa-apple-pay', title: 'Digital Wallets', sub: 'Apple / Google Pay' }
        ]
    },
    'EU': {
        flag: '🇪🇺',
        methods: [
            { id: 'sofort', icon: 'fa-money-bill-transfer', title: 'Sofort / Klarna', sub: 'Instant bank transfer', primary: true },
            { id: 'sepa', icon: 'fa-university', title: 'SEPA Debit', sub: 'Euro standard IBAN' },
            { id: 'klarna', icon: 'fa-shopping-bag', title: 'Klarna BNPL', sub: 'Buy now, pay later' },
            { id: 'card', icon: 'fa-credit-card', title: 'Credit Card', sub: 'Visa / MC / Amex' },
            { id: 'link', icon: 'fa-link', title: 'Stripe Link', sub: 'Stripe Auth' },
            { id: 'wallet', icon: 'fa-brands fa-apple-pay', title: 'Wallets', sub: 'Apple / Google Pay' }
        ]
    },
    'GB': {
        flag: '🇬🇧',
        methods: [
            { id: 'card', icon: 'fa-credit-card', title: 'Debit / Credit Card', sub: 'UK Processing', primary: true },
            { id: 'bacs', icon: 'fa-building-columns', title: 'BACS Direct Debit', sub: 'UK Bank Transfer' },
            { id: 'link', icon: 'fa-link', title: 'Stripe Link', sub: 'Stripe Connect' },
            { id: 'wallet', icon: 'fa-brands fa-apple-pay', title: 'Secure Wallets', sub: 'Apple / Google Pay' }
        ]
    },
    'IN': {
        flag: '🇮🇳',
        methods: [
            { id: 'upi', icon: 'fa-mobile-screen-button', title: 'UPI Pay', sub: 'Scan & Pay', primary: true },
            { id: 'card', icon: 'fa-credit-card', title: 'International Card', sub: 'Visa / Mastercard' },
            { id: 'link', icon: 'fa-link', title: 'Stripe Link', sub: 'Fast Checkout' },
            { id: 'wallet', icon: 'fa-brands fa-google-pay', title: 'Digital Wallet', sub: 'Apple / Google Pay' }
        ]
    },
    'JP': {
        flag: '🇯🇵',
        methods: [
            { id: 'konbini', icon: 'fa-shop', title: 'Konbini', sub: 'Convenience store', primary: true },
            // Comment: Fix: Removed duplicate 'icon' property to resolve object literal naming error.
            { id: 'card', title: 'Credit Card (JCB)', icon: 'fa-credit-card', color: '#00c2ff' },
            { id: 'link', icon: 'fa-link', title: 'Stripe Link', sub: 'Fast Pay' },
            { id: 'wallet', icon: 'fa-brands fa-apple-pay', title: 'Wallets', sub: 'Apple / Google Pay' }
        ]
    },
    'AU': {
        flag: '🇦🇺',
        methods: [
            { id: 'card', icon: 'fa-credit-card', title: 'Credit Card', sub: 'AU Rates', primary: true },
            { id: 'becs', icon: 'fa-university', title: 'BECS Direct Debit', sub: 'Bank account' },
            { id: 'afterpay', icon: 'fa-clock-rotate-left', title: 'Afterpay', sub: 'Installments' },
            { id: 'link', icon: 'fa-link', title: 'Stripe Link', sub: 'Quick checkout' },
            { id: 'wallet', icon: 'fa-brands fa-apple-pay', title: 'Digital Wallets', sub: 'Apple / Google Pay' }
        ]
    },
    'SG': {
        flag: '🇸🇬',
        methods: [
            { id: 'paynow', icon: 'fa-qrcode', title: 'PayNow', sub: 'Instant transfer', primary: true },
            { id: 'grabpay', icon: 'fa-wallet', title: 'GrabPay', sub: 'Mobile wallet' },
            { id: 'card', icon: 'fa-credit-card', title: 'Credit Card', sub: 'Visa / Mastercard' },
            { id: 'link', icon: 'fa-link', title: 'Stripe Link', sub: 'Fast Pay' },
            { id: 'wallet', icon: 'fa-brands fa-google-pay', title: 'Wallets', sub: 'Apple / Google Pay' }
        ]
    },
    'DEFAULT': {
        flag: '🌍',
        methods: [
            { id: 'card', icon: 'fa-credit-card', title: 'International Card', sub: 'Safe processing', primary: true },
            { id: 'link', icon: 'fa-link', title: 'Stripe Link', sub: 'Checkout rápido' },
            { id: 'wallet', icon: 'fa-brands fa-apple-pay', title: 'Carteiras Digitais', sub: 'Apple / Google Pay' }
        ]
    }
};

export const StripeModel: React.FC<StripeModelProps> = ({ group, geo, onSuccess, onError, onTransactionId, convertedPriceInfo }) => {
    const [currentView, setCurrentView] = useState<StripeView>('selection');
    const [redirectTarget, setRedirectTarget] = useState<RedirectionProvider>('stripe');
    const [paymentData, setPaymentData] = useState<any>(null);
    const pollingInterval = useRef<any>(null);

    const country = (geo?.countryCode || 'BR').toUpperCase();
    
    const region = useMemo(() => {
        const euCountries = ['DE', 'FR', 'ES', 'IT', 'PT', 'NL', 'BE', 'AT', 'IE'];
        if (euCountries.includes(country)) return STRIPE_REGIONAL_MATRIX['EU'];
        return STRIPE_REGIONAL_MATRIX[country] || STRIPE_REGIONAL_MATRIX['DEFAULT'];
    }, [country]);

    const filteredMethods = useMemo(() => {
        const config = group.checkoutConfig;
        if (!config || !config.enabledMethods || config.enabledMethods.length === 0) {
            return region.methods;
        }
        return region.methods.filter((m: any) => config.enabledMethods.includes(m.id));
    }, [region.methods, group.checkoutConfig]);

    useEffect(() => {
        return () => { if (pollingInterval.current) clearInterval(pollingInterval.current); };
    }, []);

    const startInternalPayment = async (method: StripeView) => {
        // DISPARO DE ADD PAYMENT INFO
        vipSalesTracker.trackAddPaymentInfo(group, method, convertedPriceInfo);

        const redirects = ['sofort', 'klarna', 'wallet', 'grabpay', 'afterpay', 'link', 'debit_card'];
        
        if (redirects.includes(method)) {
            let target: RedirectionProvider = 'stripe';
            if (method === 'link') target = 'stripe_link';
            if (method === 'wallet') target = 'wallet';
            
            setRedirectTarget(target);
            setCurrentView('redirection');
            return;
        }

        if (['card', 'sepa', 'bacs', 'ach', 'becs', 'pad'].includes(method)) {
            setCurrentView(method);
            return;
        }

        setCurrentView('processing');
        
        if (USE_MOCKS) {
            setTimeout(() => {
                setCurrentView(method);
                if (['pix', 'oxxo', 'konbini', 'upi', 'boleto', 'paynow', 'interac'].includes(method)) {
                    startPolling('mock_id');
                } else {
                    onSuccess();
                }
            }, 1200);
            return;
        }

        try {
            const intent = await stripeService.createPaymentIntent(group, group.creatorEmail!, method);
            setPaymentData(intent);
            onTransactionId(intent.id);
            setCurrentView(method);
            startPolling(intent.id);
        } catch (err: any) {
            onError(err.message || "Error processing local method.");
            setCurrentView('selection');
        }
    };

    const startPolling = (id: string) => {
        if (pollingInterval.current) clearInterval(pollingInterval.current);
        pollingInterval.current = setInterval(async () => {
            try {
                const res = await stripeService.checkSessionStatus(id, group.creatorEmail!);
                if (res.status === 'paid') {
                    clearInterval(pollingInterval.current);
                    onSuccess();
                }
            } catch (e) {}
        }, 4000);
    };

    return (
        <div className="animate-fade-in min-h-[400px] flex flex-col">
            {currentView === 'selection' && (
                <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="text-2xl grayscale-0">{region.flag}</span>
                        <span className="text-[10px] font-black text-[#00c2ff] uppercase tracking-widest">
                            {geo?.countryName || 'Global'} Gateway
                        </span>
                    </div>

                    {filteredMethods.map((m: any, idx: number) => (
                        <div 
                            key={idx}
                            onClick={() => startInternalPayment(m.id)}
                            className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all active:scale-[0.98] ${m.primary ? 'bg-[#00c2ff]/10 border-2 border-[#00c2ff]' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.primary ? 'bg-[#00c2ff] text-black' : 'bg-black/20 text-[#00c2ff]'}`}>
                                <i className={`fa-solid ${m.icon} text-lg`}></i>
                            </div>
                            <div className="text-left flex-1">
                                <span className="font-bold text-sm text-white block">{m.title}</span>
                                <span className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">{m.sub}</span>
                            </div>
                            <i className="fa-solid fa-chevron-right text-[10px] text-gray-700"></i>
                        </div>
                    ))}
                </div>
            )}

            {currentView === 'processing' && (
                <div className="py-20 text-center animate-pulse">
                    <i className="fa-solid fa-circle-notch fa-spin text-3xl text-[#00c2ff] mb-4"></i>
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Bridging secure protocols...</p>
                </div>
            )}

            {/* Vistas de Pagamento */}
            {currentView === 'pix' && <StripePixView data={paymentData} onBack={() => setCurrentView('selection')} />}
            {currentView === 'paynow' && <StripePayNowView data={paymentData} onBack={() => setCurrentView('selection')} />}
            {currentView === 'interac' && <StripeInteracView data={paymentData} onBack={() => setCurrentView('selection')} />}
            {currentView === 'boleto' && <StripeBoletoView data={paymentData} onBack={() => setCurrentView('selection')} />}
            {currentView === 'oxxo' && <StripeOxxoView data={paymentData} onBack={() => setCurrentView('selection')} />}
            {currentView === 'upi' && <StripeUpiView data={paymentData} onBack={() => setCurrentView('selection')} />}
            {currentView === 'konbini' && <StripeKonbiniView data={paymentData} onBack={() => setCurrentView('selection')} />}
            {currentView === 'card' && <StripeCardForm group={group} geo={geo} onBack={() => setCurrentView('selection')} onSuccess={onSuccess} />}
            {currentView === 'sepa' && <StripeSepaForm onBack={() => setCurrentView('selection')} onSuccess={onSuccess} />}
            {currentView === 'ach' && <StripeAchForm onBack={() => setCurrentView('selection')} onSuccess={onSuccess} />}
            {currentView === 'bacs' && <StripeBacsForm onBack={() => setCurrentView('selection')} onSuccess={onSuccess} />}
            {currentView === 'becs' && <StripeBecsForm onBack={() => setCurrentView('selection')} onSuccess={onSuccess} />}
            {currentView === 'pad' && <StripePadForm onBack={() => setCurrentView('selection')} onSuccess={onSuccess} />}
            
            {currentView === 'redirection' && (
                <RedirectionBridgeCard 
                    provider={redirectTarget}
                    price={convertedPriceInfo?.formatted || '...'}
                    onConfirm={() => {
                        onSuccess(); // Simulação
                    }}
                    onBack={() => setCurrentView('selection')}
                />
            )}

            <div className="mt-auto pt-8 text-[9px] text-gray-700 uppercase tracking-widest flex items-center justify-center gap-2">
                <i className="fa-brands fa-stripe text-base"></i> Transação criptografada • Stripe Global
            </div>
        </div>
    );
};
