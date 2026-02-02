
import React from 'react';

interface PlatformPermissionCardProps {
    allowDownload: boolean;
    onToggleDownload: () => void;
    allowMemberUpload: boolean;
    onToggleMemberUpload: () => void;
}

export const PlatformPermissionCard: React.FC<PlatformPermissionCardProps> = ({ 
    allowDownload, 
    onToggleDownload,
    allowMemberUpload,
    onToggleMemberUpload
}) => {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#00c2ff1a] flex items-center justify-center text-[#00c2ff] text-xs">
                    <i className="fa-solid fa-shield-halved"></i>
                </div>
                <h4 className="text-[11px] font-black text-white/60 uppercase tracking-[2px]">Configurações de Acesso</h4>
            </div>
            
            <div className="space-y-4">
                <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-200">Permitir Downloads</span>
                            <span className="text-[10px] text-gray-600 uppercase font-black">Acesso offline aos membros</span>
                        </div>
                        <label className="switch">
                            <input type="checkbox" checked={allowDownload} onChange={onToggleDownload} />
                            <span className="slider-switch"></span>
                        </label>
                    </div>
                </div>

                <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-200">Upload de Membros</span>
                            <span className="text-[10px] text-gray-600 uppercase font-black">Colaboração ativa no catálogo</span>
                        </div>
                        <label className="switch">
                            <input type="checkbox" checked={allowMemberUpload} onChange={onToggleMemberUpload} />
                            <span className="slider-switch"></span>
                        </label>
                    </div>
                </div>
            </div>
            
            <p className="text-[9px] text-gray-700 mt-4 text-center italic">
                Administradores e o proprietário sempre têm permissão total de upload e exclusão.
            </p>
        </div>
    );
};
