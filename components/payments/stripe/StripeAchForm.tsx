import React, { useState } from 'react';

interface StripeAchFormProps {
    onBack: () => void;
    onSuccess: () => void;
}

export const StripeAchForm: React.FC<StripeAchFormProps> = ({ onBack, onSuccess }) => {
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
                <i className="fa-solid fa-arrow-left mr-2"></i> US Bank Account
            </button>

            <div className="space-y-5">
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl mb-4">
                    <p className="text-[10px] text-blue-300 font-bold leading-relaxed">
                        Securely connect your bank account via ACH Direct Debit. Payments are verified through Stripe's secure channel.
                    </p>
                </div>

                <div className="input-group mb-0">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 block">Account Holder Type</label>
                    <div className="flex gap-2">
                        <button type="button" className="flex-1 py-3 bg-[#0c0f14] border border-[#00c2ff] text-[#00c2ff] text-xs font-bold rounded-xl">Individual</button>
                        <button type="button" className="flex-1 py-3 bg-[#0c0f14] border border-white/5 text-gray-500 text-xs font-bold rounded-xl">Company</button>
                    </div>
                </div>

                <div className="input-group mb-0">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 block">Routing Number</label>
                    <input className="input-field" placeholder="9 digits" required maxLength={9} />
                </div>

                <div className="input-group mb-0">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 block">Account Number</label>
                    <input className="input-field" placeholder="Your checking account number" required />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-[#00c2ff] text-black font-black rounded-xl shadow-lg mt-6 active:scale-95 transition-all"
                >
                    {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'CONFIRM ACH DEBIT'}
                </button>
            </div>
        </form>
    );
};