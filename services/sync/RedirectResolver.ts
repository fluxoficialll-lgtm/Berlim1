
import { Group } from '../../types';

/**
 * RedirectResolver
 * Implementa a lógica de decisão de interface:
 * Se HUB (Sales Platform) ligado -> /group-platform/:id
 * Se HUB desligado -> /group-chat/:id (ou /group/:id/channels se houver múltiplos canais)
 */
export const RedirectResolver = {
    resolveGroupEntryPath: (group: Group): string => {
        if (!group) return '/groups';

        // 1. Prioridade: Modo Hub (Plataforma de Vendas/Pastas)
        if (group.isSalesPlatformEnabled) {
            return `/group-platform/${group.id}`;
        }

        // 2. Secundário: Canais Complexos
        const hasMultipleChannels = group.channels && group.channels.length > 0;
        if (hasMultipleChannels) {
            return `/group/${group.id}/channels`;
        }

        // 3. Fallback: Chat Direto (Geral)
        return `/group-chat/${group.id}`;
    }
};
