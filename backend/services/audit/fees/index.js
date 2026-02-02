import { StripeFeeLogger } from './StripeFeeLogger.js';
import { SyncPayFeeLogger } from './SyncPayFeeLogger.js';
import { PayPalFeeLogger } from './PayPalFeeLogger.js';

/**
 * FeeAuditOrchestrator
 * Direciona o log para o driver especializado conforme o provedor.
 */
export const FeeAuditOrchestrator = {
    log(data) {
        const provider = (data.provider || '').toLowerCase();
        
        if (provider === 'stripe') {
            StripeFeeLogger.log(data);
        } else if (provider === 'syncpay') {
            SyncPayFeeLogger.log(data);
        } else if (provider === 'paypal') {
            PayPalFeeLogger.log(data);
        } else {
            // Fallback genérico caso surja um novo provedor sem driver
            console.log(`[FEE-AUDIT] ${provider.toUpperCase()}: ${data.fixed_fee} / ${data.percent_fee}%`);
        }
    }
};