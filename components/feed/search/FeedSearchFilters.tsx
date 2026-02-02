import React from 'react';
import { FeedSearchFilter, SearchTab } from '../../../pages/FeedSearch';

interface FeedSearchFiltersProps {
    activeTab: SearchTab;
    onTabChange: (tab: SearchTab) => void;
    activeFilter: FeedSearchFilter;
    onFilterChange: (filter: FeedSearchFilter) => void;
    show: boolean;
}

export const FeedSearchFilters: React.FC<FeedSearchFiltersProps> = ({ 
    activeTab,
    onTabChange,
    activeFilter, 
    onFilterChange,
    show
}) => {
    if (!show) return null;

    const tabs: { id: SearchTab; label: string; icon: string }[] = [
        { id: 'posts', label: 'Conteúdo', icon: 'fa-layer-group' },
        { id: 'users', label: 'Pessoas', icon: 'fa-user-astronaut' }
    ];

    const subFilters: { id: FeedSearchFilter; label: string; icon: string }[] = [
        { id: 'relevant', label: 'Destaques', icon: 'fa-bolt' },
        { id: 'recent', label: 'Recentes', icon: 'fa-clock' }
    ];

    return (
        <div className="flex flex-col bg-[#0c0f14] border-b border-white/5 animate-fade-in shrink-0">
            {/* Main Tabs Selection */}
            <div className="flex px-6 pt-4 gap-6">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        onClick={() => onTabChange(t.id)}
                        className={`pb-3 text-[11px] font-black uppercase tracking-[3px] transition-all relative ${
                            activeTab === t.id ? 'text-[#00c2ff]' : 'text-gray-600'
                        }`}
                    >
                        <i className={`fa-solid ${t.icon} mr-2 opacity-50`}></i>
                        {t.label}
                        {activeTab === t.id && (
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00c2ff] rounded-full shadow-[0_0_10px_#00c2ff]"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Sub-filters for Posts */}
            {activeTab === 'posts' && (
                <div className="flex gap-3 px-6 py-4 items-center overflow-x-auto no-scrollbar animate-slide-up">
                    <span className="text-[9px] font-black text-gray-700 uppercase tracking-[2px] mr-2">Ordenar</span>
                    {subFilters.map((f) => (
                        <button 
                            key={f.id}
                            onClick={() => onFilterChange(f.id)}
                            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[2px] transition-all flex items-center gap-2 border ${
                                activeFilter === f.id 
                                ? 'bg-[#00c2ff] text-black border-[#00c2ff] shadow-lg shadow-[#00c2ff]/10' 
                                : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300 hover:border-white/10'
                            }`}
                        >
                            <i className={`fa-solid ${f.icon} ${activeFilter === f.id ? 'opacity-100' : 'opacity-40'}`}></i>
                            {f.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};