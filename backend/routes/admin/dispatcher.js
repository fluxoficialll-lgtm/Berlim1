
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Dispatcher Universal Admin
 * Resolve: [METODO]/[CATEGORIA]/[ACAO].js
 */
export const adminDispatcher = async (req, res) => {
    const { category, action } = req.params;
    const method = req.method.toUpperCase();

    // 1. Validação de Segurança (Prevenir Path Traversal)
    const safeRegex = /^[a-z0-9-]+$/i;
    if (!safeRegex.test(category) || !safeRegex.test(action)) {
        return res.status(400).json({ error: "Parâmetros de rota inválidos." });
    }

    // 2. Construção do caminho do módulo
    // Estrutura esperada: ./GET/system/config.js
    const actionPath = `./${method}/${category}/${action}.js`;

    try {
        // 3. Importação Dinâmica do Módulo
        const module = await import(actionPath);
        
        // 4. Execução da Função Default
        if (module.default && typeof module.default === 'function') {
            return await module.default(req, res);
        } else {
            throw new Error("Ação não exporta uma função padrão.");
        }
    } catch (error) {
        console.error(`[Admin Dispatcher Error] Path: ${actionPath} | Error:`, error.message);
        
        if (error.code === 'ERR_MODULE_NOT_FOUND') {
            return res.status(404).json({ 
                error: "Comando administrativo não encontrado.",
                path: `${method}/${category}/${action}`
            });
        }

        res.status(500).json({ error: "Erro interno ao executar comando: " + error.message });
    }
};
