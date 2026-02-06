
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommentSheet } from '../../../components/ui/comments/CommentSheet';
import { useModal } from '../../../components/ModalSystem';
import { authService } from '../../../services/authService';
import { recommendationService } from '../../../services/recommendationService';
import { Post, Comment } from '../../../types';
import { ReelsCommentService } from '../../../services/real/comments/ReelsCommentService';
import { postService } from '../../../services/postService';

interface ReelCommentsProps {
    reel: Post | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ReelComments: React.FC<ReelCommentsProps> = ({ reel, isOpen, onClose }) => {
    const { showConfirm } = useModal();
    const navigate = useNavigate();
    
    const [currentComments, setCurrentComments] = useState<Comment[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [replyingTo, setReplyingTo] = useState<{ id: string, username: string } | null>(null);

    const activeReelId = reel?.id;
    const currentUser = authService.getCurrentUser();
    const currentUserId = currentUser?.id;

    const fetchComments = useCallback(async (reelId: string) => {
        if (!reelId) return;
        setLoadingComments(true);
        try {
            const comments = await ReelsCommentService.getComments(reelId);
            setCurrentComments(comments);
        } catch (error) {
            console.error("Falha ao carregar comentários do Reel:", error);
            setCurrentComments([]);
        } finally {
            setLoadingComments(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen && activeReelId) {
            fetchComments(activeReelId);
        } else {
            setCurrentComments([]);
            setCommentText('');
            setReplyingTo(null);
        }
    }, [isOpen, activeReelId, fetchComments]);

    const handleSendComment = async () => {
        if (!activeReelId || !commentText.trim()) return;
        const u = authService.getCurrentUser();
        if (!u) return;

        if (replyingTo) {
            const username = u.profile?.name || 'user';
            const userAvatar = u.profile?.photoUrl;
            const success = postService.addReply(activeReelId, replyingTo.id, commentText.trim(), username, userAvatar);
            if (success) {
                setReplyingTo(null);
                setCommentText('');
                fetchComments(activeReelId);
            }
        } else {
            try {
                await ReelsCommentService.addComment(activeReelId, commentText.trim());
                setCommentText('');
                await fetchComments(activeReelId);

                if (u.email && reel) {
                    recommendationService.recordInteraction(u.email, reel, 'comment');
                }
            } catch (error) {
                console.error("Falha ao enviar comentário no Reel:", error);
            }
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!activeReelId) return;
        if (await showConfirm("Excluir comentário", "Deseja excluir este comentário?", "Excluir", "Cancelar")) {
            try {
                await ReelsCommentService.deleteComment(commentId);
                await fetchComments(activeReelId);
            } catch (error) {
                console.error("Falha ao deletar comentário do Reel:", error);
            }
        }
    };

    const handleCommentLike = (commentId: string) => {
        if (!activeReelId) return;
        postService.toggleCommentLike(activeReelId, commentId);
        setCurrentComments(prev => prev.map(c => 
            c.id === commentId 
            ? { ...c, isLiked: !c.isLiked, likes: (c.isLiked ? c.likes - 1 : c.likes + 1) } 
            : c
        ));
    };

    const handleUserClick = (username: string) => {
        navigate(`/user/${username.replace('@', '')}`);
        onClose();
    };

    return (
        <CommentSheet 
            isOpen={isOpen}
            onClose={onClose}
            title={`Comentários (${currentComments.length})`}
            comments={currentComments}
            commentText={commentText}
            onCommentTextChange={setCommentText}
            onSend={handleSendComment}
            onLike={handleCommentLike}
            onDelete={handleDeleteComment}
            onUserClick={handleUserClick}
            currentUserId={currentUserId}
            replyingTo={replyingTo}
            onCancelReply={() => setReplyingTo(null)}
            onReplyClick={(cid, user) => setReplyingTo({ id: cid, username: user })}
        />
    );
};
