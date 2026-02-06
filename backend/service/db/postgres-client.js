
import pg from 'pg';
import { dbEvents } from '../audit/db-events.js';

// Garante que estamos usando o tipo de dado correto para o BigInt do node-postgres
pg.types.setTypeParser(20, (val) => parseInt(val, 10));

/**
 * Cliente centralizado para todas as interações com o PostgreSQL.
 * Gerencia o pool de conexões e integra-se ao sistema de auditoria para logging detalhado.
 */
class PostgresClient {
    constructor() {
        this.pool = new pg.Pool({
            connectionString: process.env.DATABASE_URL, // A URL de conexão vem das variáveis de ambiente
            // Configurações recomendadas para um ambiente de produção:
            max: 20, // máximo de 20 clientes no pool
            idleTimeoutMillis: 30000, // cliente fica ocioso por 30s antes de fechar
            connectionTimeoutMillis: 2000, // 2s de timeout para conectar
        });

        // Loga um erro CRÍTICO se não conseguir conectar ao banco durante a inicialização.
        this.pool.on('error', (err) => {
            dbEvents.connectionError(err);
        });
    }

    /**
     * Executa uma query no banco de dados, com logging e medição de performance integrados.
     * @param {string} queryName - Um nome funcional para a query (ex: 'createUser').
     * @param {string} text - O comando SQL parametrizado (ex: 'INSERT INTO users (id, email) VALUES ($1, $2)').
     * @param {Array} params - Os valores para a query.
     * @returns {Promise<pg.QueryResult>} O resultado da query.
     */
    async query(queryName, text, params) {
        const start = Date.now();
        try {
            const res = await this.pool.query(text, params);
            const duration = Date.now() - start;
            
            // Loga queries lentas de forma proativa.
            dbEvents.slowQuery(queryName, duration, params);
            
            return res;
        } catch (error) {
            // Loga o erro com todos os detalhes diagnósticos que definimos.
            dbEvents.queryError(queryName, error, params);
            // Lança o erro novamente para que o serviço que chamou saiba que a operação falhou.
            throw error;
        }
    }
}

// Exporta uma única instância (Singleton) do cliente para ser usada em toda a aplicação.
export const postgresClient = new PostgresClient();
