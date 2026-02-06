
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { marketplaceService } from '@/services/marketplaceService';
import { authService } from '@/services/authService';
import { chatService } from '@/services/chatService';
import { MarketplaceItem } from '@/types';
import { useModal } from '@/components/ModalSystem';
import { useMarketplaceComments } from '@/hooks/useMarketplaceComments';

// Componentes Modulares
import '@/features/marketplace/components/details/ProductDetails.css';
import { ProductHeader } from '@/features/marketplace/components/details/ProductHeader';
import { ProductMediaGallery } from '@/features/marketplace/components/details/ProductMediaGallery';
import { ProductInfo } from '@/features/marketplace/components/details/ProductInfo';
import { ProductSellerCard } from '@/features/marketplace/components/details/ProductSellerCard';
import { ProductDescription } from '@/features/marketplace/components/details/ProductDescription';
import { ProductBottomBar } from '@/features/marketplace/components/details/ProductBottomBar';
import { ProductLightbox } from '@/features/marketplace/components/details/ProductLightbox';
import { CommentSheet } from '@/components/ui/comments/CommentSheet';

export const ProductDetailsV2: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showConfirm, showAlert } = useModal();

  // State do produto
  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false);
  const [zoomedMedia, setZoomedMedia] = useState<{ url: string, type: 'image' | 'video' } | null>(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  
  const currentUser = authService.getCurrentUser();
  const currentUserId = currentUser?.id;

  // Hook de comentários refatorado
  const { comments, loading: loadingComments, addComment, deleteComment } = useMarketplaceComments(id || '');
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string, username: string } | null>(null);

  useEffect(() => {
    if (id) {
      const foundItem = marketplaceService.getItemById(id);
      if (foundItem) {
        setItem(foundItem);
        if (currentUser && (currentUser.email === foundItem.sellerId || currentUser.id === foundItem.sellerId)) {
          setIsSeller(true);
        }
      } else {
        showAlert("Erro", "Produto não encontrado.");
        navigate('/marketplace');
      }
    }
    setLoading(false);
  }, [id, currentUser, navigate, showAlert]);

  const handleChat = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser || !item || isSeller) return;
    try {
      const chatId = await chatService.startChatWithProductContext(item.sellerId, item.id);
      navigate(`/chat/${chatId}`);
    } catch (err) {
      console.error(err);
      showAlert("Erro", "Não foi possível iniciar a conversa. Tente novamente.");
    }
  };

  const handleDelete = () => {
    showConfirm("Excluir Anúncio", "Tem certeza que deseja excluir permanentemente?", "Excluir", "Cancelar")
      .then(confirmed => {
        if (confirmed && id) {
          marketplaceService.deleteItem(id);
          navigate('/marketplace', { replace: true });
        }
      });
  };
  
  const handleSendQuestion = async () => {
      if (!commentText.trim() || !item || !currentUser) return;
  
      // A lógica de resposta ainda precisa ser migrada para o hook/serviço
      if (replyingTo) {
        console.log("Respondendo a", replyingTo);
        // Aqui viria a chamada ao serviço para adicionar uma resposta
        // Por enquanto, vamos limpar o estado
        setReplyingTo(null);
        setCommentText('');
      } else {
        await addComment(commentText);
        setCommentText('');
      }
  };

  const handleLikeQuestion = (commentId: string) => {
    if (item) marketplaceService.toggleCommentLike(item.id, commentId);
  };

  const navigateToStore = () => {
    if (item) navigate(`/user/${item.sellerName}`, { state: { activeTab: 'products' } });
  };

  const mediaItems = useMemo(() => {
    if (!item) return [];
    return [{ type: 'video', url: item.video }, { type: 'image', url: item.image }, ...item.images?.map(i => ({ type: 'image', url: i })) || []].filter(m => m.url);
  }, [item]);

  if (loading || !item) return <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-white"><i className="fa-solid fa-circle-notch fa-spin text-2xl"></i></div>;

  return (
    <div className="min-h-screen bg-[#0c0f14] text-white font-['Inter'] flex flex-col relative pb-[90px]">
      <ProductHeader isSeller={isSeller} productId={item.id} onDelete={handleDelete} onReport={() => showAlert("Reportado", "Obrigado!")}/>
      <div className="product-container">
        <ProductMediaGallery mediaItems={mediaItems} onMediaClick={(media) => setZoomedMedia(media)}/>
        <div className="details-wrapper">
          <ProductInfo title={item.title} price={item.price} location={item.location} category={item.category} timestamp={item.timestamp}/>
          <ProductSellerCard sellerName={item.sellerName || 'Vendedor'} sellerAvatar={item.sellerAvatar} onClick={navigateToStore} />
          <ProductDescription description={item.description} />
          <button className="qa-trigger-btn" onClick={() => setIsCommentModalOpen(true)}>
            <span className="font-bold text-sm"><i className="fa-regular fa-comments mr-2 text-[#00c2ff]"></i> Perguntas ({comments.length})</span>
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>
      <ProductBottomBar isSeller={isSeller} onDelete={handleDelete} onChat={handleChat} />
      <ProductLightbox media={zoomedMedia} onClose={() => setZoomedMedia(null)} />
      <CommentSheet 
        isOpen={isCommentModalOpen} 
        onClose={() => setIsCommentModalOpen(false)} 
        title={`Perguntas (${comments.length})`}
        comments={comments} 
        loading={loadingComments}
        commentText={commentText} 
        onCommentTextChange={setCommentText}
        onSend={handleSendQuestion} 
        onLike={handleLikeQuestion} 
        onDelete={deleteComment} 
        onUserClick={(u) => navigate(`/user/${u.replace('@', '')}`)} 
        currentUserId={currentUserId} 
        replyingTo={replyingTo} 
        onCancelReply={() => setReplyingTo(null)}
        onReplyClick={(cid, user) => setReplyingTo({ id: cid, username: user })} 
        placeholder={isSeller ? "Responda a dúvida..." : "Escreva sua dúvida..."}
      />
    </div>
  );
};
