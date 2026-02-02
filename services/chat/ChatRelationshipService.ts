
import { ChannelNormalizer } from './ChannelNormalizer';
import { RelationshipValidator } from './RelationshipValidator';
import { ParticipantResolver } from './ParticipantResolver';

/**
 * ChatRelationshipService
 * 
 * O ponto único de verdade para gerenciar as relações complexas dentro dos chats.
 * Este serviço garante que bloqueios, permissões e nomes estejam sempre corretos.
 */
export const ChatRelationshipService = {
    // Exposição de funcionalidades via delegação
    normalizeId: ChannelNormalizer.normalizePrivateId,
    getChatType: ChannelNormalizer.parseChatType,
    
    validateAccess: RelationshipValidator.canInteract,
    validateGroupPost: RelationshipValidator.canPostInGroup,
    
    getLiveProfile: ParticipantResolver.resolveParticipant,

    /**
     * Helper de alto nível para preparar a abertura de um chat.
     */
    prepareChatSession: (myId: string, targetId: string) => {
        const validation = RelationshipValidator.canInteract(myId, targetId);
        const chatId = ChannelNormalizer.normalizePrivateId(myId, targetId);
        const profile = ParticipantResolver.resolveParticipant(targetId);

        return {
            chatId,
            profile,
            isAllowed: validation.allowed,
            error: validation.reason
        };
    }
};
