
import { FinancialAnalyticsRepository } from '../../../../database/repositories/FinancialAnalyticsRepository.js';

/**
 * GET /api/admin/execute/analytics/payment-methods
 */
export default async (req, res) => {
    try {
        const { country } = req.query;
        const ranking = await FinancialAnalyticsRepository.getPaymentRanking(country);
        res.json({
            success: true,
            filters: { country: country || 'ALL' },
            ranking
        });
    } catch (e) {
        res.status(500).json({ error: "Falha ao gerar ranking financeiro." });
    }
};
