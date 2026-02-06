
import { useState, useCallback, useEffect } from 'react';
import { Comment } from '@/types';
import { MarketplaceCommentService } from '@/services/real/comments/MarketplaceCommentService';
import { useModal } from '@/components/ModalSystem';

export const useMarketplaceComments = (itemId: string) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { showConfirm } = useModal();

    const fetchComments = useCallback(async () => {
        if (!itemId) return;
        setLoading(true);
        try {
            const fetchedComments = await MarketplaceCommentService.getComments(itemId);
            setComments(fetchedComments);
            setError(null);
        } catch (e) {
            console.error("Failed to fetch comments:", e);
            setError("Não foi possível carregar os comentários.");
        } finally {
            setLoading(false);
        }
    }, [itemId]);

    const addComment = async (text: string) => {
        if (!text.trim()) return;
        try {
            await MarketplaceCommentService.addComment(itemId, text.trim());
            await fetchComments();
        } catch (e) {
            console.error("Failed to add comment:", e);
            setError("Não foi possível enviar o seu comentário.");
        }
    };

    const deleteComment = async (commentId: string) => {
        const confirmed = await showConfirm("Excluir comentário", "Deseja realmente excluir este comentário?");
        if (confirmed) {
            try {
                await MarketplaceCommentService.deleteComment(commentId);
                await fetchComments();
            } catch (e) {
                console.error("Failed to delete comment:", e);
                setError("Não foi possível excluir o comentário.");
            }
        }
    };

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    return {
        comments,
        loading,
        error,
        fetchComments,
        addComment,
        deleteComment
    };
};
