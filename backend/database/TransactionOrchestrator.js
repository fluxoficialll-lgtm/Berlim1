
import { pool } from './pool.js';

/**
 * TransactionOrchestrator: Garante o princípio ACID.
 * Ou todas as operações no bloco funcionam, ou nenhuma é aplicada.
 */
export const TransactionOrchestrator = {
    /**
     * Executa uma série de operações em uma única transação SQL.
     * @param {Function} callback (client) => Promise<any>
     */
    async run(callback) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const result = await callback(client);
            await client.query('COMMIT');
            return result;
        } catch (e) {
            await client.query('ROLLBACK');
            console.error("⚠️ [Transaction Rollback] Erro detectado, mudanças revertidas:", e.message);
            throw e;
        } finally {
            client.release();
        }
    }
};
