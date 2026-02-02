import { db } from '../../database';
import { User } from '../../types';

export const ParticipantResolver = {
    /**
     * Resolve as informações mais atuais de um participante.
     * Evita usar dados salvos estaticamente dentro do JSON da mensagem.
     */
    resolveParticipant: (userIdOrEmail: string): Partial<User> => {
        if (!userIdOrEmail) return { profile: { name: 'Usuário', isPrivate: false } };
        
        const allUsers = db.users.getAll();
        const searchId = String(userIdOrEmail);
        
        // Busca por Email ou por ID (UUID)
        const user = Object.values(allUsers).find(u => 
            u.id === searchId || u.email === searchId
        );

        if (user) {
            return {
                id: user.id,
                email: user.email,
                profile: {
                    name: user.profile?.name || 'User',
                    nickname: user.profile?.nickname || user.profile?.name || 'User',
                    photoUrl: user.profile?.photoUrl,
                    isPrivate: user.profile?.isPrivate || false
                }
            };
        }

        // Fallback para quando o usuário não está no cache
        const fallbackName = searchId.includes('@') ? searchId.split('@')[0] : 'Usuário';
        return {
            profile: {
                name: fallbackName,
                isPrivate: false
            }
        };
    }
};