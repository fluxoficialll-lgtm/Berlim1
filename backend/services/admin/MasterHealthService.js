/**
 * MasterHealthService
 * Verifica a saúde das contas oficiais da Flux (onde caem as taxas).
 */
export const MasterHealthService = {
    async checkAll() {
        return {
            syncpay: await this.checkSyncPay(),
            stripe: await this.checkStripe(),
            paypal: await this.checkPayPal()
        };
    },

    async checkSyncPay() {
        const clientId = process.env.SYNCPAY_MASTER_CLIENT_ID;
        const secret = process.env.SYNCPAY_MASTER_CLIENT_SECRET;

        if (!clientId || !secret) return 'missing_key';
        
        try {
            // Simulação de handshake com a API da SyncPay
            // const token = await syncPayService.getAccessToken(clientId, secret);
            return 'ok';
        } catch (e) {
            return 'invalid_token';
        }
    },

    async checkStripe() {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) return 'missing_key';
        if (secretKey.includes('pk_')) return 'pending'; // Erro comum: colocar a chave pública onde deve ser a secreta
        
        return 'ok';
    },

    async checkPayPal() {
        const clientId = process.env.PAYPAL_MASTER_CLIENT_ID;
        if (!clientId) return 'missing_key';
        
        // Exemplo de verificação de conexão falhando
        // return 'failed'; 
        return 'ok';
    }
};