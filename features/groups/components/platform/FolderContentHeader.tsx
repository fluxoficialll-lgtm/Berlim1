
import React from 'react';

interface FolderContentHeaderProps {
    onBack: () => void;
    folderName?: string;
}

export const FolderContentHeader: React.FC<FolderContentHeaderProps> = ({ onBack, folderName }) => {
    return (
        <header className="flex items-center justify-between p-4 px-6 bg-[#0c0f14] border-b border-white/10 h-[65px] sticky top-0 z-50">
            <button 
                onClick={onBack} 
                className="w-10 h-10 rounded-full text-[#00c2ff] hover:bg-[#00c2ff1a] transition-all active:scale-90 flex items-center justify-center"
            >
                <i className="fa-solid fa-arrow-left"></i>
            </button>
            
            <div className="flex-1 text-center px-4">
                <h1 className="text-sm font-bold text-white uppercase tracking-[2px] truncate">
                    {folderName || 'Conteúdo'}
                </h1>
            </div>

            <div className="w-10"></div>
        </header>
    );
};
