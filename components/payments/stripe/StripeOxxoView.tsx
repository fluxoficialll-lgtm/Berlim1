
import React from 'react';

interface StripeOxxoViewProps {
    data: any;
    onBack: () => void;
}

export const StripeOxxoView: React.FC<StripeOxxoViewProps> = ({ onBack, data }) => {
    return (
        <div className="animate-fade-in text-center">
            <button onClick={onBack} className="flex items-center text-gray-600 text-[10px] font-black uppercase mb-6">
                <i className="fa-solid fa-arrow-left mr-2"></i> Voltar
            </button>

            <div className="bg-white rounded-2xl p-6 mb-6">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Oxxo_Logo.svg/1200px-Oxxo_Logo.svg.png" className="h-8 mx-auto mb-6" alt="OXXO" />
                
                <div className="bg-black/5 p-4 rounded-xl mb-6">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block mb-2">Número de Referencia</span>
                    <div className="text-xl font-black text-black tracking-widest">
                        {data?.next_action?.oxxo_display_details?.number || "0000-0000-0000-00"}
                    </div>
                </div>

                <div className="w-full h-12 bg-black/10 rounded flex items-center justify-center">
                    <i className="fa-solid fa-barcode text-4xl text-black"></i>
                </div>
            </div>

            <p className="text-[11px] text-gray-500 leading-relaxed px-4">
                Paga en efectivo en cualquier tienda OXXO. Tu acceso será liberado automáticamente tras la confirmación.
            </p>
        </div>
    );
};
