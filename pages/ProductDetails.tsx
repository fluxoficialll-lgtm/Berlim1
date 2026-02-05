
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { marketplaceService } from '../services/marketplaceService';
import { authService } from '../services/authService';
import { chatService } from '../services/chatService';
import { db } from '@/database';
import { MarketplaceItem, Comment, ChatMessage } from '../types';
import { useModal } from '../components/ModalSystem';

// Componentes Modulares
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
  const { showConfirm, showAlert } = useModal();
  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false);
  
  // State para o novo menu de opções
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  // State do sistema de comentários
  const [questions, setQuestions] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ id: string, username: string } | null>(null);

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

  // Efeito para fechar o menu de opções ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Fechar se o clique não for no botão do menu ou dentro do próprio menu
      if (isOptionsOpen && !(event.target as HTMLElement).closest('.header-btn, .options-menu')) {
        setIsOptionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOptionsOpen]);

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

  const handleDelete = async () => {
    setIsOptionsOpen(false);
    const confirmed = await showConfirm("Excluir Anúncio", "Tem certeza que deseja excluir permanentemente?", "Excluir", "Cancelar");
    if (confirmed && id) {
      marketplaceService.deleteItem(id);
      navigate('/marketplace', { replace: true });
    }
  };

  const handleReport = () => {
    setIsOptionsOpen(false);
    showAlert("Anúncio Reportado", "Agradecemos sua colaboração. Nossa equipe analisará o anúncio.");
  };

  // Demais handlers (comentários, navegação, etc.)...
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
  const navigateToStore = () => item && navigate(`/user/${item.sellerName}`, { state: { activeTab: 'products' } });
  const mediaItems = useMemo(() => {
      if (!item) return [];
      const media: { type: 'image' | 'video', url: string }[] = [];
      if (item.video) media.push({ type: 'video', url: item.video });
      if (item.image) media.push({ type: 'image', url: item.image });
      if (item.images) item.images.forEach(img => media.push({ type: 'image', url: img }));
      return [...new Map(media.map(m => [m.url, m])).values()];
  }, [item]);

  if (loading || !item) return <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-white"><i className="fa-solid fa-circle-notch fa-spin text-2xl"></i></div>;

  return (
    <div className="min-h-screen bg-[#0c0f14] text-white font-['Inter'] flex flex-col relative pb-[90px]">
      <style>{`
        .product-container { padding: 0; position: relative; z-index: 1; width: 100%; max-width: 600px; margin: 0 auto; }
        .details-wrapper { background: #0c0f14; border-top-left-radius: 20px; border-top-right-radius: 20px; margin-top: -20px; position: relative; z-index: 5; padding: 25px 20px; box-shadow: 0 -10px 30px rgba(0,0,0,0.5); }
        
        /* Novo Cabeçalho Flutuante */
        .floating-header { position: absolute; top: 0; left: 0; right: 0; display: flex; justify-content: space-between; padding: 16px; z-index: 20; background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent); }
        .header-btn { width: 44px; height: 44px; border-radius: 50%; background: rgba(0,0,0,0.3); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1); color: white; display: flex; align-items: center; justify-content: center; font-size: 18px; cursor: pointer; transition: background-color 0.2s; }
        .header-btn:hover { background: rgba(0,0,0,0.5); }

        /* Novo Menu de Opções */
        .options-menu { position: absolute; top: 70px; right: 16px; background: #1c1f24; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 4px 20px rgba(0,0,0,0.4); z-index: 30; overflow: hidden; animation: fadeIn 0.2s ease-out; }
        .options-menu-item { display: flex; align-items: center; gap: 10px; padding: 12px 20px; background: none; border: none; color: #E0E0E0; text-align: left; font-size: 14px; cursor: pointer; width: 100%; transition: background-color 0.2s; }
        .options-menu-item:not(:last-child) { border-bottom: 1px solid rgba(255,255,255,0.05); }
        .options-menu-item:hover { background: rgba(255,255,255,0.05); }
        .options-menu-item.danger { color: #ff4d4d; }
        .options-menu-item i { font-size: 14px; width: 20px; text-align: center; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

        /* Estilos existentes... */
        .seller-card { background: rgba(20,20,25,0.6); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 15px; margin-bottom: 25px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: 0.2s; }
        .qa-trigger-btn { width: 100%; padding: 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; color: #aaa; text-align: left; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; transition: 0.2s; }
      `}</style>

      {/* -- NOVO CABEÇALHO -- */}
      <header className="floating-header">
          <button onClick={() => navigate(-1)} className="header-btn" aria-label="Voltar">
              <i className="fa-solid fa-arrow-left"></i>
          </button>
          <button onClick={(e) => { e.stopPropagation(); setIsOptionsOpen(!isOptionsOpen); }} className="header-btn" aria-label="Mais opções">
              <i className="fa-solid fa-ellipsis-vertical"></i>
          </button>
      </header>

      {isOptionsOpen && (
          <div className="options-menu">
              {isSeller ? (
                  <>
                      <button onClick={() => { setIsOptionsOpen(false); navigate(`/marketplace/edit/${id}`); }} className="options-menu-item">
                          <i className="fa-solid fa-pencil"></i> Editar Anúncio
                      </button>
                      <button onClick={handleDelete} className="options-menu-item danger">
                          <i className="fa-solid fa-trash-can"></i> Excluir
                      </button>
                  </>
              ) : (
                  <button onClick={handleReport} className="options-menu-item">
                      <i className="fa-solid fa-flag"></i> Reportar
                  </button>
              )}
          </div>
      )}

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
              <ProductSellerCard sellerName={item.sellerName || 'Vendedor'} sellerAvatar={item.sellerAvatar} onClick={navigateToStore} />
              <ProductDescription description={item.description} />
              <button className="qa-trigger-btn" onClick={() => setIsCommentModalOpen(true)}>
                  <span className="font-bold text-sm"><i className="fa-regular fa-comments mr-2 text-[#00c2ff]"></i> Perguntas ({questions.length})</span>
                  <i className="fa-solid fa-chevron-right text-xs"></i>
              </button>
          </div>
      </div>

      <ProductBottomBar isSeller={isSeller} onDelete={handleDelete} onChat={handleChat} />
      <ProductLightbox media={zoomedMedia} onClose={() => setZoomedMedia(null)} />
      <CommentSheet 
        isOpen={isCommentModalOpen} 
        onClose={() => setIsCommentModalOpen(false)} 
        title={`Perguntas (${questions.length})`} 
        comments={questions} 
        commentText={commentText} 
        onCommentTextChange={setCommentText} 
        onSend={handleSendQuestion} 
        onLike={(cid) => item && marketplaceService.toggleCommentLike(item.id, cid)} 
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
