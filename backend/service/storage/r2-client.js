
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { storageEvents } from '../audit/storage-events.js';
import { idManager } from '../id-manager.js';

/**
 * Cliente centralizado para todas as interações com o Cloudflare R2.
 * Abstrai o SDK da AWS e integra o sistema de auditoria para uploads e exclusões.
 */
class R2Client {
    constructor() {
        this.s3 = new S3Client({
            region: 'auto',
            endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
            },
        });
        this.bucketName = process.env.R2_BUCKET_NAME;
    }

    /**
     * Gera uma URL pré-assinada para permitir que o cliente (frontend) faça o upload de um arquivo diretamente para o R2.
     * @param {string} userId - O ID do usuário solicitando o upload.
     * @param {string} fileType - O MIME type do arquivo (ex: 'image/jpeg').
     * @param {number} fileSize - O tamanho do arquivo em bytes.
     * @returns {Promise<string>} A URL pré-assinada.
     */
    async createPresignedUploadUrl(userId, fileType, fileSize) {
        storageEvents.uploadUrlRequested(userId, fileType, fileSize);
        const fileId = idManager.file(); // Gera um ID único e prefixado para o arquivo.
        const key = `${userId}/${fileId}`;

        try {
            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                ContentType: fileType,
                ContentLength: fileSize,
            });

            const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 }); // URL válida por 1 hora
            storageEvents.uploadUrlGenerated(userId, key, url);
            return url;
        } catch (error) {
            storageEvents.uploadUrlGenerationFailed(userId, this.bucketName, error);
            throw error;
        }
    }

    /**
     * Deleta um objeto do bucket R2.
     * @param {string} key - A chave do objeto a ser deletado (ex: 'usr_.../file_...').
     */
    async deleteFile(key) {
        storageEvents.fileDeletionRequested(null, key, this.bucketName, 'DELETE_REQUEST');
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });
            await this.s3.send(command);
            storageEvents.fileDeletionSuccess(key, this.bucketName);
        } catch (error) {
            storageEvents.fileDeletionFailed(key, this.bucketName, error);
            throw error;
        }
    }
}

// Exporta uma única instância (Singleton) do cliente.
export const r2Client = new R2Client();
