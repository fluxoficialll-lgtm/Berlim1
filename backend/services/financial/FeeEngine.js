
import { FeeRepository } from '../../database/repositories/financial/FeeRepository.js';

/**
 * MOTOR DE TAXAS E CONVERSÃO (Global Profit Engine)
 */
export const FeeEngine = {
    /**
     * Busca taxa de câmbio simplificada para o cálculo de taxas
     * Baseada em cache ou API externa
     */
    async getExchangeRate(from, to) {
        if (from === to) return 1;
        try {
            const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
            const data = await res.json();
            return data.rates[to] || 1;
        } catch (e) {
            console.warn(`[FeeEngine] Erro no câmbio ${from}->${to}, usando paridade 1:1`);
            return 1;
        }
    },

    /**
     * Calcula o faturamento detalhado de uma venda com inteligência de câmbio
     */
    async calculateTransaction(grossAmount, sellerId, context) {
        const { provider, method, country = 'ALL', currency: paymentCurrency = 'BRL' } = context;

        // 1. ISENÇÃO: Anunciantes Ativos
        const isAdvertiser = await FeeRepository.hasActiveCampaigns(sellerId);
        if (isAdvertiser) {
            return {
                gross: grossAmount,
                platformFee: 0,
                netAmount: grossAmount,
                currency: paymentCurrency,
                policyApplied: 'EXEMPTION_ACTIVE_ADVERTISER',
                details: 'Taxa zero (Anunciante Ativo)'
            };
        }

        // 2. BUSCA REGRA GRANULAR
        const rule = await FeeRepository.resolveBestRule(provider, method, country);

        if (!rule) {
            const safetyFee = parseFloat((grossAmount * 0.15).toFixed(2));
            return {
                gross: grossAmount,
                platformFee: safetyFee,
                netAmount: grossAmount - safetyFee,
                currency: paymentCurrency,
                policyApplied: 'SAFETY_FALLBACK_15',
                details: '15.00% (Regra Padrão)'
            };
        }

        // 3. INTELIGÊNCIA DE CÂMBIO
        // Se o pagamento for em JPY e a regra for em USD, convertemos o bruto para USD
        const settlementCurrency = rule.currency || 'USD';
        const rate = await this.getExchangeRate(paymentCurrency, settlementCurrency);
        
        const grossInSettlementCurrency = grossAmount * rate;

        // 4. CÁLCULO NA MOEDA DO VENDEDOR
        const percentageValue = grossInSettlementCurrency * (Number(rule.percent_fee) / 100);
        const fixedValue = Number(rule.fixed_fee);
        const totalFeeInSettlement = parseFloat((percentageValue + fixedValue).toFixed(2));
        const netInSettlement = Math.max(0, grossInSettlementCurrency - totalFeeInSettlement);

        return {
            originalGross: grossAmount,
            originalCurrency: paymentCurrency,
            gross: parseFloat(grossInSettlementCurrency.toFixed(2)),
            platformFee: totalFeeInSettlement,
            netAmount: parseFloat(netInSettlement.toFixed(2)),
            currency: settlementCurrency,
            appliedRuleId: rule.id,
            policyApplied: `RULE_${rule.provider.toUpperCase()}_${rule.method.toUpperCase()}`,
            details: `${rule.percent_fee}% + ${settlementCurrency} ${rule.fixed_fee}`
        };
    }
};
