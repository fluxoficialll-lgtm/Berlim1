
import React from 'react';
import { Post } from '../../../types';
import { FeedItem } from '../../feed/FeedItem';

interface PostSelectionCardProps {
    post: Post;
    onSelect: (post: Post) => void;
}

export const PostSelectionCard: React.FC<PostSelectionCardProps> = ({ post, onSelect }) => {
    return (
        <div 
            className="group relative cursor-pointer active:scale-[0.99] transition-transform"
            onClick={() => onSelect(post)}
        >
            {/* Overlay de Seleção */}
            <div className="absolute inset-0 z-10 bg-transparent group-hover:bg-[#00c2ff]/5 border-2 border-transparent group-hover:border-[#00c2ff] rounded-2xl transition-all flex items-center justify-center">
                <div className="bg-[#00c2ff] text-black px-6 py-2 rounded-full font-black text-[10px] uppercase opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all shadow-xl">
                    Selecionar para Anúncio
                </div>
            </div>

            {/* Componente Real do Feed */}
            <div className="pointer-events-none">
                <FeedItem 
                    post={post}
                    onLike={() => {}}
                    onDelete={() => {}}
                    onUserClick={() => {}}
                    onCommentClick={() => {}}
                    onShare={() => {}}
                    onVote={() => {}}
                    onCtaClick={() => {}}
                />
            </div>
        </div>
    );
};
