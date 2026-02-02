
import React from 'react';

interface RevenueHeaderProps {
    onBack: () => void;
    groupName: string;
}

export const RevenueHeader: React.FC<RevenueHeaderProps> = ({ onBack, groupName }) => (
    <header className="flex items-center justify-between p-4 bg-[#0c0f14] sticky top-0 z-50 border-b border-white/10 h-[65px]">
        <button onClick={onBack} className="text-[#00c2ff] text-xl p-2 hover:bg-white/5 rounded-full transition-all">
            <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div className="flex flex-col items-center">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-[2px]">Receita Detalhada</span>
            <h1 className="text-sm font-bold text-white truncate max-w-[180px]">{groupName}</h1>
        </div>
        <div className="w-10"></div>
    </header>
);
