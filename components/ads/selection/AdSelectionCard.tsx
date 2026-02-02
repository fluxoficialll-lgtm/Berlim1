import React from 'react';

interface AdSelectionCardProps {
    title: string;
    description: string;
    icon: string;
    onClick: () => void;
    variant: 'new' | 'boost';
}

export const AdSelectionCard: React.FC<AdSelectionCardProps> = ({ 
    title, 
    description, 
    icon, 
    onClick, 
    variant 
}) => {
    const isBoost = variant === 'boost';
    
    return (
        <div 
            className={`group relative w-full bg-white/[0.03] border border-white/5 rounded-[28px] p-7 flex items-center gap-6 cursor-pointer transition-all duration-300 hover:bg-white/[0.06] hover:-translate-y-1 active:scale-[0.98] overflow-hidden`}
            onClick={onClick}
            style={{
                borderColor: isBoost ? 'rgba(255, 215, 0, 0.1)' : 'rgba(0, 255, 130, 0.1)',
            }}
        >
            {/* Efeito de brilho no hover */}
            <div className={`absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity blur-xl z-0 pointer-events-none ${
                isBoost ? 'bg-[#FFD700]/5' : 'bg-[#00ff82]/5'
            }`}></div>

            <div className={`relative z-10 w-[64px] h-[64px] rounded-[20px] flex items-center justify-center text-2xl flex-shrink-0 border border-white/5 transition-all duration-500 group-hover:scale-110 ${
                isBoost 
                ? 'text-[#FFD700] bg-[#FFD7001a] shadow-[0_0_20px_rgba(255,215,0,0.1)]' 
                : 'text-[#00ff82] bg-[#00ff821a] shadow-[0_0_20px_rgba(0,255,130,0.1)]'
            }`}>
                <i className={`fa-solid ${icon}`}></i>
            </div>
            
            <div className="relative z-10 flex-1 min-w-0">
                <h2 className="text-[18px] font-black text-white mb-1.5 tracking-tight group-hover:text-white transition-colors">{title}</h2>
                <p className="text-[13px] text-gray-500 leading-relaxed font-medium group-hover:text-gray-400 transition-colors">{description}</p>
            </div>
            
            <div className="relative z-10 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-700 group-hover:text-[#00c2ff] group-hover:bg-[#00c2ff1a] transition-all">
                <i className="fa-solid fa-chevron-right text-[10px]"></i>
            </div>
        </div>
    );
};