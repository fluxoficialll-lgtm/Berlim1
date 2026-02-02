
import React from 'react';

interface AdminSettingsButtonProps {
    isAdmin: boolean;
    onClick: () => void;
}

export const AdminSettingsButton: React.FC<AdminSettingsButtonProps> = ({ isAdmin, onClick }) => {
    if (!isAdmin) return null;

    return (
        <button 
            onClick={onClick}
            className="w-full mt-10 py-4 bg-white/5 border border-dashed border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#00c2ff] transition-all"
        >
            + Configurar Estrutura de Canais
        </button>
    );
};
