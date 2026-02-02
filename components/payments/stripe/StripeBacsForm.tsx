
import React, { useState } from 'react';

interface StripeBacsFormProps {
    onBack: () => void;
    onSuccess: () => void;
}

export const StripeBacsForm: React.FC<StripeBacsFormProps> = ({ onBack, onSuccess }) => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onSuccess();
        }, 2500);
    };

    return (
        <form onSubmit={handleSubmit} className="animate-fade-in text-left">
            <button type="button" onClick={onBack} className="text-gray-500 text-[10px] font-black uppercase mb-6 hover:text-white transition-colors">
                <i className="fa-solid fa-arrow-left mr-2"></i> UK Bank Transfer
            </button>

            <div className="space-y-5">
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl">
                    <p className="text-[10px] text-blue-300 font-bold leading-relaxed uppercase tracking-wider">
                        BACS Direct Debit Protection
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1">Your payments are protected by the Direct Debit Guarantee.</p>
                </div>

                <div className="input-group mb-0">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 block">Account Holder Name</label>
                    <input className="input-field" placeholder="John Doe" required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="input-group mb-0">
                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 block">Sort Code</label>
                        <input className="input-field" placeholder="00-00-00" required />
                    </div>
                    <div className="input-group mb-0">
                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 block">Account Number</label>
                        <input className="input-field" placeholder="12345678" required maxLength={8} />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-[#00c2ff] text-black font-black rounded-xl shadow-lg mt-6 active:scale-95 transition-all"
                >
                    {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'CONFIRM BACS DEBIT'}
                </button>
            </div>
        </form>
    );
};
