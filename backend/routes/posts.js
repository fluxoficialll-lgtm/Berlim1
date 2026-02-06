
import express from 'express';
import { dbManager } from '../databaseManager.js';

const router = express.Router();

// Listar Posts (Feed) com Paginação
router.get('/', async (req, res) => {
    try {
        const { limit, cursor } = req.query;
        const posts = await dbManager.posts.list(Number(limit) || 50, cursor);
        
        let nextCursor = null;
        if (posts.length > 0) {
            nextCursor = posts[posts.length - 1].timestamp;
        }

        res.json({ data: posts, nextCursor });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Criar Post com Metadados e URL do Arquivo
router.post('/create', async (req, res) => {
    try {
        // O authorId virá do token de autenticação (ex: req.user.id)
        const authorId = req.body.userId; // EXEMPLO: Substitua por req.user.id
        const { text, fileUrl, groupId } = req.body; // O cliente envia o texto e a URL do arquivo.

        if (!authorId) {
             return res.status(401).json({ error: "Autenticação necessária." });
        }
        if (!fileUrl) {
            return res.status(400).json({ error: "A URL do arquivo (fileUrl) é obrigatória." });
        }

        // O objeto `post` agora contém a URL do arquivo, em vez do conteúdo binário.
        const post = { 
            authorId,
            text, // O texto/legenda do post
            fileUrl, // A URL pública do arquivo no R2
            groupId, // Opcional: O grupo ao qual o post pertence
            // Outros metadados que você queira salvar no PostgreSQL...
        };
        
        // Salva os metadados no PostgreSQL.
        const createdPost = await dbManager.posts.create(post);
        
        res.status(201).json({ success: true, post: createdPost });

    } catch (e) {
        console.error("Erro ao criar post:", e);
        res.status(500).json({ error: "Não foi possível salvar o post." });
    }
});

// Interagir (Like / View)
router.post('/:id/interact', async (req, res) => {
    try {
        const { id } = req.params;
        const { type, userId, action } = req.body;
        
        if (!userId || !type) return res.status(400).json({ error: "userId e type são obrigatórios" });
        
        let success = false;
        if (action === 'remove' && type === 'like') {
            success = await dbManager.interactions.removeInteraction(id, userId, type);
        } else {
            success = await dbManager.interactions.recordUniqueInteraction(id, userId, type);
        }
        
        res.json({ success, message: success ? "Interação processada" : "Interação ignorada" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ... (outras rotas de posts permanecem as mesmas)

export default router;
