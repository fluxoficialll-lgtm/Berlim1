import React from 'react';

interface StripeInteracViewProps {
    data: any;
    onBack: () => void;
}

export const StripeInteracView: React.FC<StripeInteracViewProps> = ({ onBack, data }) => {
    return (
        <div className="animate-fade-in text-left">
            <button onClick={onBack} className="flex items-center text-gray-600 text-[10px] font-black uppercase mb-6">
                <i className="fa-solid fa-arrow-left mr-2"></i> Back
            </button>

            <div className="bg-[#1a1e26] border border-white/5 rounded-3xl p-8 mb-6 shadow-2xl">
                <div className="flex justify-center mb-8">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Interac_logo.svg/2560px-Interac_logo.svg.png" className="h-6" alt="Interac" />
                </div>

                <div className="space-y-6">
                    <div>
                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest block mb-2">Step 1</span>
                        <p className="text-sm font-bold text-white">Log in to your online bank.</p>
                    </div>
                    
                    <div className="h-px bg-white/5"></div>

                    <div>
                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest block mb-2">Step 2</span>
                        <p className="text-sm font-bold text-white">Send an e-Transfer to the email provided by Stripe after confirmation.</p>
                    </div>

                    <div className="bg-[#00c2ff11] p-4 rounded-xl border border-[#00c2ff22] animate-pulse">
                         <p className="text-[11px] text-[#00c2ff] font-medium leading-relaxed">
                            Click below to generate your unique Interac reference.
                         </p>
                    </div>
                </div>
            </div>

            <button 
                className="w-full py-4 bg-[#00c2ff] text-black font-black rounded-2xl shadow-xl uppercase text-xs tracking-widest active:scale-95 transition-all"
            >
                Generate Transfer ID
            </button>
        </div>
    );
};