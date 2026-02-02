import React from 'react';

interface VipSalesCTAProps {
    isEnabled: boolean;
    isRenewal: boolean;
    ctaText: string;
    formattedPrice?: string;
    onClick: () => void;
}

export const VipSalesCTA: React.FC<VipSalesCTAProps> = ({ 
    isEnabled, 
    isRenewal, 
    ctaText, 
    formattedPrice, 
    onClick 
}) => {
    return (
        <section className="content-section p-4 max-w-[450px] mx-auto text-center pb-10"> 
            <button 
                className={`cta-button w-[90%] mx-auto block p-[1rem_0] rounded-[12px] text-[1.5rem] font-bold border-none transition-all duration-200 ${
                    !isEnabled 
                    ? 'disabled bg-[#333] text-[#777] cursor-not-allowed shadow-none' 
                    : isRenewal 
                    ? 'renewal bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black shadow-[0_5px_20px_rgba(255,215,0,0.5)]'
                    : 'bg-gradient-to-r from-[#00c2ff] to-[#00aaff] text-[#0c0f14] shadow-[0_5px_20px_rgba(0,194,255,0.5)] cursor-pointer active:scale-[0.98]'
                }`}
                onClick={isEnabled ? onClick : undefined}
                disabled={!isEnabled}
            >
                {!isEnabled 
                    ? 'COMPRA INDISPONÍVEL' 
                    : (isRenewal ? 'RENOVAR ASSINATURA' : `${ctaText} - ${formattedPrice || '...'}`)
                }
            </button>
            <p className="text-xs text-gray-500 mt-3">
                <i className="fa-solid fa-shield-halved"></i> Pagamento processado com segurança
            </p>
        </section>
    );
};