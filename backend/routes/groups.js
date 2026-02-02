
import express from 'express';
import { dbManager } from '../databaseManager.js';
import { RankingHub } from '../database/repositories/ranking/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const groups = await dbManager.groups.list();
        res.json({ data: groups });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

/**
 * Endpoint de Ranking Consistente
 * Agora utiliza o RankingHub para garantir que a contagem de membros seja a fonte única de verdade.
 */
router.get('/ranking', async (req, res) => {
    try {
        const { type, limit } = req.query;
        const groups = await RankingHub.getGroupsByMemberVolume(type || 'public', parseInt(limit) || 100);
        res.json({ data: groups });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', async (req, res) => {
    try {
        const group = await dbManager.groups.findById(req.params.id);
        if (!group) return res.status(404).json({ error: 'Grupo não encontrado' });
        res.json({ group });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/create', async (req, res) => {
    try {
        await dbManager.groups.create(req.body);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', async (req, res) => {
    try {
        await dbManager.groups.update(req.body);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', async (req, res) => {
    try {
        await dbManager.groups.delete(req.params.id);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;
