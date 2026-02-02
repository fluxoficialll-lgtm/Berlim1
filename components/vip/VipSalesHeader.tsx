
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface VipSalesHeaderProps {
    isOwner?: boolean;
    onSimulateClick?: () => void;
    isSimulated?: boolean;
}

export const VipSalesHeader: React.FC<VipSalesHeaderProps> = ({ isOwner, onSimulateClick, isSimulated }) => {
    const navigate = useNavigate();
    
    return (
        <header className="flex items-center justify-between p-[16px_32px] bg-[#0c0f14] fixed w-full z-40 border-b border-white/10" style={{top: '0', height: '70px'}}>
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/groups')} className="bg-none border-none text-[#00c2ff] text-lg cursor-pointer hover:text-white transition-colors">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                {isSimulated && (
                    <div className="animate-pulse bg-[#FFD700] text-black px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter">
                        Simulação Ativa
                    </div>
                )}
            </div>

            <div 
                className="absolute left-1/2 -translate-x-1/2 w-[60px] h-[60px] bg-white/5 rounded-2xl flex justify-center items-center z-20 cursor-pointer shadow-[0_0_20px_rgba(0,194,255,0.3),inset_0_0_20px_rgba(0,194,255,0.08)]" 
                onClick={() => navigate('/feed')}
            >
                 <div className="absolute w-[40px] h-[22px] rounded-[50%] border-[3px] border-[#00c2ff] rotate-[25deg]"></div>
                 <div className="absolute w-[40px] h-[22px] rounded-[50%] border-[3px] border-[#00c2ff] -rotate-[25deg]"></div>
            </div>

            <div className="flex items-center gap-3">
                {isOwner && (
                    <button 
                        onClick={onSimulateClick}
                        className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#00c2ff] hover:bg-[#00c2ff1a] transition-all"
                        title="Simulador Global"
                    >
                        <i className="fa-solid fa-earth-americas"></i>
                    </button>
                )}
                <div style={{width: '24px'}}></div> 
            </div>
        </header>
    );
};
