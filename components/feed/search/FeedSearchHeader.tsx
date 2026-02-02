import React from 'react';

interface FeedSearchHeaderProps {
    searchTerm: string;
    onSearchChange: (val: string) => void;
    onBack: () => void;
    loading: boolean;
}

export const FeedSearchHeader: React.FC<FeedSearchHeaderProps> = ({ 
    searchTerm, 
    onSearchChange, 
    onBack, 
    loading 
}) => {
    return (
        <header className="flex items-center gap-4 px-6 py-4 bg-[#0c0f14] border-b border-white/5 z-50 h-[80px] shrink-0">
            <button 
                onClick={onBack} 
                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all active:scale-90"
            >
                <i className="fa-solid fa-arrow-left"></i>
            </button>
            
            <div className="flex-1 relative group">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${loading ? 'text-[#00c2ff]' : 'text-gray-600 group-focus-within:text-[#00c2ff]'}`}>
                    <i className={`fa-solid ${loading ? 'fa-circle-notch fa-spin' : 'fa-magnifying-glass'} text-sm`}></i>
                </div>
                
                <input 
                    type="text"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white text-sm outline-none focus:border-[#00c2ff]/40 focus:bg-black/60 transition-all placeholder:text-gray-700 shadow-inner font-medium"
                    placeholder="O que você deseja encontrar na rede?"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    autoFocus
                />
                
                {searchTerm && !loading && (
                    <button 
                        onClick={() => onSearchChange('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                    >
                        <i className="fa-solid fa-circle-xmark"></i>
                    </button>
                )}
            </div>
        </header>
    );
};