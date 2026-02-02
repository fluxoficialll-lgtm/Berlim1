import React from 'react';
import { useNavigate } from 'react-router-dom';

export const MarketplaceHeader: React.FC = () => {
    const navigate = useNavigate();

    return (
        <header className="flex items-center justify-between p-[16px_32px] bg-[#0c0f14] fixed w-full z-30 border-b border-white/10 h-[80px] top-0">
            <button onClick={() => navigate('/feed')} className="bg-none border-none text-[#00c2ff] text-2xl cursor-pointer transition-all p-1.5">
                <i className="fa-solid fa-arrow-left"></i>
            </button>
            <div 
                className="absolute left-1/2 -translate-x-1/2 w-[60px] h-[60px] bg-white/5 rounded-2xl flex justify-center items-center z-20 cursor-pointer shadow-[0_0_20px_rgba(0,194,255,0.3),inset_0_0_20px_rgba(0,194,255,0.08)]" 
                onClick={() => navigate('/feed')}
            >
                 <div className="absolute w-[40px] h-[22px] rounded-[50%] border-[3px] border-[#00c2ff] rotate-[25deg]"></div>
                 <div className="absolute w-[40px] h-[22px] rounded-[50%] border-[3px] border-[#00c2ff] -rotate-[25deg]"></div>
            </div>
            <button onClick={() => navigate('/my-store')} className="bg-none border-none text-[#00c2ff] text-2xl cursor-pointer transition-all p-1.5">
                <i className="fa-solid fa-briefcase"></i>
            </button>
        </header>
    );
};