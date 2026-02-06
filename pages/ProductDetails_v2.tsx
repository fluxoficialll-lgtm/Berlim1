
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { marketplaceService } from '@/services/marketplaceService';
import { authService } from '@/services/authService';
import { chatService } from '@/services/chatService';
import { db } from '@/database';
import { MarketplaceItem, Comment } from '@/types';
import { useModal } from '@/components/ModalSystem';

// Estilos e Componentes Modulares
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

  // State Management
  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false);
  const [questions, setQuestions] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ id: string, username: string } | null>(null);
  const [zoomedMedia, setZoomedMedia] = useState<{ url: string, type: 'image' | 'video' } | null>(null);
  
  const currentUser = authService.getCurrentUser();
  const currentUserId = currentUser?.id;

  // Data Loading
  const loadData = useCallback(() => {
    if (id) {
      const foundItem = marketplaceService.getItemById(id);
      if (foundItem) {
        setItem(foundItem);
        setQuestions(foundItem.comments || []);
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

  useEffect(() => {
    loadData();
    const unsub = db.subscribe('marketplace', loadData);
    return () => unsub();
  }, [loadData]);

  // Event Handlers
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

  const handleReport = () => {
    showAlert("Anúncio Reportado", "Agradecemos sua colaboração. Nossa equipe analisará o anúncio.");
  };

  const handleSendQuestion = () => {
    if (!commentText.trim() || !item || !currentUser) return;
    if (replyingTo) {
      marketplaceService.addReply(item.id, replyingTo.id, commentText, currentUser);
      setReplyingTo(null);
    } else {
      marketplaceService.addComment(item.id, commentText, currentUser);
    }
    setCommentText('');
  };

  const handleDeleteQuestion = (commentId: string) => {
    if (!item) return;
    showConfirm("Excluir pergunta", "Deseja excluir sua pergunta?", "Excluir", "Cancelar")
      .then(ok => ok && marketplaceService.deleteComment(item.id, commentId));
  };

  const handleLikeQuestion = (commentId: string) => {
    if (item) {
      marketplaceService.toggleCommentLike(item.id, commentId);
    }
  };

  const navigateToStore = () => {
    if (item) {
      navigate(`/user/${item.sellerName}`, { state: { activeTab: 'products' } });
    }
  };

  const openComments = () => setIsCommentModalOpen(true);
  const closeComments = () => setIsCommentModalOpen(false);
  const openLightbox = (media: {url: string, type: 'image' | 'video'}) => setZoomedMedia(media);
  const closeLightbox = () => setZoomedMedia(null);

  // Memoized Values
  const mediaItems = useMemo(() => {
    if (!item) return [];
    const media: { type: 'image' | 'video', url: string }[] = [];
    if (item.video) media.push({ type: 'video', url: item.video });
    if (item.image) media.push({ type: 'image', url: item.image });
    if (item.images) item.images.forEach(img => media.push({ type: 'image', url: img }));
    return [...new Map(media.map(m => [m.url, m])).values()];
  }, [item]);

  // Render Logic
  if (loading || !item) {
    return <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-white"><i className="fa-solid fa-circle-notch fa-spin text-2xl"></i></div>;
  }

  return (
    <div className="min-h-screen bg-[#0c0f14] text-white font-['Inter'] flex flex-col relative pb-[90px]">
      <ProductHeader 
        isSeller={isSeller}
        productId={item.id}
        onDelete={handleDelete}
        onReport={handleReport}
      />

      <div className="product-container">
        <ProductMediaGallery 
          mediaItems={mediaItems} 
          onMediaClick={openLightbox}
        />
        <div className="details-wrapper">
          <div className="detail-card product-info-card">
            <ProductInfo 
              title={item.title}
              price={item.price}
              location={item.location}
              category={item.category}
              timestamp={item.timestamp}
            />
          </div>
          <ProductSellerCard sellerName={item.sellerName || 'Vendedor'} sellerAvatar={item.sellerAvatar} onClick={navigateToStore} />
          <div className="detail-card product-description-card">
            <ProductDescription description={item.description} />
          </div>
          <button className="qa-trigger-btn" onClick={openComments}>
            <span className="font-bold text-sm"><i className="fa-regular fa-comments mr-2 text-[#00c2ff]"></i> Perguntas ({questions.length})</span>
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>

      <ProductBottomBar isSeller={isSeller} onDelete={handleDelete} onChat={handleChat} />
      <ProductLightbox media={zoomedMedia} onClose={closeLightbox} />
      <CommentSheet 
        isOpen={isCommentModalOpen} 
        onClose={closeComments} 
        title={`Perguntas (${questions.length})`}
        comments={questions} 
        commentText={commentText} 
        onCommentTextChange={setCommentText}
        onSend={handleSendQuestion} 
        onLike={handleLikeQuestion} 
        onDelete={handleDeleteQuestion} 
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
