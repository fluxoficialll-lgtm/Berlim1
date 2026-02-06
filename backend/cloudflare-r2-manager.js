
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from 'crypto';

// --- CONFIGURAÇÃO ---
// Garanta que estas variáveis de ambiente estejam configuradas no seu servidor.
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

// O domínio público do seu bucket R2. Configure em seu provedor de DNS.
const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN; 

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME || !R2_PUBLIC_DOMAIN) {
    console.warn("⚠️  Variáveis de ambiente do Cloudflare R2 não estão completamente configuradas. O upload de arquivos pode falhar.");
}

const S3 = new S3Client({
    region: "auto",
    endpoint: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`.replace('<ACCOUNT_ID>', R2_ACCOUNT_ID),
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
});

/**
 * Gera uma URL pré-assinada para fazer upload de um arquivo diretamente para o R2.
 * @param {string} userId - O ID do usuário que está fazendo o upload.
 * @param {string} fileType - O tipo MIME do arquivo (ex: 'image/jpeg').
 * @returns {Promise<{signedUrl: string, publicUrl: string}>} - A URL para upload e a URL pública final.
 */
export const getPresignedUploadUrl = async (userId, fileType) => {
    if (!R2_BUCKET_NAME || !R2_PUBLIC_DOMAIN) {
        throw new Error("O nome do bucket R2 ou o domínio público não estão configurados.");
    }
    
    // Gera uma chave única para o arquivo para evitar sobreposições.
    const fileId = crypto.randomUUID();
    const key = `${userId}/${fileId}`; // Ex: "uuid-user-123/uuid-file-456"

    const command = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        ContentType: fileType,
    });

    // A URL assinada será válida por 5 minutos.
    const signedUrl = await getSignedUrl(S3, command, { expiresIn: 300 });
    
    // Esta é a URL que será armazenada no PostgreSQL.
    const publicUrl = `${R2_PUBLIC_DOMAIN}/${key}`;

    return { signedUrl, publicUrl };
};
