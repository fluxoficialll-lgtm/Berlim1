
import React, { useState, useMemo } from 'react';
import { GeoData } from '../../../services/geoService';

interface StripeCardFormProps {
    group: any;
    geo: GeoData | null;
    onBack: () => void;
    onSuccess: () => void;
}

export const StripeCardForm: React.FC<StripeCardFormProps> = ({ geo, onBack, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [installments, setInstallments] = useState('1');
    
    const countryCode = geo?.countryCode?.toUpperCase() || 'BR';
    const isInstallmentCountry = countryCode === 'BR' || countryCode === 'MX';

    const installmentLabel = useMemo(() => {
        if (countryCode === 'MX') return 'Meses sin Intereses';
        return 'Parcelamento';
    }, [countryCode]);

    const handlePay = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simula processamento do Stripe Elements
        setTimeout(() => {
            setLoading(false);
            onSuccess();
        }, 2000);
    };

    return (
        <form onSubmit={handlePay} className="animate-fade-in text-left">
            <style>{`
                .stripe-input { width: 100%; background: #0c0f14; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px; color: #fff; font-size: 14px; outline: none; transition: 0.3s; }
                .stripe-input:focus { border-color: #00c2ff; }
                .stripe-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1.25rem; }
            `}</style>

            <button type="button" onClick={onBack} className="text-gray-500 text-[10px] font-black uppercase mb-6 hover:text-white">
                <i className="fa-solid fa-arrow-left"></i> Voltar aos métodos
            </button>

            <div className="space-y-4">
                <div className="input-group mb-0">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 block">Número do Cartão</label>
                    <div className="relative">
                        <input className="stripe-input" placeholder="0000 0000 0000 0000" required />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 opacity-50">
                            <i className="fa-brands fa-cc-visa"></i>
                            <i className="fa-brands fa-cc-mastercard"></i>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="input-group mb-0">
                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 block">Validade</label>
                        <input className="stripe-input" placeholder="MM/AA" required />
                    </div>
                    <div className="input-group mb-0">
                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 block">CVC</label>
                        <input className="stripe-input" placeholder="123" required />
                    </div>
                </div>

                <div className="input-group mb-0">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 block">Nome no Cartão</label>
                    <input className="stripe-input" placeholder="NOME COMO ESCRITO" required />
                </div>

                {isInstallmentCountry && (
                    <div className="input-group mb-0 animate-slide-up">
                        <label className="text-[9px] font-black text-[#00c2ff] uppercase tracking-widest mb-1 block">{installmentLabel}</label>
                        <select 
                            className="stripe-input stripe-select" 
                            value={installments} 
                            onChange={(e) => setInstallments(e.target.value)}
                        >
                            <option value="1">1x à vista</option>
                            <option value="2">2x sem juros</option>
                            <option value="3">3x sem juros</option>
                            <option value="4">4x</option>
                            <option value="5">5x</option>
                            <option value="6">6x</option>
                            <option value="7">7x</option>
                            <option value="8">8x</option>
                            <option value="9">9x</option>
                            <option value="10">10x</option>
                            <option value="11">11x</option>
                            <option value="12">12x</option>
                        </select>
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-[#00c2ff] text-black font-black rounded-xl shadow-lg mt-6 active:scale-95 transition-all"
                >
                    {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'CONFIRM PAGAMENTO'}
                </button>
            </div>
        </form>
    );
};
