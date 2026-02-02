
import multer from 'multer';

/**
 * Configuração de upload para arquivos temporários em memória
 */
export const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { 
        fileSize: 50 * 1024 * 1024 // Limite de 50MB por arquivo
    } 
});
