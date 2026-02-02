
import React from 'react';
import { Post } from '../../../../types';

interface ProfileReelsGridProps {
    reels: Post[];
    onReelClick: (reel: Post) => void;
    onDelete: (id: string, e: React.MouseEvent) => void;
}

export const ProfileReelsGrid: React.FC<ProfileReelsGridProps> = ({ reels, onReelClick, onDelete }) => {
    if (reels.length === 0) return <div className="no-content">Sem reels.</div>;

    return (
        <div className="gallery-grid animate-fade-in">
            {reels.map(post => (
                <div 
                    key={post.id} 
                    className="gallery-item reel-item relative" 
                    onClick={() => onReelClick(post)}
                >
                    <video src={post.video} className="reel-thumbnail" muted preload="metadata" />
                    <div className="reel-icon">
                        <i className="fa-solid fa-video"></i> {post.views}
                    </div>
                    <button 
                        onClick={(e) => onDelete(post.id, e)} 
                        className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center border-none color-[#ff4d4d] cursor-pointer z-10"
                    >
                        <i className="fa-solid fa-trash-can text-xs"></i>
                    </button>
                </div>
            ))}
        </div>
    );
};
