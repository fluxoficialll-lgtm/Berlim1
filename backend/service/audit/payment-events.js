
import { auditLog } from './audit-log.js';

const CATEGORY = 'PAYMENT';

/**
 * Logs detalhados para o ciclo de vida de pagamentos, integrando com provedores como SyncPay.
 */
export const paymentEvents = {
    /** O usuário iniciou o processo de checkout. */
    checkoutInitiated: (userId, orderId, amount) => 
        auditLog.info(CATEGORY, 'Checkout iniciado.', { userId, orderId, amount }),

    /** O provedor de pagamento (ex: SyncPay) retornou um erro ANTES da cobrança. */
    providerError: (orderId, provider, errorMessage, errorDetails) => 
        auditLog.error(CATEGORY, `Erro do provedor [${provider}] antes da cobrança.`, { orderId, provider, errorMessage, details: errorDetails }),

    /** O pagamento foi confirmado com sucesso pelo provedor. */
    paymentSuccess: (orderId, userId, provider, transactionId, amount) => 
        auditLog.info(CATEGORY, 'Pagamento bem-sucedido.', { orderId, userId, provider, providerTransactionId: transactionId, amount }),

    /** O pagamento FALHOU no momento da cobrança. */
    paymentFailure: (orderId, userId, provider, failureReason, providerResponseCode) => 
        auditLog.critical(CATEGORY, `FALHA no pagamento: ${failureReason}`, { orderId, userId, provider, providerCode: providerResponseCode }),

    /** Um webhook foi recebido do provedor de pagamento. Essencial para depurar eventos assíncronos. */
    webhookReceived: (provider, payload) => 
        auditLog.info(CATEGORY, `Webhook recebido do [${provider}].`, { provider, body: payload }),

    /** Ocorreu um erro ao processar um webhook (ex: assinatura inválida, pedido não encontrado). */
    webhookProcessingError: (provider, error, payload) => 
        auditLog.error(CATEGORY, `Erro ao processar webhook do [${provider}].`, { provider, errorMessage: error.message, body: payload }),

    /** Um reembolso foi solicitado. */
    refundInitiated: (originalTransactionId, userId, requestedBy, amount, reason) => 
        auditLog.warn(CATEGORY, 'Solicitação de reembolso iniciada.', { originalTransactionId, userId, requestedBy, amount, reason }),

    /** O reembolso foi processado com sucesso. */
    refundSuccess: (refundTransactionId, originalTransactionId, amount) => 
        auditLog.info(CATEGORY, 'Reembolso bem-sucedido.', { refundTransactionId, originalTransactionId, amount }),
};
