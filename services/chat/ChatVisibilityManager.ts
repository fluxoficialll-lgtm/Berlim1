
import { ChatData } from '../../types';

/**
 * ChatVisibilityManager
 * Decide se uma conversa deve ser exibida na UI baseada na política de deleção lógica.
 */
export const ChatVisibilityManager = {
    /**
     * Filtra a lista de conversas para remover as que o usuário marcou como deletadas.
     */
    filterVisible: (chats: ChatData[], currentUserEmail: string | null): ChatData[] => {
        if (!currentUserEmail) return chats;
        const email = currentUserEmail.toLowerCase();

        return chats.filter(chat => {
            // Conversas de grupo geralmente não seguem deletar para todos, mantemos visíveis
            if (!chat.id.toString().includes('@')) return true;

            // Se o e-mail do usuário está na lista de deletados desta conversa, esconde
            const deletedBy = chat.deletedBy || [];
            return !deletedBy.some(e => e.toLowerCase() === email);
        });
    },

    /**
     * Verifica se uma conversa específica é visível.
     */
    isVisible: (chat: ChatData, currentUserEmail: string | null): boolean => {
        if (!currentUserEmail || !chat.id.toString().includes('@')) return true;
        const deletedBy = chat.deletedBy || [];
        return !deletedBy.some(e => e.toLowerCase() === currentUserEmail.toLowerCase());
    }
};
