
import axios from 'axios';

const SYNC_PAY_API = 'https://api.syncpayments.com.br/api/partner/v1';

export const syncPayService = {
    async getAccessToken(clientId, clientSecret) {
        try {
            // Construção robusta do payload codificado em URL
            const payload = new URLSearchParams();
            payload.append('client_id', clientId);
            payload.append('client_secret', clientSecret);
            payload.append('grant_type', 'client_credentials');

            const response = await axios({
                method: 'post',
                url: `${SYNC_PAY_API}/auth-token`,
                data: payload.toString(),
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                    'User-Agent': 'FluxPlatform/4.0'
                },
                timeout: 10000
            });
            
            // SyncPay retorna o token direto ou dentro de um objeto dependendo da versão da API
            const token = response.data.access_token || response.data.token;
            
            if (!token) {
                throw new Error("Resposta de autenticação inválida: Token não recebido.");
            }

            return token;
        } catch (error) {
            const errorData = error.response?.data;
            console.error('🔴 [SyncPay Auth Error]:', errorData || error.message);
            
            let message = 'Erro na SyncPay: ';
            if (errorData?.error === 'invalid_client') {
                message += 'Chaves de cliente inválidas ou formato não suportado.';
            } else {
                message += errorData?.error_description || errorData?.message || error.message;
            }
                
            throw new Error(message);
        }
    },

    async createPayment(token, payload) {
        try {
            const response = await axios.post(`${SYNC_PAY_API}/cash-in`, payload, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('🔴 [SyncPay Cash-in Error]:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Erro ao gerar solicitação de Pix na SyncPay.');
        }
    },

    async getTransactionStatus(token, identifier) {
        try {
            const response = await axios.get(`${SYNC_PAY_API}/transaction/${identifier}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data.data;
        } catch (error) {
            console.error('🔴 [SyncPay Status Error]:', error.response?.data || error.message);
            throw new Error('Falha ao consultar status da transação.');
        }
    },

    async getBalance(token) {
        try {
            const response = await axios.get(`${SYNC_PAY_API}/balance`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('🔴 [SyncPay Balance Error]:', error.response?.data || error.message);
            return { balance: "0.00" };
        }
    }
};
