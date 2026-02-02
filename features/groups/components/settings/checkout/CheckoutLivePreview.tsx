
import React from 'react';

interface PreviewMethod {
    id: string;
    label: string;
    icon: string;
    color: string;
}

interface CheckoutLivePreviewProps {
    enabledMethods: PreviewMethod[];
}

export const CheckoutLivePreview: React.FC<CheckoutLivePreviewProps> = ({ enabledMethods }) => {
    return (
        <div className="mt-10 animate-fade-in">
            <div className="text-center mb-4">
                <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-[4px]">Previsão do Checkout</span>
            </div>
            
            <div className="bg-[#0c0f14] border-2 border-[#1a1e26] rounded-[40px] p-6 w-full max-w-[320px] mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                <div className="text-[10px] text-gray-600 font-bold uppercase mb-5 text-center tracking-widest">
                    Interface do Cliente
                </div>
                
                <div className="space-y-2.5 min-h-[120px] flex flex-col justify-center">
                    {enabledMethods.length > 0 ? (
                        enabledMethods.map(m => (
                            <div key={m.id} className="w-full p-4 rounded-xl flex items-center gap-3 bg-white/5 border border-white/5 animate-slide-up">
                                <i className={`fa-solid ${m.icon} text-sm`} style={{ color: m.color }}></i>
                                <span className="text-[12px] font-bold text-white">Pagar com {m.label}</span>
                            </div>
                        ))
                    ) : (
                        <div className="py-10 text-center opacity-20 flex flex-col items-center gap-2">
                            <i className="fa-solid fa-ghost text-3xl"></i>
                            <p className="text-[9px] font-black uppercase tracking-widest">Nenhum método ativo</p>
                        </div>
                    )}
                </div>
                
                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-center gap-2 opacity-30">
                    <i className="fa-solid fa-shield-halved text-[9px]"></i>
                    <span className="text-[8px] font-black uppercase tracking-[2px]">Flux Secure Engine</span>
                </div>
            </div>
        </div>
    );
};
