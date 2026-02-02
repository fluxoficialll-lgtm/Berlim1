
import { UserRepository } from './repositories/UserRepository.js';
import { FinancialRepository } from './repositories/FinancialRepository.js';
import { FeeRepository } from './repositories/financial/FeeRepository.js';
import { GroupRepository } from './repositories/GroupRepository.js';
import { PostRepository } from './repositories/PostRepository.js';
import { ChatRepository } from './repositories/ChatRepository.js';
import { MarketplaceRepository } from './repositories/MarketplaceRepository.js';
import { RelationshipRepository } from './repositories/RelationshipRepository.js';
import { InteractionRepository } from './repositories/InteractionRepository.js';
import { ReportRepository } from './repositories/ReportRepository.js';
import { AuditRepository } from './repositories/AuditRepository.js';
import { AdRepository } from './repositories/AdRepository.js';
import { query } from './pool.js';

/**
 * RepositoryHub
 * Centraliza a exportação de todos os repositórios do sistema.
 */
export const RepositoryHub = {
    users: UserRepository,
    groups: GroupRepository,
    posts: PostRepository,
    chats: ChatRepository,
    marketplace: MarketplaceRepository,
    relationships: RelationshipRepository,
    interactions: InteractionRepository,
    reports: ReportRepository,
    financial: FinancialRepository,
    fees: FeeRepository,
    audit: AuditRepository,
    ads: AdRepository,
    query: query,

    // Métodos administrativos legados ou utilitários globais
    admin: {
        async getFinancialStats() {
            const res = await query(`
                SELECT 
                    SUM((data->>'platformProfit')::numeric) as total_profit,
                    SUM(amount) as total_seller_payouts,
                    COUNT(*) as total_sales
                FROM financial_transactions 
                WHERE type = 'sale' AND status = 'paid'
            `);
            return res.rows[0] || { total_profit: 0, total_seller_payouts: 0, total_sales: 0 };
        },
        async recordIp(userId, ip, ua) { /* Implementação futura */ }
    }
};
