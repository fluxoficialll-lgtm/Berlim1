
import { auditLog } from './audit-log.js';

const CATEGORY = 'AUTH';

/**
 * Logs de diagnóstico para segurança e autenticação.
 */
export const authEvents = {
    /** Login bem-sucedido. */
    loginSuccess: (userId, ip, userAgent) => 
        auditLog.info(CATEGORY, 'Login bem-sucedido.', { userId, ip, userAgent }),

    /** Falha no login por credenciais incorretas. */
    loginFailure: (email, ip, userAgent, reason) => 
        auditLog.warn(CATEGORY, `Falha no login para ${email}: ${reason}`, { email, ip, userAgent }),

    /** O middleware de autenticação rejeitou um token JWT. */
    tokenValidationFailed: (token, ip, userAgent, reason) => 
        auditLog.warn(CATEGORY, `Validação de token falhou: ${reason}`, { reason, tokenUsed: token, ip, userAgent }),

    /** Tentativa de registro de um novo usuário falhou. */
    registrationFailed: (email, ip, reason) => 
        auditLog.warn(CATEGORY, `Falha no registro para ${email}: ${reason}`, { email, ip, reason }),

    /** Login/Registro via Google. */
    googleAuthSuccess: (userId, email, isNewUser, ip, userAgent) => 
        auditLog.info(CATEGORY, `Autenticação com Google ${isNewUser ? '(novo usuário)' : 'bem-sucedida'}.`, { userId, email, isNewUser, ip, userAgent }),

    /** Alteração de senha bem-sucedida. */
    passwordChangeSuccess: (userId, ip) => 
        auditLog.info(CATEGORY, 'Senha alterada com sucesso.', { userId, ip }),

    /** Falha ao tentar alterar a senha (ex: senha atual incorreta). */
    passwordChangeFailure: (userId, ip, reason) => 
        auditLog.warn(CATEGORY, `Tentativa de alteração de senha falhou: ${reason}`, { userId, ip }),

    /** Usuário solicitou um link de redefinição de senha. */
    passwordResetRequested: (email, ip) => 
        auditLog.info(CATEGORY, 'Solicitação de redefinição de senha.', { email, ip }),

    /** Senha redefinida com sucesso usando um token. */
    passwordResetCompleted: (userId, ip) => 
        auditLog.info(CATEGORY, 'Senha redefinida com sucesso.', { userId, ip }),

    /** Uma sessão de usuário específica foi revogada (logout forçado). */
    sessionRevoked: (revokedBy, targetUserId, sessionId) => 
        auditLog.warn(CATEGORY, 'Sessão de usuário revogada.', { revokedBy, targetUserId, sessionId }),
};
