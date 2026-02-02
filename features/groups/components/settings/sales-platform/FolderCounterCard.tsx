
import React from 'react';

interface FolderCounterCardProps {
    count: number;
    onAdjust: (amount: number) => void;
}

export const FolderCounterCard: React.FC<FolderCounterCardProps> = ({ count, onAdjust }) => {
    return (
        <div className="bg-black/20 rounded-2xl p-6 border border-white/5 mb-6">
            <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#00c2ff]/10 flex items-center justify-center text-[#00c2ff] text-2xl">
                    <i className="fa-solid fa-folder-tree"></i>
                </div>
                <div className="text-center">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] block mb-1">Quantia de Pastas Ativas</span>
                    <div className="text-4xl font-black text-white">{count}</div>
                </div>
                
                <div className="flex gap-4 mt-2">
                    <button 
                        onClick={() => onAdjust(-1)}
                        className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all"
                    >
                        <i className="fa-solid fa-minus"></i>
                    </button>
                    <button 
                        onClick={() => onAdjust(1)}
                        className="w-12 h-12 rounded-xl bg-[#00c2ff]/20 border border-[#00c2ff]/30 flex items-center justify-center text-[#00c2ff] active:scale-90 transition-all"
                    >
                        <i className="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};
