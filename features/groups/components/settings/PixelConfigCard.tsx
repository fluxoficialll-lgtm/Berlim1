import React from 'react';

interface PixelConfig {
    metaId?: string;
    tiktokId?: string;
    googleId?: string;
    xId?: string;
}

interface PixelConfigCardProps {
    config: PixelConfig;
    onOpen: (platform?: string) => void;
}

export const PixelConfigCard: React.FC<PixelConfigCardProps> = ({ config, onOpen }) => {
    const platforms = [
        { id: 'meta', name: 'Meta (Facebook)', icon: 'fa-brands fa-facebook', active: !!config.metaId, color: '#1877F2' },
        { id: 'tiktok', name: 'TikTok Ads', icon: 'fa-brands fa-tiktok', active: !!config.tiktokId, color: '#00f2ea' },
        { id: 'google', name: 'Google Ads', icon: 'fa-brands fa-google', active: !!config.googleId, color: '#4285F4' },
        { id: 'x', name: 'X / Twitter', icon: 'fa-brands fa-x-twitter', active: !!config.xId, color: '#fff' },
    ];

    const activePlatforms = platforms.filter(p => p.active);

    return (
        <div className="bg-black/20 border border-white/5 rounded-[32px] p-6 mb-6 overflow-hidden animate-fade-in">
            <style>{`
                .add-pixel-trigger {
                    width: 100%;
                    padding: 18px;
                    background: rgba(0, 194, 255, 0.05);
                    border: 1px dashed rgba(0, 194, 255, 0.3);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;
                    transition: 0.3s;
                    margin-bottom: 20px;
                }
                .add-pixel-trigger:hover {
                    background: rgba(0, 194, 255, 0.1);
                    border-color: #00c2ff;
                }
                .active-pixel-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 14px 18px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    margin-bottom: 8px;
                    cursor: pointer;
                    transition: 0.2s;
                }
                .active-pixel-item:hover {
                    background: rgba(255, 255, 255, 0.06);
                    border-color: rgba(255, 215, 0, 0.2);
                }
                .pixel-status-tag {
                    font-size: 8px;
                    font-weight: 900;
                    color: #00ff82;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    background: rgba(0, 255, 130, 0.1);
                    padding: 2px 6px;
                    border-radius: 4px;
                    margin-left: auto;
                }
            `}</style>

            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#FFD7001a] flex items-center justify-center text-[#FFD700] text-xl border border-[#FFD70033]">
                    <i className="fa-solid fa-rocket"></i>
                </div>
                <div>
                    <h4 className="font-bold text-white text-sm">Hub de Marketing</h4>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Multi-Pixel Tracking</p>
                </div>
            </div>

            <div className="add-pixel-trigger" onClick={() => onOpen()}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#00c2ff1a] flex items-center justify-center text-[#00c2ff]">
                        <i className="fa-solid fa-plus"></i>
                    </div>
                    <span className="text-xs font-black text-white uppercase tracking-wider">Adicionar Pixel</span>
                </div>
                <i className="fa-solid fa-chevron-right text-gray-700 text-[10px]"></i>
            </div>

            {activePlatforms.length > 0 ? (
                <div className="space-y-2">
                    <h5 className="text-[9px] font-black text-gray-600 uppercase tracking-[2px] ml-1 mb-3">Pixels Ativos ({activePlatforms.length})</h5>
                    {activePlatforms.map(p => (
                        <div 
                            key={p.id} 
                            className="active-pixel-item animate-slide-up"
                            onClick={() => onOpen(p.id)}
                        >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/40" style={{ color: p.color }}>
                                <i className={p.icon}></i>
                            </div>
                            <span className="text-xs font-bold text-gray-300">{p.name}</span>
                            <div className="pixel-status-tag">Ativo</div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-[10px] text-gray-600 text-center italic mt-2">Nenhum pixel configurado ainda.</p>
            )}

            <p className="text-[8px] text-gray-700 text-center mt-6 uppercase font-black tracking-widest leading-relaxed">
                O Flux enviará eventos de conversão (Lead, InitiateCheckout e Purchase) para todas as plataformas ativas simultaneamente.
            </p>
        </div>
    );
};
