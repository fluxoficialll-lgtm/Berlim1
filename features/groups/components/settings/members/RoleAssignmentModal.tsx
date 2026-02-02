
import React from 'react';
import { GroupRole } from '../../../../../types';

interface RoleAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    roles: GroupRole[];
    currentRoleId?: string;
    onAssign: (roleId: string) => void;
    memberName: string;
}

export const RoleAssignmentModal: React.FC<RoleAssignmentModalProps> = ({
    isOpen, onClose, roles, currentRoleId, onAssign, memberName
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-6 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-[#1a1e26] border border-white/10 rounded-[40px] w-full max-w-sm overflow-hidden shadow-2xl animate-pop-in" onClick={e => e.stopPropagation()}>
                
                <header className="p-8 pb-4 text-center border-b border-white/5">
                    <div className="w-16 h-16 bg-[#00c2ff1a] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#00c2ff33] text-[#00c2ff] text-2xl">
                        <i className="fa-solid fa-user-gear"></i>
                    </div>
                    <h3 className="text-lg font-black text-white uppercase tracking-widest mb-1">Atribuir Cargo</h3>
                    <p className="text-xs text-gray-500 italic">Definindo permissões para <strong>{memberName}</strong></p>
                </header>

                <div className="p-6 space-y-2 max-h-[350px] overflow-y-auto no-scrollbar">
                    {(roles || []).length > 0 ? (
                        roles.map(role => {
                            const isCurrent = currentRoleId === role.id;
                            
                            return (
                                <button
                                    key={role.id}
                                    onClick={() => { onAssign(role.id); onClose(); }}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all active:scale-[0.98] ${
                                        isCurrent 
                                        ? 'bg-[#00c2ff1a] border-[#00c2ff] shadow-[0_0_15px_rgba(0,194,255,0.1)]' 
                                        : 'bg-white/5 border-white/5 hover:border-white/10'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div 
                                            className="w-3 h-3 rounded-full shrink-0 shadow-sm" 
                                            style={{ backgroundColor: role.color, boxShadow: `0 0 8px ${role.color}66` }}
                                        ></div>
                                        <div className="flex flex-col text-left truncate">
                                            <span className={`text-sm font-bold truncate ${isCurrent ? 'text-[#00c2ff]' : 'text-white'}`}>
                                                {role.name}
                                            </span>
                                            {isCurrent && (
                                                <span className="text-[8px] font-black text-[#00c2ff] uppercase tracking-widest mt-0.5">
                                                    Cargo Atual
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {isCurrent ? (
                                        <div className="w-6 h-6 rounded-full bg-[#00c2ff] flex items-center justify-center text-black text-[10px]">
                                            <i className="fa-solid fa-check"></i>
                                        </div>
                                    ) : (
                                        <i className="fa-solid fa-chevron-right text-gray-700 text-[10px]"></i>
                                    )}
                                </button>
                            );
                        })
                    ) : (
                        <div className="py-12 text-center opacity-30">
                            <i className="fa-solid fa-id-card-clip text-4xl mb-4"></i>
                            <p className="text-xs font-bold uppercase tracking-widest px-10">Nenhum cargo disponível.</p>
                        </div>
                    )}
                </div>

                <footer className="p-4 bg-[#0c0f14] border-t border-white/5">
                    <button 
                        onClick={onClose} 
                        className="w-full py-4 text-gray-500 font-black uppercase text-[10px] tracking-[3px] hover:text-white transition-colors"
                    >
                        Cancelar
                    </button>
                </footer>
            </div>
        </div>
    );
};
