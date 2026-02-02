
import express from 'express';
import { AggregatorRepository } from '../database/repositories/AggregatorRepository.js';

const router = express.Router();

/**
 * BFF Endpoint: My Business Screen (Criador - Acesso Comum)
 * Este permanece aqui pois é usado por usuários normais para verem seus próprios dados.
 */
router.get('/my-business', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ error: "userId is required" });

        const dashboard = await AggregatorRepository.getBusinessDashboard(userId);
        
        res.json({
            success: true,
            timestamp: Date.now(),
            ...dashboard
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
