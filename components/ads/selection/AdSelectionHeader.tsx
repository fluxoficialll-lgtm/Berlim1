import React from 'react';

interface AdSelectionHeaderProps {
    onBack: () => void;
    title: string;
}

export const AdSelectionHeader: React.FC<AdSelectionHeaderProps> = ({ onBack, title }) => {
    return (
        <header className="p-5 flex items-center border-b border-white/5 bg-[#0c0f14]">
            <button 
                onClick={onBack} 
                className="text-white text-xl p-2 hover:bg-white/5 rounded-full transition-all active:scale-90"
            >
                <i className="fa-solid fa-arrow-left"></i>
            </button>
            <h1 className="ml-4 font-bold text-lg text-white">{title}</h1>
        </header>
    );
};