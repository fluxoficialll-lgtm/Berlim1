import { query } from '../database/pool.js';

/**
 * IntegrityCheck: Garante que os contadores de ranking reflitam a realidade física do banco.
 */
export const IntegrityCheck = {
    /**
     * Recalcula o member_count de todos os grupos baseado na tabela vip_access e memberIds.
     */
    async fixGroupMemberCounts() {
        console.log("🛡️ [Integrity] Iniciando auditoria de contagem de membros...");
        try {
            // Verifica se a tabela e colunas existem antes de rodar
            const tableCheck = await query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'groups' AND column_name = 'status'
            `);

            if (tableCheck.rows.length === 0) {
                console.warn("⚠️ [Integrity] Abortando: Coluna 'status' ainda não migrada.");
                return;
            }

            await query(`
                UPDATE groups g
                SET member_count = (
                    SELECT COUNT(*) 
                    FROM (
                        SELECT jsonb_array_elements_text(COALESCE(data->'memberIds', '[]'::jsonb))
                    ) as members
                )
                WHERE status = 'active'
            `);
            
            console.log("✅ [Integrity] Contagem de membros sincronizada.");
        } catch (e) {
            console.error("❌ [Integrity] Falha na auditoria:", e.message);
        }
    },

    /**
     * Remove acessos VIP expirados que não foram limpos por falha de servidor.
     */
    async cleanupExpiredVip() {
        try {
            const res = await query(`
                DELETE FROM vip_access 
                WHERE (data->>'expiresAt')::bigint < extract(epoch from now()) * 1000
            `);
            console.log(`🧹 [Integrity] Limpeza concluída: ${res.rowCount} acessos expirados removidos.`);
        } catch (e) {
            console.warn("⚠️ Falha na limpeza de expirações.");
        }
    }
};