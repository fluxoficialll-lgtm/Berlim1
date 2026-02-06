
import { query } from './pool.js';
import { settingsSchema } from './schemas/settings.js';
import { usersSchema } from './schemas/users.js';
import { groupsSchema } from './schemas/groups.js';
import { postsSchema } from './schemas/posts.js';
import { chatsSchema } from './schemas/chats.js';
import { marketplaceSchema } from './schemas/marketplace.js';
import { relationshipsSchema } from './schemas/relationships.js';
import { reportsSchema } from './schemas/reports.js';
import { interactionsSchema } from './schemas/interactions.js';
import { vipSchema } from './schemas/vip.js';
import { financialSchema } from './schemas/financial.js';
import { adsSchema } from './schemas/ads.js';
import { feesSchema } from './schemas/fees.js';
import { auditSchema } from './schemas/audit.js';

export const SchemaBootstrapper = {
    async run() {
        console.log("🔄 DB: Iniciando Verificação de Estrutura (Idempotente)...");
        
        try {
            // 1. Requisito Base
            await query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
            
            // 2. ORDEM DE PRIORIDADE: settingsSchema primeiro para evitar erros em rotas de config
            const schemas = [
                settingsSchema, // Essencial para o sistema respirar
                usersSchema, 
                groupsSchema, 
                postsSchema,
                chatsSchema, 
                marketplaceSchema, 
                relationshipsSchema,
                reportsSchema, 
                interactionsSchema, 
                vipSchema,    
                financialSchema, 
                adsSchema, 
                feesSchema, 
                auditSchema
            ];

            for (const sql of schemas) { 
                await query(sql); 
            }

            console.log("✅ DB: Estrutura 100% Sincronizada.");
            return true;
        } catch (e) {
            console.error("❌ DB: Falha Crítica no Bootstrapper:", e.message);
            return false;
        }
    }
};
