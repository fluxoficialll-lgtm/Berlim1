
import { FeeRepository } from '../../database/repositories/financial/FeeRepository.js';

/**
 * FeeCalculator (Motor de Taxas)
 * Centraliza a inteligência de quanto a plataforma ganha em cada transação.
 */
export const FeeCalculator = {
    /**
     * Calcula o faturamento líquido e a comissão da plataforma.
     * @param {number} grossAmount Valor bruto pago pelo cliente.
     * @param {string} provider Gateway utilizado.
     * @param {string} method Método de pagamento.
     * @param {string} country Código do país.
     */
    async calculateNet(grossAmount, provider, method, country = 'ALL') {
        const rule = await FeeRepository.findRule(provider, method, country);

        // Se não houver regra específica, aplica um fallback de segurança (ex: 10%)
        if (!rule) {
            const fallbackFee = grossAmount * 0.10;
            return {
                gross: grossAmount,
                platformFee: parseFloat(fallbackFee.toFixed(2)),
                netAmount: parseFloat((grossAmount - fallbackFee).toFixed(2)),
                appliedRule: 'SAFETY_FALLBACK_10'
            };
        }

        // Cálculo: (Valor * %) + Fixo
        const percentageValue = grossAmount * (Number(rule.percent_fee) / 100);
        const fixedValue = Number(rule.fixed_fee);
        
        const platformFee = percentageValue + fixedValue;
        const netAmount = Math.max(0, grossAmount - platformFee);

        return {
            gross: grossAmount,
            platformFee: parseFloat(platformFee.toFixed(2)),
            netAmount: parseFloat(netAmount.toFixed(2)),
            appliedRuleId: rule.id,
            appliedRule: `${rule.percent_fee}% + R$ ${rule.fixed_fee}`
        };
    }
};
