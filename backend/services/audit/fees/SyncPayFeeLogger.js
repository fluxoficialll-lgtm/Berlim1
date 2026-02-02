import { BaseFeeFormatter } from './BaseFeeFormatter.js';

/**
 * SyncPayFeeLogger
 * Especialista em logs da SyncPay (Pix/Brasil).
 * Cor: Verde
 */
export const SyncPayFeeLogger = {
    log(data) {
        const time = BaseFeeFormatter.getTimestamp();
        const flag = BaseFeeFormatter.flags[data.country_code?.toUpperCase()] || '🇧🇷';
        const values = BaseFeeFormatter.formatValues(data.fixed_fee, data.percent_fee);
        
        const prov = 'syncpay'.padEnd(8);
        const meth = (data.method || 'pix').padEnd(10);
        const curr = (data.currency || 'BRL').toUpperCase();
        const country = (data.country_code || 'BR').toUpperCase().padEnd(3);
        
        // ANSI Green: \x1b[32m
        console.log(`\x1b[32m🕒 ${time} | 🏦 ${prov} | ${flag} ${country} | 💱 ${curr} | 💳 ${meth} | 📊 ${values}\x1b[0m`);
    }
};