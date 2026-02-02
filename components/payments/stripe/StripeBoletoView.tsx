
import React, { useState } from 'react';

interface StripeBoletoViewProps {
    data: any;
    onBack: () => void;
}

export const StripeBoletoView: React.FC<StripeBoletoViewProps> = ({ data, onBack }) => {
    const [copied, setCopied] = useState(false);
    const barcode = data?.next_action?.display_details?.barcode_number || "00090.00005 00000.000005 00000.000005 0 000000000000";

    const handleCopy = () => {
        navigator.clipboard.writeText(barcode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="animate-fade-in text-center py-2">
            <button onClick={onBack} className="flex items-center text-gray-600 text-[10px] font-black uppercase mb-6 hover:text-white transition-colors">
                <i className="fa-solid fa-arrow-left mr-2"></i> Alterar Método
            </button>

            <div className="bg-white rounded-2xl p-6 mb-6">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Logo_Boleto_Simples.png" className="h-6" alt="Boleto" />
                    <span className="text-[10px] font-black text-gray-400 uppercase">Vencimento em 3 dias</span>
                </div>
                
                <div className="bg-black/5 p-4 rounded-xl mb-4 text-left">
                    <span className="text-[9px] text-gray-400 font-bold uppercase block mb-1">Linha Digitável</span>
                    <div className="text-[11px] font-mono text-black break-all leading-relaxed font-black">
                        {barcode}
                    </div>
                </div>

                <div className="w-full h-12 bg-black/5 rounded flex items-center justify-center opacity-40">
                    <i className="fa-solid fa-barcode text-5xl text-black"></i>
                </div>
            </div>

            <div className="space-y-4">
                <button 
                    onClick={handleCopy}
                    className="w-full py-4 bg-[#00c2ff] text-black font-black rounded-xl shadow-lg transition-all active:scale-95"
                >
                    {copied ? 'CÓDIGO COPIADO!' : 'COPIAR LINHA DIGITÁVEL'}
                </button>

                <p className="text-[11px] text-gray-500 leading-relaxed px-4">
                    Seu acesso será liberado em até <span className="text-white font-bold">24h úteis</span> após o pagamento do boleto.
                </p>
            </div>
        </div>
    );
};
