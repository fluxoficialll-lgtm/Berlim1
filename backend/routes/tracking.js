
import express from 'express';
import { facebookCapi } from '../services/facebookCapi.js';
import { dbManager } from '../databaseManager.js';

const router = express.Router();

/**
 * Hub Server-Side Tracking
 * Processa eventos para Meta e outras plataformas via CAPI.
 */
router.post('/capi', async (req, res) => {
    try {
        const { platform, pixelId, accessToken, eventName, eventData, userData, eventId, url } = req.body;
        
        // Captura do IP real do cliente via Trust Proxy
        const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        if (platform === 'meta' || !platform) {
            const result = await facebookCapi.sendEvent({
                pixelId,
                accessToken,
                eventName,
                origin: 'browser', // Identifica que o disparo veio da interação no site
                eventId,
                url,
                eventData,
                userData: {
                    ...userData,
                    ip: clientIp 
                }
            });
            return res.json({ success: true, platform: 'meta', result });
        }

        res.status(400).json({ error: "PLATFORM_NOT_SUPPORTED" });
    } catch (e) {
        console.warn(`[CAPI ROUTE ERR]: ${e.message}`);
        res.status(202).json({ status: "FAILED", error: e.message });
    }
});

router.get('/pixel-info', async (req, res) => {
    try {
        const { ref } = req.query;
        if (!ref) return res.status(400).json({ error: "REF_REQUIRED" });
        const user = await dbManager.users.findByEmail(ref) || await dbManager.users.findByHandle(ref);
        if (user && user.marketingConfig?.pixelId) {
            return res.json({ pixelId: user.marketingConfig.pixelId });
        }
        res.json({ pixelId: process.env.VITE_PIXEL_ID || "" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
