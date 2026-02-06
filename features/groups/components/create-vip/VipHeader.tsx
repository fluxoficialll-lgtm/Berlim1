
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface VipHeaderProps {
  onBack: () => void;
}

export const VipHeader: React.FC<VipHeaderProps> = ({ onBack }) => {
  const navigate = useNavigate();

  return (
    <header>
      <button onClick={onBack}><i className="fa-solid fa-arrow-left"></i></button>
      <div className="absolute left-1/2 -translate-x-1/2 w-[60px] h-[60px] bg-white/5 rounded-2xl flex justify-center items-center z-20 cursor-pointer shadow-[0_0_20px_rgba(0,194,255,0.3),inset_0_0_20px_rgba(0,194,255,0.08)]" onClick={() => navigate('/feed')}>
           <div className="absolute w-[40px] h-[22px] rounded-[50%] border-[3px] border-[#00c2ff] rotate-[25deg]"></div>
           <div className="absolute w-[40px] h-[22px] rounded-[50%] border-[3px] border-[#00c2ff] -rotate-[25deg]"></div>
      </div>
    </header>
  );
};
