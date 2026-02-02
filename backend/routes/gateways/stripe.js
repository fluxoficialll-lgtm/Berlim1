
import express from 'express';
import { stripeService } from '../../services/stripeService.js';

const router = express.Router();

router.post('/auth-token', async (req, res) => {
    try {
        const { secretKey } = req.body;
        const data = await stripeService.verifyCredentials(secretKey);
        res.json({ success: true, data });
    } catch (e) {
        res.status(401).json({ error: e.message });
    }
});

router.post('/create-session', async (req, res) => {
    try {
        const { group, ownerEmail, successUrl, cancelUrl } = req.body;
        const session = await stripeService.createCheckoutSession(group, group.creatorId, successUrl, cancelUrl);
        res.json(session);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post('/check-status', async (req, res) => {
    try {
        const { sessionId, ownerEmail } = req.body;
        // Lógica de verificação real via Stripe API...
        res.json({ status: 'pending' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
