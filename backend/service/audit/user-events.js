
import { auditLog } from './audit-log.js';

const CATEGORY = 'USER_PROFILE';

export const userEvents = {
    profileCreated: (userId, email) => auditLog.info(CATEGORY, 'Perfil de usuário criado.', { userId, email }),
    profileUpdated: (userId, updatedFields) => auditLog.info(CATEGORY, 'Perfil de usuário atualizado.', { userId, fields: updatedFields }),
    profileViewed: (viewerId, viewedId) => auditLog.info(CATEGORY, 'Perfil de usuário visualizado.', { viewerId, viewedProfileId: viewedId }),
    profileUpdateFailed: (userId, error) => auditLog.error(CATEGORY, 'Falha ao atualizar perfil.', { userId, errorMessage: error.message }),
};
