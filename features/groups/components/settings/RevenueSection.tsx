
import React from 'react';

interface RevenueSectionProps {
    groupId: string;
    onViewRevenue: () => void;
}

export const RevenueSection: React.FC<RevenueSectionProps> = ({ onViewRevenue }) => {
    return (
        <div className="flex flex-col items-center gap-4 py-2">
            <div className="text-center px-4">
                <h4 className="font-bold text-white text-sm">Dashboard de Faturamento</h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Dados de conversão e receita bruta</p>
            </div>
            <button 
                onClick={onViewRevenue}
                className="w-full py-3.5 bg-white/5 border border-[#00c2ff]/30 text-[#00c2ff] font-black uppercase text-xs tracking-widest rounded-xl transition-all hover:bg-[#00c2ff]/10"
            >
                Ver Relatório Completo
            </button>
        </div>
    );
};
