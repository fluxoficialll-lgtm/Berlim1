
import { SchemaBootstrapper } from './database/SchemaBootstrapper.js';
import { RepositoryHub } from './database/RepositoryHub.js';
import { pool } from './database/pool.js';

/**
 * dbManager
 * Fachada unificada que mantém compatibilidade com as rotas existentes.
 */
export const dbManager = {
    /**
     * Inicializa a infraestrutura de dados e testa a conexão.
     */
    async init() {
        try {
            console.log("🛠️ Tentando conectar ao banco de dados...");
            // Testa a conexão básica antes de tentar rodar os schemas
            const testClient = await pool.connect();
            console.log("✅ Conexão física com o banco estabelecida.");
            testClient.release();
            
            return await SchemaBootstrapper.run();
        } catch (error) {
            console.error("❌ FALHA NO BOOT DO BANCO DE DADOS:");
            console.error(`   Mensagem: ${error.message}`);
            
            if (error.message.includes('ENOTFOUND')) {
                console.error("   Causa: O endereço do banco de dados não foi encontrado.");
                console.error("   Ação: Certifique-se de usar a URL EXTERNA (External Connection String) do Render para testes locais.");
            }
            
            // Não travamos o processo, mas o sistema operará em modo de erro nas rotas
            return false;
        }
    },

    // Acesso direto aos repositórios via delegação (Hub de Dados)
    ...RepositoryHub
};
