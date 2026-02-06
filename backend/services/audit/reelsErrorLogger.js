/**
 * @fileoverview Logger de alta precisão para erros no client-side da página de Reels.
 * Formata e exibe informações contextuais detalhadas para depuração rápida.
 */

const reelsErrorLogger = {
  /**
   * Formata e loga um erro do front-end dos Reels com contexto detalhado.
   * @param {object} errorData - O objeto de erro enviado pelo cliente.
   * @param {object} requestContext - O contexto da requisição HTTP.
   * @param {string} requestContext.traceId - O ID de rastreamento da requisição.
   * @param {string} [requestContext.userId] - O ID do usuário que experienciou o erro.
   * @param {string} [requestContext.ip] - O endereço IP do cliente.
   * @param {string} [requestContext.userAgent] - O User-Agent do navegador do cliente.
   */
  logReelsClientError: (errorData, requestContext) => {
    const { error, errorInfo } = errorData;
    const { traceId, userId, ip, userAgent } = requestContext;

    const timestamp = new Date().toISOString();

    console.error('==================== [🚨 REELS FRONT-END CRITICAL ERROR] ====================');
    console.error(`| 🕒 Timestamp: ${timestamp}`);
    console.error(`| 🔗 Trace ID:   ${traceId}`);
    console.error('------------------------------ [👤 User Context] -------------------------------');
    console.error(`| User ID:    ${userId || 'Não autenticado'}`);
    console.error(`| IP Address: ${ip}`);
    console.error('---------------------------- [🌐 Request Context] -----------------------------');
    console.error(`| User Agent: ${userAgent}`);
    console.error('----------------------------- [📄 Error Details] ------------------------------');
    if (error && error.message) {
      console.error(`| Mensagem: ${error.message}`);
    }
    
    if (errorInfo && errorInfo.componentStack) {
      console.error('\n--------------- [⚛️ React Component Stack] ---------------');
      // Limpa espaços em branco e indenta para melhor leitura
      const formattedComponentStack = errorInfo.componentStack
        .split('\n')
        .map(line => `|  ${line.trim()}`)
        .join('\n');
      console.error(formattedComponentStack);
    }

    if (error && error.stack) {
      console.error('\n---------------- [📜 JavaScript Stack Trace] ----------------');
      // Indenta o stack trace para ficar alinhado
      const formattedStack = error.stack
        .split('\n')
        .map(line => `|  ${line.trim()}`)
        .join('\n');
      console.error(formattedStack);
    }
    
    console.error('=================================================================================');
  }
};

export default reelsErrorLogger;
