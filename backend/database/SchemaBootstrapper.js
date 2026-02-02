
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

            await this.setupTriggers();
            console.log("✅ DB: Estrutura 100% Sincronizada.");
            return true;
        } catch (e) {
            console.error("❌ DB: Falha Crítica no Bootstrapper:", e.message);
            return false;
        }
    },

    async setupTriggers() {
        try {
            await query(`
                CREATE OR REPLACE FUNCTION update_member_count()
                RETURNS TRIGGER AS $$
                BEGIN
                    IF (TG_OP = 'INSERT') THEN
                        UPDATE groups SET member_count = member_count + 1 WHERE id = NEW.group_id;
                    ELSIF (TG_OP = 'DELETE') THEN
                        UPDATE groups SET member_count = GREATEST(0, member_count - 1) WHERE id = OLD.group_id;
                    END IF;
                    RETURN NULL;
                END;
                $$ LANGUAGE plpgsql;

                DROP TRIGGER IF EXISTS trg_update_member_count ON vip_access;
                CREATE TRIGGER trg_update_member_count
                AFTER INSERT OR DELETE ON vip_access
                FOR EACH ROW EXECUTE FUNCTION update_member_count();
            `);
        } catch (e) {
            console.warn("⚠️ DB: Trigger de contagem não pôde ser instalada (isso é normal se a tabela groups ainda não tiver dados).");
        }
    }
};
