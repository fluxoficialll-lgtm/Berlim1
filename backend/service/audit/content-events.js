
import { auditLog } from './audit-log.js';

const CATEGORY = 'CONTENT_INTERACTION';

/**
 * Logs de diagnóstico para criação, moderação e interação com conteúdo.
 */
export const contentEvents = {
    /** Post criado com sucesso. */
    postCreated: (postId, authorId, groupId, ip, userAgent) => 
        auditLog.info(CATEGORY, 'Post criado.', { postId, authorId, groupId, ip, userAgent }),

    /** Falha ao criar um post. */
    postCreationFailed: (authorId, groupId, ip, reason, error) => 
        auditLog.error(CATEGORY, `Falha ao criar post: ${reason}`, { authorId, groupId, ip, reason, errorMessage: error?.message }),

    /** Post deletado por um usuário ou moderador. */
    postDeleted: (postId, deletedBy, reason) => 
        auditLog.warn(CATEGORY, `Post deletado. Motivo: ${reason}`, { postId, deletedBy, reason }),

    /** Comentário adicionado a um post. */
    commentAdded: (commentId, postId, authorId, ip) => 
        auditLog.info(CATEGORY, 'Comentário adicionado.', { commentId, postId, authorId, ip }),

    /** Falha ao adicionar um comentário. */
    commentCreationFailed: (postId, authorId, ip, reason, error) => 
        auditLog.error(CATEGORY, `Falha ao adicionar comentário: ${reason}`, { postId, authorId, ip, reason, errorMessage: error?.message }),

    /** Like adicionado a um conteúdo. */
    likeToggled: (contentId, contentType, userId, liked) => 
        auditLog.info(CATEGORY, `Like ${liked ? 'adicionado' : 'removido'}.`, { contentId, contentType, userId, liked }),

    /** Conteúdo denunciado por um usuário. Requer atenção. */
    reportReceived: (contentId, contentType, reportedBy, reason, ip) => 
        auditLog.warn(CATEGORY, `Conteúdo (${contentType}) denunciado.`, { contentId, contentType, reportedBy, reason, ip }),
        
    /** Ação tomada por um moderador sobre um conteúdo denunciado. */
    reportActionTaken: (reportId, moderatorId, action, targetContentId, targetUserId) =>
        auditLog.info(CATEGORY, `Ação de moderação [${action}] tomada.`, { reportId, moderatorId, action, targetContentId, targetUserId }),

    /** Conteúdo ocultado por um moderador sem denúncia prévia. */
    contentHiddenByModerator: (contentId, contentType, moderatorId, reason) =>
        auditLog.warn(CATEGORY, `Conteúdo ocultado por moderador.`, { contentId, contentType, moderatorId, reason }),
};
