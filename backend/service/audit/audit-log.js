
/**
 * @file backend/service/audit/audit-log.js
 * @description O serviço central de logging e auditoria estruturada.
 * Este módulo padroniza todos os logs da aplicação para facilitar a análise em produção.
 */

const LOG_LEVELS = {
    INFO: 'INFO',       // Para eventos de rotina importantes (ex: serviço iniciado).
    WARN: 'WARN',       // Para anomalias que não são erros (ex: tentativa de login com senha errada).
    ERROR: 'ERROR',     // Para erros de execução que são tratados (ex: falha na validação de dados).
    CRITICAL: 'CRITICAL' // Para erros que quebram uma funcionalidade (ex: falha de conexão com o banco).
};

/**
 * Formata e escreve um log estruturado no console.
 * 
 * @param {string} level - O nível do log (INFO, WARN, ERROR, CRITICAL).
 * @param {string} category - A categoria do evento (ex: AUTH, DATABASE, PAYMENT, R2_STORAGE).
 * @param {string} message - A mensagem descritiva do log.
 * @param {object} metadata - Um objeto com dados adicionais relevantes (ex: userId, transactionId, errorStack).
 */
const log = (level, category, message, metadata = {}) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        level,
        category,
        message,
        ...metadata
    };

    // Converte o objeto de log para uma string JSON e imprime no console.
    // Plataformas como Render irão ingerir essa string e permitir buscas avançadas.
    const logString = JSON.stringify(logEntry);

    if (level === LOG_LEVELS.ERROR || level === LOG_LEVELS.CRITICAL) {
        console.error(logString);
    } else {
        console.log(logString);
    }
};

// Exporta funções específicas para cada nível de log para facilitar o uso.
export const auditLog = {
    info: (category, message, metadata) => log(LOG_LEVELS.INFO, category, message, metadata),
    warn: (category, message, metadata) => log(LOG_LEVELS.WARN, category, message, metadata),
    error: (category, message, metadata) => log(LOG_LEVELS.ERROR, category, message, metadata),
    critical: (category, message, metadata) => log(LOG_LEVELS.CRITICAL, category, message, metadata),
};
