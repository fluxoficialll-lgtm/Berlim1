
import express from 'express';
import { syncPayService } from '../../services/syncpayService.js';
import { dbManager } from '../../databaseManager.js';

const router = express.Router();

/**
 * Helper para resolver token do parceiro a partir do banco de dados
 */
async function getPartnerTokenForSeller(sellerIdOrEmail) {
    if (!sellerIdOrEmail) return null;
    
    const user = await dbManager.users.findByEmail(sellerIdOrEmail) || await dbManager.users.findById(sellerIdOrEmail);
    if (!user) {
        console.warn(`[SyncPay Proxy] Vendedor não encontrado: ${sellerIdOrEmail}`);
        return null;
    }

    const config = user.paymentConfigs?.syncpay || user.paymentConfig;
    if (!config || !config.clientId || !config.clientSecret) {
        console.warn(`[SyncPay Proxy] Vendedor ${sellerIdOrEmail} sem credenciais SyncPay.`);
        return null;
    }

    return await syncPayService.getAccessToken(config.clientId, config.clientSecret);
}

router.post('/auth-token', async (req, res) => {
    try {
        const { clientId, clientSecret } = req.body;
        if (!clientId || !clientSecret) {
            return res.status(400).json({ error: 'Credenciais ausentes no corpo da requisição.' });
        }
        const token = await syncPayService.getAccessToken(clientId, clientSecret);
        res.json({ success: true, token });
    } catch (e) {
        // Agora o erro vem com a mensagem amigável lançada pelo service
        res.status(401).json({ error: e.message });
    }
});

router.post('/cash-in', async (req, res) => {
    try {
        const { payload } = req.body;
        const sellerId = payload.ownerEmail || payload.metadata?.ownerEmail || payload.sellerId;
        
        const token = await getPartnerTokenForSeller(sellerId);
        if (!token) {
            return res.status(401).json({ error: 'Este vendedor ainda não configurou as credenciais de pagamento (SyncPay).' });
        }
        
        const { ownerEmail, ...cleanPayload } = payload;
        
        const result = await syncPayService.createPayment(token, cleanPayload);
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post('/check-status', async (req, res) => {
    try {
        const { transactionId, ownerEmail } = req.body;
        const token = await getPartnerTokenForSeller(ownerEmail);
        if (!token) return res.status(401).json({ error: 'Não autorizado ou vendedor não configurado.' });
        
        const txData = await syncPayService.getTransactionStatus(token, transactionId);
        res.json({
            status: txData.status, 
            amount: txData.amount,
            identifier: txData.identifier || transactionId
        });
    } catch (e) {
        res.json({ status: 'pending', error: e.message });
    }
});

router.post('/balance', async (req, res) => {
    try {
        const { email } = req.body;
        const token = await getPartnerTokenForSeller(email);
        if (!token) return res.status(401).json({ error: 'Não autorizado.' });
        
        const data = await syncPayService.getBalance(token);
        res.json({ balance: parseFloat(data.balance || 0) });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
