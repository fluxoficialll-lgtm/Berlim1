
import React from 'react';

interface CheckoutStepSelectorProps {
    provider: string;
    country: string;
    onSelectProvider: () => void;
    onSelectCountry: () => void;
}

export const CheckoutStepSelector: React.FC<CheckoutStepSelectorProps> = ({
    provider, country, onSelectProvider, onSelectCountry
}) => {
    return (
        <div className="grid grid-cols-2 gap-3 mb-6">
            <div 
                className="bg-white/5 border border-white/10 rounded-2xl p-4 cursor-pointer hover:border-[#00c2ff33] transition-all" 
                onClick={onSelectProvider}
            >
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-2">Provedor</span>
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <i className="fa-solid fa-wallet text-[#00c2ff]"></i>
                    {provider.toUpperCase()}
                </div>
            </div>
            
            <div 
                className="bg-white/5 border border-white/10 rounded-2xl p-4 cursor-pointer hover:border-[#00ff8233] transition-all" 
                onClick={onSelectCountry}
            >
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-2">País Alvo</span>
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <i className="fa-solid fa-earth-americas text-[#00ff82]"></i>
                    {country}
                </div>
            </div>
        </div>
    );
};
