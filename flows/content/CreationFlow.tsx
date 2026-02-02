
import { useNavigate } from 'react-router-dom';
import { Post, MarketplaceItem } from '../../types';

/**
 * Flow: Creation
 * Gerencia para onde o usuário deve ser enviado após publicar algo.
 */
export const useCreationFlow = () => {
    const navigate = useNavigate();

    const handlePostSuccess = (post: Post) => {
        // Se o post foi feito dentro de uma comunidade
        if (post.relatedGroupId) {
            navigate(`/group-chat/${post.relatedGroupId}`, { replace: true });
            return;
        }

        // Se for um Reel
        if (post.type === 'video') {
            navigate('/reels', { replace: true, state: { authorId: post.authorId } });
            return;
        }

        // Fluxo padrão: Feed Orgânico
        navigate('/feed', { replace: true });
    };

    const handleMarketplaceSuccess = (item: MarketplaceItem) => {
        // Após criar um produto, o destino ideal é a "Minha Loja" para gestão
        navigate('/my-store', { replace: true });
    };

    return { handlePostSuccess, handleMarketplaceSuccess };
};
