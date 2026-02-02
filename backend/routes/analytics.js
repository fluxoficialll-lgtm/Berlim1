
import express from 'express';
import { FinancialAnalyticsRepository } from '../database/repositories/FinancialAnalyticsRepository.js';
import { validateAdmin } from '../middleware.js';

const router = express.Router();

router.use(validateAdmin);

/**
 * GET /api/analytics/payment-ranking
 */
router.get('/payment-ranking', async (req, res) => {
    try {
        const { country } = req.query; 
        const ranking = await FinancialAnalyticsRepository.getPaymentRanking(country);
        res.json({
            success: true,
            filters: { country: country || 'ALL' },
            ranking
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * GET /api/analytics/user/:userId/payment-ranking
 */
router.get('/user/:userId/payment-ranking', async (req, res) => {
    try {
        const { userId } = req.params;
        const ranking = await FinancialAnalyticsRepository.getSellerPaymentRanking(userId);
        res.json({
            success: true,
            userId,
            ranking
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * Endpoint manual para log de métodos (caso necessário bypassar gateways)
 */
router.post('/log-payment-method', async (req, res) => {
    try {
        const data = req.body;
        if (!data.methodName || !data.provider) {
            return res.status(400).json({ error: "methodName and provider are required." });
        }
        await FinancialAnalyticsRepository.recordPaymentMethodUsage(data);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
