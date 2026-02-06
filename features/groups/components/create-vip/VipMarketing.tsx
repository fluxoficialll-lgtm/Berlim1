
import React from 'react';

interface VipMarketingProps {
  pixelId: string;
  onPixelClick: () => void;
}

export const VipMarketing: React.FC<VipMarketingProps> = ({ pixelId, onPixelClick }) => {
  return (
    <div className="vip-door-section">
      <div className="section-title"><i className="fa-solid fa-rocket"></i> Marketing Avançado</div>
      <button type="button" className="add-pixel-btn" onClick={onPixelClick}>
        <i className="fa-solid fa-plus-circle"></i>
        {pixelId ? 'PIXEL CONFIGURADO' : 'ADICIONAR PIXEL'}
      </button>
      {pixelId && <p className="text-[10px] text-[#00ff82] text-center mt-2 font-bold uppercase tracking-widest"><i className="fa-solid fa-check"></i> Meta Pixel Ativo</p>}
    </div>
  );
};
