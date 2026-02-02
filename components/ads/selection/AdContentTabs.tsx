
import React from 'react';

interface AdContentTabsProps {
    activeTab: 'posts' | 'reels';
    onTabChange: (tab: 'posts' | 'reels') => void;
}

export const AdContentTabs: React.FC<AdContentTabsProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="flex border-b border-white/5 bg-[#0c0f14] sticky top-[65px] z-20">
            <button 
                className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
                    activeTab === 'posts' ? 'text-[#00c2ff] border-[#00c2ff] bg-[#00c2ff]/5' : 'text-gray-500 border-transparent'
                }`}
                onClick={() => onTabChange('posts')}
            >
                <i className="fa-solid fa-newspaper mr-2"></i> Posts do Feed
            </button>
            <button 
                className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
                    activeTab === 'reels' ? 'text-[#ee2a7b] border-[#ee2a7b] bg-[#ee2a7b]/5' : 'text-gray-500 border-transparent'
                }`}
                onClick={() => onTabChange('reels')}
            >
                <i className="fa-solid fa-clapperboard mr-2"></i> Meus Reels
            </button>
        </div>
    );
};
