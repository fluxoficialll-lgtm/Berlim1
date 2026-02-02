
import React from 'react';

interface PlatformStatusCardProps {
    enabled: boolean;
    onToggle: () => void;
}

export const PlatformStatusCard: React.FC<PlatformStatusCardProps> = ({ enabled, onToggle }) => {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden animate-fade-in">
            {enabled && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00c2ff] to-transparent opacity-50"></div>}
            
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${enabled ? 'bg-[#00c2ff1a] text-[#00c2ff]' : 'bg-white/5 text-gray-600'}`}>
                        <i className="fa-solid fa-cubes-stacked"></i>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-white mb-1">Status do Hub</h3>
                        <p className={`text-[10px] uppercase font-black tracking-widest ${enabled ? 'text-[#00ff82]' : 'text-gray-500'}`}>
                            {enabled ? 'Estrutura Ativa' : 'Modo Desativado'}
                        </p>
                    </div>
                </div>
                <label className="switch">
                    <input 
                        type="checkbox" 
                        checked={enabled} 
                        onChange={onToggle} 
                    />
                    <span className="slider-switch"></span>
                </label>
            </div>
        </div>
    );
};
