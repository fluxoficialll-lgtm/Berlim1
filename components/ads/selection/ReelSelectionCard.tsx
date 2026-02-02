
import React from 'react';
import { Post } from '../../../types';

interface ReelSelectionCardProps {
    reel: Post;
    onSelect: (reel: Post) => void;
}

export const ReelSelectionCard: React.FC<ReelSelectionCardProps> = ({ reel, onSelect }) => {
    return (
        <div 
            className="group relative aspect-[9/16] bg-[#1a1e26] overflow-hidden cursor-pointer active:opacity-80"
            onClick={() => onSelect(reel)}
        >
            <video 
                src={reel.video} 
                className="w-full h-full object-cover"
                muted
                preload="metadata"
            />
            
            <div className="absolute inset-0 bg-black/20 group-hover:bg-[#ee2a7b]/10 transition-colors"></div>
            
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-[10px] font-bold text-white text-shadow-sm">
                <i className="fa-solid fa-play text-[8px]"></i>
                {reel.views || 0}
            </div>

            {/* Indicador de Seleção no Hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                <div className="w-10 h-10 rounded-full bg-[#ee2a7b] text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <i className="fa-solid fa-rocket text-sm"></i>
                </div>
            </div>
        </div>
    );
};
