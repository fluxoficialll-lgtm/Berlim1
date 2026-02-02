
import React from 'react';

interface CheckoutConfigHeaderProps {
    onBack: () => void;
}

export const CheckoutConfigHeader: React.FC<CheckoutConfigHeaderProps> = ({ onBack }) => {
    return (
        <header className="flex items-center p-4 bg-[#0c0f14] border-b border-white/10 h-[65px] sticky top-0 z-50">
            <button onClick={onBack} className="mr-4 text-[#00c2ff] text-xl p-2 hover:bg-white/5 rounded-full transition-all active:scale-90">
                <i className="fa-solid fa-arrow-left"></i>
            </button>
            <h1 className="font-bold text-white">Checkout Personalizado</h1>
        </header>
    );
};
