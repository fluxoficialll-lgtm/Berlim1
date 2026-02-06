
import { db } from '@/database';
import { Comment } from '@/types';
import { authService } from '@/services/authService';
import { v4 as uuidv4 } from 'uuid';

// Simulação de uma API de busca
const fetchCommentsFromApi = async (itemId: string): Promise<Comment[]> => {
    console.log(`Buscando comentários para o item ${itemId}...`);
    // Simula uma pequena demora na resposta da API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filtra os comentários da base de dados "local" (simulada)
    const allComments: Comment[] = await db.table('comments').toArray();
    return allComments.filter(c => c.itemId === itemId);
};

// Simulação de uma API de adição
const addCommentToApi = async (itemId: string, text: string): Promise<Comment> => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) throw new Error("Usuário não autenticado");

    console.log(`Adicionando comentário ao item ${itemId}...`);
    await new Promise(resolve => setTimeout(resolve, 300));

    const newComment: Comment = {
        id: uuidv4(),
        itemId,
        text,
        username: currentUser.username || "Usuário Anônimo",
        avatar: currentUser.avatar,
        timestamp: Date.now(),
        likes: 0,
        replies: [],
    };

    await db.table('comments').add(newComment);
    return newComment;
};

// Simulação de uma API de exclusão
const deleteCommentFromApi = async (commentId: string): Promise<void> => {
    console.log(`Deletando comentário ${commentId}...`);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const comment = await db.table('comments').get(commentId);
    if (comment) {
        // Adicionar verificação de permissão aqui, se necessário
        await db.table('comments').delete(commentId);
    } else {
        throw new Error("Comentário não encontrado");
    }
};

export const MarketplaceCommentService = {
    getComments: fetchCommentsFromApi,
    addComment: addCommentToApi,
    deleteComment: deleteCommentFromApi,
};