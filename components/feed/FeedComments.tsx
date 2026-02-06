
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../components/ModalSystem';
import { authService } from '../../services/authService';
import { Comment } from '../../types';
import { FeedCommentService } from '../../services/real/comments/FeedCommentService';
import { CommentItem } from '../../components/ui/comments/CommentItem';

interface FeedCommentsProps {
    postId: string;
}

export const FeedComments: React.FC<FeedCommentsProps> = ({ postId }) => {
    const navigate = useNavigate();
    const { showConfirm } = useModal();
    const inputRef = useRef<HTMLInputElement>(null);

    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [replyingTo, setReplyingTo] = useState<{ id: string, username: string } | null>(null);

    const currentUser = authService.getCurrentUser();
    const currentUserId = currentUser?.id;

    const fetchComments = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedComments = await FeedCommentService.getComments(postId);
            setComments(fetchedComments);
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSendComment = async () => {
        if (!commentText.trim()) return;
        try {
            if (replyingTo) {
                // Placeholder for replying logic
                await FeedCommentService.addReply(postId, replyingTo.id, commentText.trim());
                setReplyingTo(null);
            } else {
                await FeedCommentService.addComment(postId, commentText.trim());
            }
            setCommentText('');
            await fetchComments();
        } catch (error) {
            console.error("Failed to send comment:", error);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (await showConfirm("Delete Comment", "Are you sure you want to delete this comment?", "Delete", "Cancel")) {
            try {
                await FeedCommentService.deleteComment(commentId);
                await fetchComments();
            } catch (error) {
                console.error("Failed to delete comment:", error);
            }
        }
    };

    const handleReplyClick = (id: string, username: string) => {
        setReplyingTo({ id, username });
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleCommentLike = async (commentId: string) => {
        // Placeholder for liking logic
        await FeedCommentService.toggleCommentLike(commentId);
        setComments(comments.map(c => 
            c.id === commentId ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 } : c
        ));
    };

    return (
        <div className="w-full flex-grow flex flex-col">
             <div className="p-4 flex-grow">
                <div className="flex items-center gap-3 mb-8 px-2">
                    <div className="h-4 w-1 bg-[#00c2ff] rounded-full shadow-[0_0_10px_#00c2ff]"></div>
                    <h3 className="text-sm font-black text-white uppercase tracking-[3px]">Comentários ({comments.length})</h3>
                </div>
                
                <div className="space-y-1">
                {loading ? (
                    <div className="text-center py-20 opacity-50"><i className="fa-solid fa-circle-notch fa-spin text-3xl"></i></div>
                ) : comments.length > 0 ? comments.map(c => (
                    <CommentItem 
                        key={c.id} 
                        comment={c} 
                        onReplyClick={handleReplyClick} 
                        onLike={handleCommentLike} 
                        onDelete={handleDeleteComment} 
                        onUserClick={(u)=>navigate(`/user/${u.replace('@','')}`)} 
                        currentUserId={currentUserId}
                    />
                )) : (
                    <div className="text-center py-20 opacity-20 border-2 border-dashed border-white/5 rounded-[32px]">
                        <i className="fa-regular fa-comment-dots text-5xl mb-4"></i>
                        <p className="font-bold uppercase tracking-widest text-xs">Seja o primeiro a comentar</p>
                    </div>
                )}
                </div>
            </div>

            <div className="sticky bottom-0 w-full z-40 bg-[#1a1e26] border-t border-white/10 p-4 px-6 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
                {replyingTo && (
                    <div className="flex items-center justify-between py-2 mb-3 bg-[#00c2ff11] px-4 rounded-xl text-xs text-gray-300 border-l-2 border-[#00c2ff] animate-slide-up">
                        <span>Respondendo a <strong className="text-[#00c2ff]">@{replyingTo.username.replace(/^@/, '')}</strong></span>
                        <button onClick={()=>setReplyingTo(null)} className="text-gray-500 hover:text-white">
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                )}
                <div className="flex gap-3 items-center max-w-[500px] mx-auto">
                    <input 
                        ref={inputRef}
                        type="text" 
                        placeholder={replyingTo ? `Responda @${replyingTo.username.replace(/^@/, '')}...` : "Escreva um comentário..."} 
                        value={commentText} 
                        onChange={(e) => setCommentText(e.target.value)} 
                        onKeyDown={(e)=>e.key==='Enter'&&handleSendComment()} 
                        className="flex-grow bg-[#0c0f14] border border-white/10 rounded-2xl px-5 py-3.5 text-white outline-none text-sm focus:border-[#00c2ff] transition-all placeholder-gray-700" 
                    />
                    <button 
                        onClick={handleSendComment} 
                        disabled={!commentText.trim()} 
                        className="bg-[#00c2ff] w-12 h-12 rounded-2xl flex items-center justify-center text-black disabled:opacity-30 disabled:grayscale transition-all active:scale-90 shadow-lg shadow-[#00c2ff1a]"
                    >
                        <i className="fa-solid fa-paper-plane text-sm"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};
