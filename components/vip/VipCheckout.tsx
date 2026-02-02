import React from 'react';

interface VipCheckoutProps {
    isEnabled: boolean;
    isRenewal: boolean;
    ctaText: string;
    formattedPrice?: string;
    onClick: () => void;
}

export const VipCheckout: React.FC<VipCheckoutProps> = ({ 
    isEnabled, 
    isRenewal, 
    ctaText, 
    formattedPrice, 
    onClick 
}) => {
    return (
        <section className="content-section p-4 max-w-[480px] mx-auto text-center pb-12"> 
            <button 
                className={`w-full relative overflow-hidden rounded-[22px] py-6 px-4 flex flex-col items-center justify-center gap-2 border-2 transition-all duration-200 ${
                    !isEnabled 
                    ? 'bg-[#12161d] border-white/5 text-gray-600 cursor-not-allowed' 
                    : 'bg-[#0c0f14] border-[#00c2ff] text-white active:scale-[0.98] shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                }`}
                onClick={isEnabled ? onClick : undefined}
                disabled={!isEnabled}
            >
                {!isEnabled ? (
                    <span className="text-[10px] font-black uppercase tracking-[3px]">Acesso Indisponível</span>
                ) : (
                    <>
                        <span className="text-[15px] font-black uppercase tracking-[2px] text-[#00c2ff]">
                            {isRenewal ? 'RENOVAR ACESSO AGORA' : ctaText}
                        </span>
                        
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-black tracking-tight text-white">
                                {formattedPrice || '...'}
                            </span>
                        </div>
                    </>
                )}
                
                {/* Subtle highlight line at the top for depth */}
                {isEnabled && (
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10"></div>
                )}
            </button>
            
            <div className="flex items-center justify-center gap-2 mt-6 opacity-30">
                <i className="fa-solid fa-shield-halved text-[9px]"></i>
                <span className="text-[9px] font-black uppercase tracking-[3px]">Checkout Seguro & Criptografado</span>
            </div>
        </section>
    );
};