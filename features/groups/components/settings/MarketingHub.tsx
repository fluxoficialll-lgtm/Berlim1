import React from 'react';

interface MarketingHubProps {
  pixels: { metaId?: string; tiktokId?: string; googleId?: string };
  onConfig: (platform: string) => void;
}

export const MarketingHub: React.FC<MarketingHubProps> = ({ pixels, onConfig }) => (
  <div className="space-y-3">
    <h4 className="text-[10px] font-black text-[#FFD700] uppercase tracking-widest mb-4">Rastreamento e Performance</h4>
    <div className="grid gap-3">
      {[
        { id: 'meta', name: 'Meta Pixel', active: !!pixels.metaId, icon: 'fa-brands fa-facebook' },
        { id: 'tiktok', name: 'TikTok Ads', active: !!pixels.tiktokId, icon: 'fa-brands fa-tiktok' }
      ].map(p => (
        <button key={p.id} onClick={() => onConfig(p.id)} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:border-[#FFD70033] transition-all">
          <div className="flex items-center gap-3">
            <i className={`${p.icon} text-lg ${p.active ? 'text-[#00ff82]' : 'text-gray-600'}`}></i>
            <span className="text-sm font-bold">{p.name}</span>
          </div>
          <span className={`text-[9px] font-black uppercase ${p.active ? 'text-[#00ff82]' : 'text-gray-600'}`}>
            {p.active ? 'Conectado' : 'Configurar'}
          </span>
        </button>
      ))}
    </div>
  </div>
);