import React from 'react';

interface MarketplaceSearchBarProps {
    value: string;
    onChange: (val: string) => void;
}

export const MarketplaceSearchBar: React.FC<MarketplaceSearchBarProps> = ({ value, onChange }) => {
    return (
        <div className="search-bar flex items-center gap-2.5 w-full max-w-[600px] mx-auto mb-4 p-[12px_20px] rounded-[50px] bg-white/5 backdrop-blur-xl border border-white/10 transition-all sticky top-0 z-25">
            <style>{`
                .search-bar:focus-within {
                    border-color: rgba(0, 194, 255, 0.4);
                    background: rgba(255, 255, 255, 0.1);
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
                }
            `}</style>
            <i className="fa-solid fa-magnifying-glass text-gray-500"></i>
            <input 
                type="text" 
                placeholder="O que você procura hoje?" 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none color-white text-base placeholder-gray-500"
            />
        </div>
    );
};