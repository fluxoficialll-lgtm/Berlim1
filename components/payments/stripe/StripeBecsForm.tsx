import React, { useState } from 'react';

interface StripeBecsFormProps {
    onBack: () => void;
    onSuccess: () => void;
}

export const StripeBecsForm: React.FC<StripeBecsFormProps> = ({ onBack, onSuccess }) => {
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
                <i className="fa-solid fa-arrow-left mr-2"></i> AU Direct Debit
            </button>

            <div className="space-y-5">
                <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl mb-4">
                    <p className="text-[10px] text-orange-300 font-bold leading-relaxed">
                        BECS Direct Debit: By providing your details, you authorize Stripe to debit your AU bank account.
                    </p>
                </div>

                <div className="input-group mb-0">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 block">Account Name</label>
                    <input className="input-field" placeholder="Legal Name" required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="input-group mb-0">
                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 block">BSB Number</label>
                        <input className="input-field" placeholder="000-000" required maxLength={7} />
                    </div>
                    <div className="input-group mb-0">
                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 block">Account Number</label>
                        <input className="input-field" placeholder="9 digits" required />
                    </div>
                </div>

                <div className="input-group mb-0">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 block">Email</label>
                    <input className="input-field" type="email" placeholder="receipt@domain.au" required />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-[#00c2ff] text-black font-black rounded-xl shadow-lg mt-6 active:scale-95 transition-all"
                >
                    {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'CONFIRM BECS DEBIT'}
                </button>
            </div>
        </form>
    );
};