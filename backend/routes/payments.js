
import express from 'express';
import { dbManager } from '../databaseManager.js';
import { FeeEngine } from '../services/financial/FeeEngine.js';
import { NotificationEmitter } from '../services/socket/NotificationEmitter.js';
import { facebookCapi } from '../services/facebookCapi.js';

const router = express.Router();

router.post('/process-sale-success', async (req, res) => {
    try {
        const { transactionId, grossAmount, provider, method, sellerId, groupId, country, currency, buyerEmail, userData } = req.body;

        const breakdown = await FeeEngine.calculateTransaction(grossAmount, sellerId, {
            provider,
            method,
            country
        });

        // 1. Registro Financeiro
        await dbManager.financial.recordTransaction({
            userId: sellerId,
            type: 'sale',
            amount: breakdown.netAmount,
            status: 'paid',
            providerTxId: transactionId,
            currency: currency || 'BRL',
            data: {
                originalGross: grossAmount,
                platformProfit: breakdown.platformFee,
                groupId,
                provider,
                method
            }
        });

        // 2. DISPARO DE EVENTO PURCHASE (BLINDAGEM CAPI)
        const seller = await dbManager.users.findById(sellerId);
        const group = await dbManager.groups.findById(groupId);

        if (seller && seller.marketingConfig?.pixelId && seller.marketingConfig?.pixelToken) {
            try {
                await facebookCapi.sendEvent({
                    pixelId: seller.marketingConfig.pixelId,
                    accessToken: seller.marketingConfig.pixelToken,
                    eventName: 'Purchase',
                    origin: 'server', // Identifica Blindagem de Servidor
                    eventId: `pur_${transactionId}`,
                    url: `${process.env.APP_URL}/vip-group-sales/${groupId}`,
                    eventData: {
                        value: grossAmount,
                        currency: currency || 'BRL',
                        content_ids: [groupId],
                        content_type: 'product_group',
                        content_name: group?.name || 'Venda VIP'
                    },
                    userData: {
                        email: buyerEmail,
                        ip: req.ip,
                        userAgent: req.headers['user-agent'],
                        ...userData 
                    }
                });
            } catch (capiErr) {
                console.warn(`⚠️ [CAPI] Falha ao enviar Purchase: ${capiErr.message}`);
            }
        }

        // 3. Notificação Real-time
        if (req.io && buyerEmail && groupId) {
            NotificationEmitter.emitPaymentSuccess(req.io, buyerEmail, groupId, group?.name || 'VIP');
        }

        res.json({ success: true, breakdown });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
