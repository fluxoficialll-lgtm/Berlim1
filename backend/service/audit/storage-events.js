
import { auditLog } from './audit-log.js';

const CATEGORY = 'R2_STORAGE';

/**
 * Logs de diagnóstico para interações com o serviço de armazenamento (Cloudflare R2).
 */
export const storageEvents = {
    /** Solicitação para gerar uma URL de upload pré-assinada. */
    uploadUrlRequested: (userId, fileName, fileType, fileSize) => 
        auditLog.info(CATEGORY, 'URL de upload solicitada.', { userId, fileName, fileType, fileSize }),

    /** URL de upload gerada com sucesso. */
    uploadUrlGenerated: (userId, fileName, publicUrl) => 
        auditLog.info(CATEGORY, 'URL de upload pré-assinada gerada com sucesso.', { userId, fileName, publicUrl }),

    /** Falha ao gerar a URL de upload pré-assinada. */
    uploadUrlGenerationFailed: (userId, bucketName, error) => 
        auditLog.error(CATEGORY, 'Falha ao gerar URL de upload.', { 
            userId, 
            bucketName, 
            errorMessage: error.message, 
            errorCode: error.code, // Código de erro do SDK da AWS (ex: AccessDenied)
            stackTrace: error.stack 
        }),

    /** Metadados do arquivo (URL pública) salvos com sucesso no banco de dados. */
    fileMetadataSaved: (postId, fileUrl) => 
        auditLog.info(CATEGORY, 'Metadados do arquivo salvos no post.', { postId, fileUrl }),

    /** Solicitação para deletar um arquivo do R2. */
    fileDeletionRequested: (userId, fileName, bucketName, reason) => 
        auditLog.info(CATEGORY, `Solicitação para deletar o arquivo '${fileName}'.`, { userId, fileName, bucketName, reason }),

    /** Arquivo deletado com sucesso do R2. */
    fileDeletionSuccess: (fileName, bucketName) => 
        auditLog.info(CATEGORY, `Arquivo '${fileName}' deletado com sucesso.`, { fileName, bucketName }),

    /** Falha ao tentar deletar um arquivo do R2. */
    fileDeletionFailed: (fileName, bucketName, error) => 
        auditLog.error(CATEGORY, `Falha ao deletar o arquivo '${fileName}'.`, { 
            fileName, 
            bucketName, 
            errorMessage: error.message, 
            errorCode: error.code 
        }),
};
