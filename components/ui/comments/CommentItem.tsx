import React, { useState } from 'react';
import { Comment } from '../../../types';
import { postService } from '../../../services/postService';

interface CommentItemProps {
    comment: Comment;
    onReplyClick: (commentId: string, username: string) => void;
    onLike: (id: string) => void;
    onDelete: (id: string) => void;
    onUserClick: (username: string) => void;
    currentUserId?: string;
    depth?: number;
}

export const CommentItem: React.FC<CommentItemProps> = ({ 
    comment, onReplyClick, onLike, onDelete, onUserClick, currentUserId, depth = 0 
}) => {
    const isOwner = comment.userId === currentUserId;
    const [isTextExpanded, setIsTextExpanded] = useState(false);
    const [showReplies, setShowReplies] = useState(false); 
    const [visibleCount, setVisibleCount] = useState(3);

    const displayedText = comment.text.length > 120 && !isTextExpanded 
        ? comment.text.slice(0, 120) + '...' 
        : comment.text;

    const avatarSize = depth === 0 ? 'w-8 h-8' : 'w-6 h-6';
    
    const canShowReplies = depth === 0 && comment.replies && comment.replies.length > 0;
    const hasMoreReplies = comment.replies && visibleCount < comment.replies.length;

    const handleToggleReplies = () => {
        if (showReplies) {
            setShowReplies(false);
            setVisibleCount(3); // Reseta ao ocultar
        } else {
            setShowReplies(true);
        }
    };

    const loadMoreReplies = () => {
        setVisibleCount(prev => prev + 3);
    };

    return (
        <div className={`flex flex-col animate-fade-in ${depth === 0 ? 'mb-6' : 'mb-3'}`}>
            <div className="flex gap-3 items-start relative z-10">
                <div 
                    className="flex-shrink-0 cursor-pointer" 
                    onClick={() => onUserClick(comment.username)}
                >
                    {comment.avatar ? (
                        <img 
                            src={comment.avatar} 
                            className={`${avatarSize} rounded-full object-cover border border-white/10`} 
                            alt={comment.username}
                        />
                    ) : (
                        <div className={`${avatarSize} rounded-full bg-white/5 flex items-center justify-center text-[#00c2ff] border border-white/10`}>
                            <i className="fa-solid fa-user text-[10px]"></i>
                        </div>
                    )}
                </div>

                <div className="flex-grow min-w-0">
                    <div className="flex flex-col bg-white/[0.03] p-3 rounded-2xl border border-white/5">
                        <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                                <span 
                                    className="font-bold text-white text-[12px] cursor-pointer hover:text-[#00c2ff] truncate"
                                    onClick={() => onUserClick(comment.username)}
                                >
                                    @{comment.username.replace(/^@/, '')}
                                </span>
                                {comment.replyToUsername && (
                                    <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1 shrink-0">
                                        <i className="fa-solid fa-share text-[8px] opacity-40"></i>
                                        <span className="text-[#00c2ff]/60">@{comment.replyToUsername.replace(/^@/, '')}</span>
                                    </span>
                                )}
                            </div>
                            {isOwner && (
                                <button 
                                    onClick={() => onDelete(comment.id)}
                                    className="text-gray-600 hover:text-red-500 transition-colors p-1"
                                >
                                    <i className="fa-solid fa-trash-can text-[10px]"></i>
                                </button>
                            )}
                        </div>
                        <p className="text-[13px] text-gray-200 leading-snug whitespace-pre-wrap break-words font-light">
                            {displayedText}
                            {comment.text.length > 120 && (
                                <button 
                                    onClick={() => setIsTextExpanded(!isTextExpanded)} 
                                    className="text-[#00c2ff] text-xs font-bold ml-1 hover:underline bg-transparent border-none cursor-pointer"
                                >
                                    {isTextExpanded ? 'Ver menos' : 'Ver mais'}
                                </button>
                            )}
                        </p>
                    </div>

                    <div className="flex items-center gap-5 mt-2 ml-2">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                            {postService.formatRelativeTime(comment.timestamp)}
                        </span>
                        <button 
                            className="text-[10px] font-black text-gray-500 hover:text-[#00c2ff] uppercase tracking-widest cursor-pointer bg-transparent border-none p-0 transition-colors"
                            onClick={() => onReplyClick(comment.id, comment.username)}
                        >
                            Responder
                        </button>
                        <button 
                            className={`text-[10px] font-bold flex items-center gap-1.5 ml-auto transition-colors ${comment.likedByMe ? 'text-red-500' : 'text-gray-500 hover:text-white'}`}
                            onClick={() => onLike(comment.id)}
                        >
                            <i className={`${comment.likedByMe ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                            {comment.likes && comment.likes > 0 && <span>{comment.likes}</span>}
                        </button>
                    </div>
                </div>
            </div>

            {canShowReplies && (
                <div className="relative pl-11 mt-2">
                    {/* Linha da Thread */}
                    <div className="absolute left-[15px] top-0 bottom-4 w-[1px] bg-white/5 rounded-full"></div>
                    
                    {!showReplies ? (
                        <button 
                            onClick={handleToggleReplies}
                            className="flex items-center gap-3 mt-2 group bg-transparent border-none p-0 cursor-pointer ml-[-4px]"
                        >
                            <div className="w-6 h-[1px] bg-white/10 group-hover:bg-[#00c2ff]/30"></div>
                            <span className="text-[10px] font-black text-gray-500 group-hover:text-gray-300 uppercase tracking-widest">
                                Ver {comment.replies!.length} {comment.replies!.length === 1 ? 'resposta' : 'respostas'}
                            </span>
                        </button>
                    ) : (
                        <>
                            <div className="flex flex-col">
                                {comment.replies!.slice(0, visibleCount).map(reply => (
                                    <CommentItem 
                                        key={reply.id} 
                                        comment={reply} 
                                        onReplyClick={onReplyClick} 
                                        onLike={onLike} 
                                        onDelete={onDelete} 
                                        onUserClick={onUserClick}
                                        currentUserId={currentUserId}
                                        depth={1} 
                                    />
                                ))}
                            </div>
                            
                            <div className="flex items-center justify-between pr-2 mt-1">
                                {hasMoreReplies ? (
                                    <button 
                                        onClick={loadMoreReplies}
                                        className="text-[10px] font-black text-[#00c2ff] hover:text-white uppercase tracking-widest transition-colors py-2 flex items-center gap-2 bg-transparent border-none cursor-pointer"
                                    >
                                        <i className="fa-solid fa-plus-circle text-[12px]"></i>
                                        Ver mais respostas ({comment.replies!.length - visibleCount})
                                    </button>
                                ) : <div />}

                                <button 
                                    onClick={handleToggleReplies}
                                    className="text-[9px] font-black text-gray-700 hover:text-gray-400 uppercase tracking-[2px] transition-colors py-2 bg-transparent border-none cursor-pointer"
                                >
                                    Ocultar conversa
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};