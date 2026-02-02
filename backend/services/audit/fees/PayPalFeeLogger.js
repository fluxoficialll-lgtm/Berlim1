import { BaseFeeFormatter } from './BaseFeeFormatter.js';

/**
 * PayPalFeeLogger
 * Especialista em logs do PayPal.
 * Cor: Amarelo
 */
export const PayPalFeeLogger = {
    log(data) {
        const time = BaseFeeFormatter.getTimestamp();
        const flag = BaseFeeFormatter.flags[data.country_code?.toUpperCase()] || '🌍';
        const values = BaseFeeFormatter.formatValues(data.fixed_fee, data.percent_fee);
        
        const prov = 'paypal'.padEnd(8);
        const meth = (data.method || 'wallet').padEnd(10);
        const curr = (data.currency || 'USD').toUpperCase();
        const country = (data.country_code || 'ALL').toUpperCase().padEnd(3);
        
        // ANSI Yellow: \x1b[33m
        console.log(`\x1b[33m🕒 ${time} | 🏦 ${prov} | ${flag} ${country} | 💱 ${curr} | 💳 ${meth} | 📊 ${values}\x1b[0m`);
    }
};