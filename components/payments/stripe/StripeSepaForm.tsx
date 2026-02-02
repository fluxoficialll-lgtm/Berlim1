
import React, { useState } from 'react';

interface StripeSepaFormProps {
    onBack: () => void;
    onSuccess: () => void;
}

export const StripeSepaForm: React.FC<StripeSepaFormProps> = ({ onBack, onSuccess }) => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onSuccess();
        }, 2000);
    };

    return (
        <form onSubmit={handleSubmit} className="animate-fade-in text-left">
            <button type="button" onClick={onBack} className="text-gray-500 text-[10px] font-black uppercase mb-6 hover:text-white">
                <i className="fa-solid fa-arrow-left mr-2"></i> Voltar
            </button>

            <div className="space-y-5">
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl mb-4">
                    <p className="text-[10px] text-blue-300 font-bold leading-relaxed">
                        Ao fornecer seu IBAN, você autoriza a Stripe a enviar instruções ao seu banco para debitar sua conta.
                    </p>
                </div>

                <div className="input-group mb-0">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 block">Nome do Titular</label>
                    <input className="input-field" placeholder="Full Name" required />
                </div>

                <div className="input-group mb-0">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 block">IBAN</label>
                    <div className="relative">
                        <i className="fa-solid fa-university absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"></i>
                        <input className="input-field pl-11" placeholder="DE00 0000 0000..." required />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-[#00c2ff] text-black font-black rounded-xl shadow-lg mt-6 active:scale-95 transition-all"
                >
                    {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'CONFIRM SEPA DEBIT'}
                </button>
            </div>
        </form>
    );
};
