import { BaseFeeFormatter } from './BaseFeeFormatter.js';

/**
 * StripeFeeLogger
 * Especialista em logs da Stripe (Cartão/Internacional).
 * Cor: Azul
 */
export const StripeFeeLogger = {
    log(data) {
        const time = BaseFeeFormatter.getTimestamp();
        const flag = BaseFeeFormatter.flags[data.country_code?.toUpperCase()] || '🏳️';
        const values = BaseFeeFormatter.formatValues(data.fixed_fee, data.percent_fee);
        
        const prov = 'stripe'.padEnd(8);
        const meth = (data.method || 'card').padEnd(10);
        const curr = (data.currency || 'USD').toUpperCase();
        const country = (data.country_code || 'ALL').toUpperCase().padEnd(3);
        
        // ANSI Blue: \x1b[34m
        console.log(`\x1b[34m🕒 ${time} | 🏦 ${prov} | ${flag} ${country} | 💱 ${curr} | 💳 ${meth} | 📊 ${values}\x1b[0m`);
    }
};