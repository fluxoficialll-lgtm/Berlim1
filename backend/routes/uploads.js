
import express from 'express';
import { getPresignedUploadUrl } from '../cloudflare-r2-manager.js';

const router = express.Router();

/**
 * Rota para obter uma URL de upload pré-assinada para o Cloudflare R2.
 * O cliente deve enviar o tipo de arquivo (ex: 'image/jpeg') no corpo da requisição.
 */
router.post('/request-upload-url', async (req, res) => {
    try {
        // O userId deve ser extraído do seu token de autenticação (middleware).
        // Substitua 'req.body.userId' por 'req.user.id' quando seu middleware estiver pronto.
        const userId = req.body.userId; // EXEMPLO: Você DEVE substituir isso.
        const { fileType } = req.body;

        if (!userId) {
            return res.status(401).json({ error: "Autenticação necessária." });
        }
        if (!fileType) {
            return res.status(400).json({ error: "O tipo de arquivo (fileType) é obrigatório." });
        }

        const { signedUrl, publicUrl } = await getPresignedUploadUrl(userId, fileType);

        res.json({ 
            uploadUrl: signedUrl, 
            publicFileUrl: publicUrl // Esta é a URL que você salvará no banco de dados.
        });

    } catch (e) {
        console.error("Erro ao gerar URL de upload:", e);
        res.status(500).json({ error: "Não foi possível processar a solicitação de upload." });
    }
});

export default router;
