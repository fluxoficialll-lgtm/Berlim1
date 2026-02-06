
import { auditLog } from './audit-log.js';

const CATEGORY = 'DATABASE';
// Defina um limite em milissegundos para considerar uma query como lenta.
const SLOW_QUERY_THRESHOLD_MS = 500; 

/**
 * Logs de diagnóstico para interações com o banco de dados.
 */
export const dbEvents = {
    /**
     * Loga uma query que executou com sucesso, mas de forma lenta.
     * Identificar queries lentas é crucial para otimização de performance.
     */
    slowQuery: (queryName, executionTimeMs, params) => {
        if (executionTimeMs > SLOW_QUERY_THRESHOLD_MS) {
            auditLog.warn(CATEGORY, `Query lenta detectada: '${queryName}'`, {
                queryName,
                duration: executionTimeMs,
                threshold: SLOW_QUERY_THRESHOLD_MS,
                params: JSON.stringify(params) // Parâmetros que causaram a lentidão
            });
        }
    },

    /**
     * Loga um erro de query com detalhes ricos para diagnóstico imediato.
     * @param {string} queryName - Nome funcional da operação (ex: 'createUser').
     * @param {Error} error - O objeto de erro do driver do banco de dados.
     * @param {object} params - Os parâmetros enviados para a query que falhou.
     */
    queryError: (queryName, error, params) => 
        auditLog.error(CATEGORY, `Erro ao executar a query '${queryName}'.`, {
            queryName,
            errorMessage: error.message, // Mensagem de erro do PostgreSQL
            sqlState: error.code, // Código de erro padrão SQL (ex: '23505' para unique_violation)
            errorCode: error.routine, // Rotina interna do Postgres que falhou (ex: 'ExecConstraints')
            params, // Os dados exatos que causaram a falha
            stackTrace: error.stack // O caminho completo do código até o erro
        }),

    /**
     * Loga uma falha crítica de conexão. Isso geralmente requer intervenção imediata.
     */
    connectionError: (error) => 
        auditLog.critical(CATEGORY, 'Falha crítica na conexão com o banco de dados.', {
            errorMessage: error.message,
            host: error.host, // O host ao qual se tentou conectar
            stack: error.stack
        }),

    /**
     * Confirma que uma reconexão foi bem-sucedida após uma falha.
     */
    reconnectionSuccess: () => 
        auditLog.info(CATEGORY, 'Reconexão com o banco de dados estabelecida com sucesso.'),
};
