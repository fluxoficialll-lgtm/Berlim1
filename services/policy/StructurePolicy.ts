
import { Group } from '../../types';

/**
 * StructurePolicy
 * Impede que um grupo tenha canais ativos e modo plataforma simultaneamente,
 * o que causaria confusão na navegação do usuário.
 */
export const StructurePolicy = {
    /**
     * Valida e limpa a estrutura do grupo antes da persistência.
     */
    applyExclusivity: (group: Group): Group => {
        if (group.isSalesPlatformEnabled) {
            // Se a plataforma está ativa, removemos canais e seções para manter a UI limpa
            return {
                ...group,
                channels: [],
                channelSections: []
            };
        }
        return group;
    },

    /**
     * Verifica qual a rota de entrada prioritária.
     */
    getEntryPath: (group: Group): string => {
        if (group.isSalesPlatformEnabled) return `/group-platform/${group.id}`;
        if (group.channels && group.channels.length > 0) return `/group/${group.id}/channels`;
        return `/group-chat/${group.id}`;
    }
};
