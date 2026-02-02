
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { marketplaceService } from '../services/marketplaceService';
import { authService } from '../services/authService';
import { chatService } from '../services/chatService';
import { db } from '@/database';
import { MarketplaceItem, Comment, ChatMessage } from '../types';
import { useModal } from '../components/ModalSystem';

// Modular Components
import { ProductHeader } from '../features/marketplace/components/details/ProductHeader';
import { ProductMediaGallery } from '../features/marketplace/components/details/ProductMediaGallery';
import { ProductInfo } from '../features/marketplace/components/details/ProductInfo';
import { ProductSellerCard } from '../features/marketplace/components/details/ProductSellerCard';
import { ProductDescription } from '../features/marketplace/components/details/ProductDescription';
import { ProductBottomBar } from '../features/marketplace/components/details/ProductBottomBar';
import { ProductLightbox } from '../features/marketplace/components/details/ProductLightbox';
import { CommentSheet } from '../components/ui/comments/CommentSheet';

export const ProductDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showConfirm } = useModal();
  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false);
  
  // Advanced Comment System State
  const [questions, setQuestions] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ id: string, username: string } | null>(null);

  // Zoom State
  const [zoomedMedia, setZoomedMedia] = useState<{ url: string, type: 'image' | 'video' } | null>(null);
  
  const currentUser = authService.getCurrentUser();
  const currentUserId = currentUser?.id;

  const loadData = useCallback(() => {
    if (id) {
        const foundItem = marketplaceService.getItemById(id);
        if (foundItem) {
          setItem(foundItem);
          setQuestions(foundItem.comments || []);
          
          if (currentUser && (currentUser.email === foundItem.sellerId || currentUser.id === foundItem.sellerId)) {
              setIsSeller(true);
          }
        }
      }
      setLoading(false);
  }, [id, currentUser]);

  useEffect(() => {
    loadData();
    const unsub = db.subscribe('marketplace', loadData);
    return () => unsub();
  }, [loadData]);

  const handleChat = (e: React.MouseEvent) => {
      e.stopPropagation(); 
      if (!currentUser || !item) return;
      if (isSeller) return;

      try {
          const chatId = chatService.getPrivateChatId(currentUser.email, item.sellerId);
          const contextMsg: ChatMessage = {
              id: Date.now(),
              text: `Olá! Tenho interesse neste produto.`,
              type: 'sent',
              contentType: 'text',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'sent',
              senderEmail: currentUser.email,
              senderAvatar: currentUser.profile?.photoUrl,
              senderName: currentUser.profile?.name || 'Comprador',
              product: {
                  id: item.id,
                  title: item.title,
                  price: item.price,
                  image: item.image
              }
          };
          chatService.sendMessage(chatId, contextMsg);
          navigate(`/chat/${chatId}`);
      } catch (err) {
          console.error(err);
      }
  };

  const handleSendQuestion = () => {
      if (!commentText.trim() || !item || !currentUser) return;
      
      if (replyingTo) {
          // Lógica de resposta encadeada (Thread)
          const success = marketplaceService.addReply(item.id, replyingTo.id, commentText, currentUser);
          if (success) setReplyingTo(null);
      } else {
          // Pergunta direta (Nível 0)
          marketplaceService.addComment(item.id, commentText, currentUser);
      }
      setCommentText('');
  };

  const handleDeleteQuestion = async (commentId: string) => {
      if (!item) return;
      if (await showConfirm("Excluir pergunta", "Deseja excluir sua pergunta?", "Excluir", "Cancelar")) {
          await marketplaceService.deleteComment(item.id, commentId);
      }
  };

  const handleLikeQuestion = (commentId: string) => {
      if (!item) return;
      marketplaceService.toggleCommentLike(item.id, commentId);
  };

  const handleDelete = async () => {
      const confirmed = await showConfirm(
          "Excluir Anúncio",
          "Tem certeza que deseja excluir este anúncio permanentemente?",
          "Excluir",
          "Cancelar"
      );
      if (confirmed && id) {
          marketplaceService.deleteItem(id);
          navigate('/marketplace');
      }
  };

  const navigateToStore = () => {
      if (!item) return;
      navigate(`/user/${item.sellerName}`, { state: { activeTab: 'products' } });
  };

  const mediaItems = useMemo(() => {
      if (!item) return [];
      const media: { type: 'image' | 'video', url: string }[] = [];
      if (item.video) media.push({ type: 'video', url: item.video });
      if (item.image) media.push({ type: 'image', url: item.image });
      if (item.images) {
          item.images.forEach(img => media.push({ type: 'image', url: img }));
      }
      return media.filter((v, i, a) => a.findIndex(t => t.url === v.url) === i);
  }, [item]);

  if (loading || !item) return <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-white">Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#0c0f14] text-white font-['Inter'] flex flex-col relative pb-[90px]">
      <style>{`
        .product-container { padding: 0; position: relative; z-index: 10; width: 100%; max-width: 600px; margin: 0 auto; }
        .details-wrapper { background: #0c0f14; border-top-left-radius: 20px; border-top-right-radius: 20px; margin-top: -20px; position: relative; z-index: 5; padding: 25px 20px; box-shadow: 0 -10px 30px rgba(0,0,0,0.5); }
        .product-title { font-size: 22px; font-weight: 700; line-height: 1.3; margin-bottom: 10px; color: #fff; }
        .product-price { font-size: 26px; font-weight: 800; color: #00ff82; margin-bottom: 15px; letter-spacing: -0.5px; }
        .badges-row { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
        .badge-item { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 6px 12px; border-radius: 8px; font-size: 12px; color: #ccc; display: flex; align-items: center; gap: 6px; }
        .badge-item i { color: #00c2ff; }
        .seller-card { background: rgba(20,20,25,0.6); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 15px; margin-bottom: 25px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: 0.2s; }
        .seller-left { display: flex; align-items: center; gap: 12px; }
        .seller-avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid #00c2ff; }
        .seller-info h4 { font-size: 15px; font-weight: 700; margin-bottom: 2px; }
        .seller-info p { font-size: 12px; color: #888; }
        .store-icon { color: #00c2ff; opacity: 0.5; }
        .desc-section { margin-bottom: 30px; }
        .section-header { font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .desc-text { color: #ccc; font-size: 15px; line-height: 1.6; white-space: pre-wrap; font-weight: 300; }
        .bottom-bar { position: fixed; bottom: 0; left: 0; width: 100%; background: rgba(12,15,20,0.95); backdrop-filter: blur(10px); padding: 16px 20px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; gap: 12px; align-items: center; z-index: 50; box-shadow: 0 -5px 20px rgba(0,0,0,0.5); }
        .action-btn { flex: 1; padding: 14px; border-radius: 12px; font-weight: 700; font-size: 15px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s; }
        .btn-primary { background: #00c2ff; color: #000; box-shadow: 0 4px 15px rgba(0,194,255,0.3); }
        .btn-secondary { background: rgba(255,255,255,0.1); color: #fff; max-width: 60px; font-size: 20px; }
        .btn-danger { background: rgba(255,77,77,0.1); color: #ff4d4d; border: 1px solid rgba(255,77,77,0.3); }
        .qa-trigger-btn { width: 100%; padding: 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; color: #aaa; text-align: left; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; transition: 0.2s; }
        .qa-trigger-btn:active { transform: scale(0.98); background: rgba(255,255,255,0.08); }
      `}</style>

      <ProductHeader />

      <div className="product-container">
          <ProductMediaGallery 
            mediaItems={mediaItems} 
            onMediaClick={(m) => setZoomedMedia(m)} 
          />

          <div className="details-wrapper">
              <ProductInfo 
                title={item.title}
                price={item.price}
                location={item.location}
                category={item.category}
                timestamp={item.timestamp}
              />

              <ProductSellerCard 
                sellerName={item.sellerName || 'Vendedor'}
                sellerAvatar={item.sellerAvatar}
                onClick={navigateToStore}
              />

              <ProductDescription description={item.description} />

              <button className="qa-trigger-btn" onClick={() => setIsCommentModalOpen(true)}>
                  <span className="font-bold text-sm"><i className="fa-regular fa-comments mr-2 text-[#00c2ff]"></i> Perguntas ({questions.length})</span>
                  <i className="fa-solid fa-chevron-right text-xs"></i>
              </button>
          </div>
      </div>

      <ProductBottomBar 
        isSeller={isSeller}
        onDelete={handleDelete}
        onChat={handleChat}
      />

      <ProductLightbox 
        media={zoomedMedia}
        onClose={() => setZoomedMedia(null)}
      />

      <CommentSheet 
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
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
          placeholder={isSeller ? "Responda a dúvida do cliente..." : "Escreva sua dúvida para o vendedor..."}
      />
    </div>
  );
};
