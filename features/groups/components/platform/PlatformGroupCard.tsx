
import React from 'react';
import { Group } from '../../../../types';

interface PlatformGroupCardProps {
    group: Group;
}

export const PlatformGroupCard: React.FC<PlatformGroupCardProps> = ({ group }) => {
    const memberCount = group.memberIds?.length || 0;

    return (
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 mb-10 shadow-2xl relative overflow-hidden group">
            {/* Efeito de brilho sutil */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00c2ff]/5 blur-[60px] rounded-full"></div>
            
            <div className="flex flex-col gap-6 relative z-10">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/10 overflow-hidden flex-shrink-0">
                        {group.coverImage ? (
                            <img src={group.coverImage} className="w-full h-full object-cover" alt="Capa" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#00c2ff]">
                                <i className={`fa-solid ${group.isVip ? 'fa-crown' : 'fa-users-line'} text-2xl`}></i>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-bold text-white truncate leading-tight">
                            {group.name}
                        </h1>
                        <div className="flex items-center gap-2 mt-1.5">
                            <div className="px-2 py-0.5 rounded-lg bg-[#00ff82]/10 border border-[#00ff82]/20 text-[#00ff82] text-[9px] font-black uppercase tracking-wider">
                                <i className="fa-solid fa-users mr-1"></i> {memberCount} Membros
                            </div>
                            {group.isVip && (
                                <div className="px-2 py-0.5 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] text-[9px] font-black uppercase tracking-wider">
                                    <i className="fa-solid fa-crown mr-1"></i> VIP
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <span className="text-[10px] font-black text-[#00c2ff] uppercase tracking-[2px] opacity-70">Apresentação</span>
                    <p className="text-gray-400 text-[13px] leading-relaxed line-clamp-3 font-medium">
                        {group.description || "Esta comunidade oferece acesso a conteúdos exclusivos e interações em tempo real com especialistas."}
                    </p>
                </div>
            </div>
        </div>
    );
};
