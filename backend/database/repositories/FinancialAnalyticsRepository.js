
import { query } from '../pool.js';

export const FinancialAnalyticsRepository = {
    /**
     * Gera o ranking global de métodos de pagamento (usado pelo Admin)
     */
    async getPaymentRanking(country = null) {
        let sql = `
            SELECT 
                method_name as method,
                provider,
                country,
                COUNT(*) as usage_count,
                SUM(amount) as total_volume,
                MAX(created_at) as last_used
            FROM payment_methods_usage
        `;

        const params = [];
        if (country) {
            sql += ` WHERE country = $1 `;
            params.push(country.toUpperCase());
        }

        sql += ` 
            GROUP BY method_name, provider, country
            ORDER BY usage_count DESC
        `;

        const result = await query(sql, params);
        return result.rows.map(item => ({
            method: item.method,
            provider: item.provider,
            country: item.country,
            count: parseInt(item.usage_count),
            volume: parseFloat(item.total_volume || 0),
            lastUsed: item.last_used
        }));
    },

    /**
     * Ranking de pagamentos específico de um vendedor
     */
    async getSellerPaymentRanking(sellerId) {
        const res = await query(`
            SELECT 
                method_name as method,
                provider,
                COUNT(*) as usage_count,
                SUM(amount) as total_volume,
                MAX(created_at) as last_used
            FROM payment_methods_usage
            WHERE seller_id = $1
            GROUP BY method_name, provider
            ORDER BY usage_count DESC
        `, [sellerId]);
        
        return res.rows;
    },

    /**
     * Registra o uso de um método de pagamento para análise de conversão por país/gateway
     */
    async recordPaymentMethodUsage(data) {
        const { methodName, provider, amount, currency, country, sellerId } = data;
        await query(`
            INSERT INTO payment_methods_usage (method_name, provider, amount, currency, country, seller_id)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [methodName, provider, amount, currency, country, sellerId]);
    }
};
