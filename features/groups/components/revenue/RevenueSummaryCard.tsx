
import React from 'react';

interface RevenueSummaryCardProps {
    totalAmount: string;
    totalSales: number;
    avgTicket: string;
    color: string;
}

export const RevenueSummaryCard: React.FC<RevenueSummaryCardProps> = ({ totalAmount, totalSales, avgTicket, color }) => (
    <div className="bg-gradient-to-br from-[#1e2531] to-[#0c0f14] border border-white/10 rounded-[32px] p-8 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00c2ff] to-transparent opacity-30"></div>
        <span className="text-[10px] font-black text-[#00c2ff] uppercase tracking-[3px] block mb-2 text-center opacity-70">Faturamento Bruto</span>
        <div className="text-5xl font-black text-white text-center drop-shadow-2xl" style={{ color }}>
            {totalAmount}
        </div>
        
        <div className="flex justify-center gap-10 mt-8 pt-6 border-t border-white/5">
            <div className="text-center">
                <span className="text-[9px] font-bold text-gray-500 uppercase block mb-1 tracking-widest">Vendas</span>
                <span className="text-xl font-black text-white">{totalSales}</span>
            </div>
            <div className="text-center">
                <span className="text-[9px] font-bold text-gray-500 uppercase block mb-1 tracking-widest">Ticket Médio</span>
                <span className="text-xl font-black text-[#00ff82]">{avgTicket}</span>
            </div>
        </div>
    </div>
);
