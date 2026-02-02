
import React, { useState } from 'react';

export const PREVIEW_COUNTRIES = [
    { code: 'BR', name: 'Brasil', currency: 'BRL', flag: '🇧🇷' },
    { code: 'US', name: 'Estados Unidos', currency: 'USD', flag: '🇺🇸' },
    { code: 'EU', name: 'Europa', currency: 'EUR', flag: '🇪🇺' },
    { code: 'GB', name: 'Reino Unido', currency: 'GBP', flag: '🇬🇧' },
    { code: 'CA', name: 'Canadá', currency: 'CAD', flag: '🇨🇦' },
    { code: 'SG', name: 'Singapura', currency: 'SGD', flag: '🇸🇬' },
    { code: 'AU', name: 'Austrália', currency: 'AUD', flag: '🇦🇺' },
    { code: 'MX', name: 'México', currency: 'MXN', flag: '🇲🇽' },
    { code: 'JP', name: 'Japão', currency: 'JPY', flag: '🇯🇵' },
    { code: 'IN', name: 'Índia', currency: 'INR', flag: '🇮🇳' },
];

interface GlobalSimulatorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (provider: 'syncpay' | 'stripe' | 'paypal', country: typeof PREVIEW_COUNTRIES[0]) => void;
}

type Step = 'provider' | 'country';

export const GlobalSimulatorModal: React.FC<GlobalSimulatorModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [step, setStep] = useState<Step>('provider');
    const [selectedProvider, setSelectedProvider] = useState<'syncpay' | 'stripe' | 'paypal' | null>(null);

    if (!isOpen) return null;

    const handleSelectProvider = (provider: 'syncpay' | 'stripe' | 'paypal') => {
        setSelectedProvider(provider);
        // SyncPay é exclusivo Brasil no nosso sistema VIP
        if (provider === 'syncpay') {
            onConfirm('syncpay', PREVIEW_COUNTRIES.find(c => c.code === 'BR')!);
            setStep('provider'); 
        } else {
            setStep('country');
        }
    };

    const handleSelectCountry = (country: typeof PREVIEW_COUNTRIES[0]) => {
        if (selectedProvider) {
            onConfirm(selectedProvider, country);
            setStep('provider'); 
        }
    };

    const handleBack = () => setStep('provider');

    return (
        <div className="simulator-modal fixed inset-0 bg-black/90 z-[150] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in" onClick={onClose}>
            <style>{`
                .simulator-card { 
                    background: #0c0f14; 
                    border-radius: 28px; 
                    padding: 24px; 
                    width: 100%; 
                    max-width: 400px; 
                    border: 1px solid rgba(0, 194, 255, 0.3); 
                    box-shadow: 0 20px 60px rgba(0,0,0,0.8);
                    position: relative;
                }
                
                .step-indicator {
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    margin-bottom: 20px;
                }
                .dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.1); }
                .dot.active { background: #00c2ff; box-shadow: 0 0 10px #00c2ff; }

                .provider-btn {
                    width: 100%;
                    padding: 18px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;
                    transition: 0.2s;
                    margin-bottom: 10px;
                }
                .provider-btn:hover { border-color: #00c2ff; background: rgba(0, 194, 255, 0.05); }

                .country-grid { 
                    display: grid; 
                    grid-template-columns: repeat(2, 1fr); 
                    gap: 10px; 
                    max-height: 400px;
                    overflow-y: auto;
                    padding-right: 5px;
                }
                .country-btn { 
                    background: rgba(255,255,255,0.03); 
                    border: 1px solid rgba(255,255,255,0.08); 
                    padding: 14px; 
                    border-radius: 16px; 
                    display: flex; 
                    align-items: center; 
                    gap: 10px;
                    cursor: pointer; 
                    transition: 0.2s; 
                    font-size: 13px;
                }
                .country-btn:hover { background: #00c2ff11; border-color: #00c2ff; }
            `}</style>
            
            <div className="simulator-card animate-pop-in" onClick={e => e.stopPropagation()}>
                <div className="text-center mb-6">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">
                        {step === 'provider' ? '1. Escolha o Provedor' : '2. Escolha o Mercado'}
                    </h3>
                    <div className="step-indicator">
                        <div className={`dot ${step === 'provider' ? 'active' : ''}`}></div>
                        <div className={`dot ${step === 'country' ? 'active' : ''}`}></div>
                    </div>
                </div>

                {step === 'provider' ? (
                    <div className="animate-fade-in">
                        <button className="provider-btn" onClick={() => handleSelectProvider('syncpay')}>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[#00ff8211] rounded-xl flex items-center justify-center text-[#00ff82]">
                                    <i className="fa-solid fa-bolt"></i>
                                </div>
                                <div className="text-left">
                                    <span className="block text-sm font-bold">SyncPay</span>
                                    <span className="block text-[10px] text-gray-500 font-bold uppercase">Brasil (Pix/Boleto)</span>
                                </div>
                            </div>
                            <i className="fa-solid fa-chevron-right text-gray-800 text-xs"></i>
                        </button>

                        <button className="provider-btn" onClick={() => handleSelectProvider('stripe')}>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[#635bff11] rounded-xl flex items-center justify-center text-[#635bff]">
                                    <i className="fa-brands fa-stripe"></i>
                                </div>
                                <div className="text-left">
                                    <span className="block text-sm font-bold">Stripe</span>
                                    <span className="block text-[10px] text-gray-500 font-bold uppercase">Global (Cartão/Local)</span>
                                </div>
                            </div>
                            <i className="fa-solid fa-chevron-right text-gray-800 text-xs"></i>
                        </button>

                        <button className="provider-btn" onClick={() => handleSelectProvider('paypal')}>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[#00308711] rounded-xl flex items-center justify-center text-[#003087]">
                                    <i className="fa-brands fa-paypal"></i>
                                </div>
                                <div className="text-left">
                                    <span className="block text-sm font-bold">PayPal</span>
                                    <span className="block text-[10px] text-gray-500 font-bold uppercase">Carteira Digital</span>
                                </div>
                            </div>
                            <i className="fa-solid fa-chevron-right text-gray-800 text-xs"></i>
                        </button>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <div className="country-grid no-scrollbar">
                            {PREVIEW_COUNTRIES.map(c => (
                                <button key={c.code} className="country-btn" onClick={() => handleSelectCountry(c)}>
                                    <span className="text-xl grayscale-0">{c.flag}</span>
                                    <span className="truncate font-bold">{c.name}</span>
                                </button>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-2 text-[#00c2ff] font-bold text-[10px] uppercase tracking-widest" onClick={handleBack}>
                            <i className="fa-solid fa-arrow-left mr-2"></i> Voltar ao Provedor
                        </button>
                    </div>
                )}
                
                <button className="w-full mt-8 py-2 text-gray-600 font-black uppercase text-[10px] tracking-[3px] hover:text-white transition-colors" onClick={onClose}>
                    Cancelar
                </button>
            </div>
        </div>
    );
};
