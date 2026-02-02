
import React from 'react';

interface DangerZoneSectionProps {
    isOwner: boolean;
    onAction: (type: 'leave' | 'delete') => void;
}

export const DangerZoneSection: React.FC<DangerZoneSectionProps> = ({ isOwner, onAction }) => {
    return (
        <div className="flex flex-col gap-3">
            <button 
                className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold text-sm rounded-2xl transition-all hover:bg-white/10 active:scale-95 flex items-center justify-center gap-3" 
                onClick={() => onAction('leave')}
            >
                <i className="fa-solid fa-right-from-bracket text-gray-500"></i> Sair do Grupo
            </button>
            {isOwner && (
                <button 
                    className="w-full py-4 bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase text-xs tracking-widest rounded-2xl transition-all hover:bg-red-500/20 active:scale-95 flex items-center justify-center gap-3" 
                    onClick={() => onAction('delete')}
                >
                    <i className="fa-solid fa-trash-can"></i> EXCLUIR PERMANENTEMENTE
                </button>
            )}
        </div>
    );
};
