
import { PostUtils } from './posts/PostUtils';
import { PostQueryService } from './posts/PostQueryService';
import { PostInteractionService } from './posts/PostInteractionService';
import { PostCommentService } from './posts/PostCommentService';
import { PostActionService } from './posts/PostActionService';

/**
 * postService (Real)
 * Fachada unificada que agrupa funcionalidades de postagens.
 * Mantém compatibilidade com o código legado enquanto utiliza serviços modulares.
 */
export const postService = {
    // Utilitários e Helpers
    formatRelativeTime: PostUtils.formatRelativeTime,
    sanitizePost: PostUtils.sanitizePost,

    // Consultas (Leitura)
    getFeedPaginated: PostQueryService.getFeedPaginated,
    searchPosts: PostQueryService.searchPosts,
    getPostById: PostQueryService.getPostById,
    getUserPosts: PostQueryService.getUserPosts,

    // Interações
    toggleLike: PostInteractionService.toggleLike,
    incrementView: PostInteractionService.incrementView,
    incrementShare: PostInteractionService.incrementShare,

    // Comentários e Threads
    addComment: PostCommentService.addComment,
    addReply: PostCommentService.addReply,
    deleteComment: PostCommentService.deleteComment,
    toggleCommentLike: PostCommentService.toggleCommentLike,

    // Ações Estruturais (Mutações)
    addPost: PostActionService.addPost,
    deletePost: PostActionService.deletePost,
    uploadMedia: PostActionService.uploadMedia
};
