
import { GroupRole } from '../../../types';
import { ROLE_WEIGHTS } from '../../../constants/RoleWeights';
import { GROUP_ROLE_LIMITS } from '../../../constants/GroupLimits';

interface Member {
    id: string;
    role: string;
    roleId?: string;
}

/**
 * MemberMetrics
 * Camada de inteligência para calcular a distribuição de cargos e o poder total da comunidade.
 */
export const MemberMetrics = {
    /**
     * Processa a lista de membros baseada nos cargos reais criados no grupo.
     */
    process(members: Member[], roles: GroupRole[]) {
        const ownerCount = members.filter(m => m.role === 'Dono').length || 1;
        
        // Mapeia os cargos customizados e conta os membros em cada um
        const customRoleStats = (roles || []).map(role => ({
            id: role.id,
            name: role.name,
            color: role.color,
            count: members.filter(m => m.roleId === role.id).length
        })).sort((a, b) => b.count - a.count);

        // Membros que não são dono e não possuem roleId atribuído
        const unassignedCount = members.filter(m => 
            m.role !== 'Dono' && (!m.roleId || m.roleId === '')
        ).length;

        // Cálculo de Poder da Comunidade (Baseado em pesos dinâmicos)
        const totalPower = members.reduce((acc, member) => {
            if (member.role === 'Dono') return acc + ROLE_WEIGHTS['Dono'];
            
            // Se tem cargo customizado, peso é baseado na prioridade do cargo
            if (member.roleId) {
                const role = roles.find(r => r.id === member.roleId);
                return acc + (role ? (role.priority * 10) : 10);
            }
            
            return acc + ROLE_WEIGHTS['Membro'];
        }, 0);

        return {
            counts: {
                owner: ownerCount,
                customRoles: customRoleStats,
                unassigned: unassignedCount
            },
            totalPower,
            limits: GROUP_ROLE_LIMITS
        };
    }
};
