/**
 * Garante a unicidade de IDs para conversas 1v1.
 */
export const ChannelNormalizer = {
    /**
     * Gera um ID estável baseado nos emails/IDs dos participantes.
     * Ex: ['b@b.com', 'a@a.com'] sempre resultará em 'a@a.com_b@b.com'
     */
    normalizePrivateId: (id1: string, id2: string): string => {
        if (!id1 || !id2) return 'invalid_channel';
        const clean1 = String(id1).toLowerCase().trim();
        const clean2 = String(id2).toLowerCase().trim();
        return [clean1, clean2].sort().join('_');
    },

    /**
     * Identifica se um ID de chat é privado ou de grupo.
     */
    parseChatType: (chatId: string): 'private' | 'group' => {
        if (!chatId) return 'group';
        return String(chatId).includes('@') ? 'private' : 'group';
    }
};