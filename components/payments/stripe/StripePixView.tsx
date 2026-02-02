
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface StripePixViewProps {
    data: any;
    onBack: () => void;
}

export const StripePixView: React.FC<StripePixViewProps> = ({ data, onBack }) => {
    const [copied, setCopied] = useState(false);
    
    // Fallback para mock/data nula
    const pixCode = data?.next_action?.pix_display_qr_code?.data || "MOCK_PIX_CODE_STRIPE_FLUX_2024";

    const handleCopy = () => {
        navigator.clipboard.writeText(pixCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="animate-fade-in text-center py-2">
            <div className="flex items-center justify-between mb-6">
                <button onClick={onBack} className="text-gray-500 text-xs font-bold uppercase hover:text-white transition-colors">
                    <i className="fa-solid fa-arrow-left mr-1"></i> Voltar
                </button>
                <div className="bg-[#00ff82]/10 text-[#00ff82] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border border-[#00ff82]/20">
                    Pix Stripe
                </div>
            </div>

            <div className="bg-white p-3 rounded-2xl inline-block shadow-2xl mb-6">
                <QRCodeSVG value={pixCode} size={200} />
            </div>

            <div className="space-y-4">
                <div className="bg-black/40 border border-dashed border-[#00c2ff]/30 p-4 rounded-xl relative group">
                    <p className="text-[9px] text-gray-500 font-mono break-all line-clamp-2">{pixCode}</p>
                </div>

                <button 
                    onClick={handleCopy}
                    className="w-full py-4 bg-[#00c2ff] text-black font-black rounded-xl shadow-lg transition-all active:scale-95"
                >
                    {copied ? <><i className="fa-solid fa-check mr-2"></i> COPIADO!</> : <><i className="fa-solid fa-copy mr-2"></i> COPIAR CÓDIGO PIX</>}
                </button>

                <div className="flex items-center justify-center gap-3 text-[10px] text-gray-600 font-bold uppercase animate-pulse">
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Aguardando Aprovação
                </div>
            </div>
        </div>
    );
};
