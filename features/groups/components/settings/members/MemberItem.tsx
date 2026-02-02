
import React from 'react';

interface Member {
    id: string;
    name: string;
    role: string;
    isMe: boolean;
    avatar?: string;
    roleId?: string;
}

interface MemberItemProps {
    member: Member;
    isAdmin: boolean;
    onAction: (id: string, action: 'kick' | 'ban' | 'promote' | 'demote') => void;
    onRoleClick?: (id: string, name: string, roleId?: string) => void;
}

export const MemberItem: React.FC<MemberItemProps> = ({ member, isAdmin, onAction, onRoleClick }) => {
    if (!member || !member.id) return null;

    const isDono = member.role === 'Dono';
    const isAdminRole = member.role === 'Admin';

    return (
        <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl transition-all hover:bg-white/[0.04]">
            <div className="relative flex-shrink-0">
                {member.avatar ? (
                    <img src={member.avatar} className="w-10 h-10 rounded-full object-cover border border-white/10" alt="Av" />
                ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-white/40 border border-white/5">
                        <i className="fa-solid fa-user text-xs"></i>
                    </div>
                )}
                {isDono && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#1a1e26] bg-[#FFD700]">
                        <i className="fa-solid fa-crown text-[6px] text-black"></i>
                    </div>
                )}
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white/90 truncate flex items-center gap-1.5">
                    {member.name} 
                    {member.isMe && <span className="text-[8px] bg-[#00c2ff]/20 text-[#00c2ff] px-1.5 py-0.5 rounded uppercase font-black">Você</span>}
                </div>
                <div 
                    onClick={() => !isDono && isAdmin && onRoleClick?.(member.id, member.name, member.roleId)}
                    className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${!isDono && isAdmin ? 'text-[#00c2ff] cursor-pointer hover:underline' : 'text-white/20'}`}
                >
                    {member.role}
                    {!isDono && isAdmin && <i className="fa-solid fa-pen-to-square text-[7px]"></i>}
                </div>
            </div>

            {isAdmin && !member.isMe && !isDono && (
                <div className="flex gap-1">
                    <button 
                        onClick={() => onAction(member.id, 'kick')} 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-red-500 transition-all active:scale-90"
                        title="Expulsar"
                    >
                        <i className="fa-solid fa-user-xmark text-xs"></i>
                    </button>
                </div>
            )}
        </div>
    );
};
