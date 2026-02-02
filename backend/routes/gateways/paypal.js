
import express from 'express';
import { paypalService } from '../../services/paypalService.js';

const router = express.Router();

router.post('/auth-token', async (req, res) => {
    try {
        const { clientId, clientSecret } = req.body;
        const token = await paypalService.verifyCredentials(clientId, clientSecret);
        res.json({ success: true, token });
    } catch (e) {
        res.status(401).json({ error: e.message });
    }
});

router.post('/create-order', async (req, res) => {
    try {
        const { amount, currency, description, clientId, clientSecret } = req.body;
        if (!clientId || !clientSecret) {
            return res.status(400).json({ error: "Credenciais do vendedor ausentes." });
        }
        const order = await paypalService.createOrder(clientId, clientSecret, amount, currency, description);
        res.json(order);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post('/check-status', async (req, res) => {
    try {
        const { orderId, clientId, clientSecret } = req.body;
        if (!clientId || !clientSecret) {
            return res.status(400).json({ error: "Credenciais do vendedor ausentes." });
        }
        const result = await paypalService.checkStatus(clientId, clientSecret, orderId);
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
