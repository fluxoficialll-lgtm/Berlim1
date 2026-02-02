
import React from 'react';

interface RankingTabsProps {
    activeTab: 'public' | 'private' | 'vip';
    onTabChange: (newTab: 'public' | 'private' | 'vip') => void;
}

export const RankingTabs: React.FC<RankingTabsProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="tabs-container">
            <button 
                className={`tab-btn ${activeTab === 'public' ? 'active' : ''}`} 
                onClick={() => onTabChange('public')}
            >
                Públicos
            </button>
            <button 
                className={`tab-btn ${activeTab === 'private' ? 'active' : ''}`} 
                onClick={() => onTabChange('private')}
            >
                Privados
            </button>
            <button 
                className={`tab-btn ${activeTab === 'vip' ? 'active' : ''}`} 
                onClick={() => onTabChange('vip')}
            >
                VIP
            </button>
        </div>
    );
};
