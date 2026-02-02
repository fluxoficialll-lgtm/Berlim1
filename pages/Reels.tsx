import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { reelsService } from '../services/reelsService';
import { postService } from '../services/postService';
import { authService } from '../services/authService';
import { recommendationService } from '../services/recommendationService';
import { db } from '@/database';
import { useModal } from '../components/ModalSystem';
import { Post, Comment } from '../types';

import { ReelItem } from '../features/reels/components/ReelItem';
import { CommentSheet } from '../components/ui/comments/CommentSheet';

export const Reels: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navState = location.state as { authorId?: string } | null;
  const { showConfirm } = useModal();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [reels, setReels] = useState<Post[]>([]);
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [expandedReels, setExpandedReels] = useState<Set<string>>(new Set());

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [activeReelId, setActiveReelId] = useState<string | null>(null);
  const [currentComments, setCurrentComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  
  const [replyingTo, setReplyingTo] = useState<{ id: string, username: string } | null>(null);

  const viewedReels = useRef<Set<string>>(new Set());
  const startTimeRef = useRef<number>(0); 
  const currentUser = authService.getCurrentUser();
  const currentUserId = currentUser?.id;

  const loadReels = async () => {
      const userEmail = authService.getCurrentUserEmail();
      const allowAdult = localStorage.getItem('settings_18_plus') === 'true';
      let videoPosts: Post[] = [];

      if (navState?.authorId) {
          videoPosts = reelsService.getReelsByAuthor(navState.authorId, allowAdult);
      } else {
          videoPosts = reelsService.getReels(userEmail || undefined, allowAdult);
          if (id && !videoPosts.find(r => r.id === id)) {
              const specificReel = postService.getPostById(id);
              if (specificReel && specificReel.type === 'video') {
                  videoPosts = [specificReel, ...videoPosts];
              }
          }
      }
      setReels(videoPosts);
  };

  // Add: Missing toggleReadMore function for ReelItem expansion
  const toggleReadMore = (reelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedReels(prev => {
        const next = new Set(prev);
        if (next.has(reelId)) next.delete(reelId);
        else next.add(reelId);
        return next;
    });
  };

  useEffect(() => {
    reelsService.fetchReels(); 
    loadReels();

    const unsubscribe = db.subscribe('posts', () => {
        setReels(currentReels => {
            let changed = false;
            const nextReels = currentReels.map(r => {
                const latest = db.posts.findById(r.id);
                if (latest && (latest.likes !== r.likes || latest.comments !== r.comments || latest.views !== r.views || latest.liked !== r.liked)) {
                    changed = true;
                    return { ...r, ...latest };
                }
                return r;
            });
            return changed ? nextReels : currentReels;
        });
        
        // Atualiza comentários se o modal estiver aberto
        if (isCommentModalOpen && activeReelId) {
            const latest = postService.getPostById(activeReelId);
            if (latest && latest.commentsList) {
                setCurrentComments(latest.commentsList);
            }
        }
    });

    return () => unsubscribe();
  }, [id, navState, isCommentModalOpen, activeReelId]);

  useEffect(() => {
    if (id && reels.length > 0) {
        const index = reels.findIndex(r => r.id === id);
        if (index !== -1) {
            setTimeout(() => {
                const element = containerRef.current?.querySelector(`[data-index="${index}"]`);
                if (element) {
                    element.scrollIntoView({ behavior: 'auto' });
                    setActiveReelIndex(index);
                }
            }, 100);
        }
    }
  }, [id, reels]);

  const reportWatchTime = (reelId: string) => {
      const userEmail = authService.getCurrentUserEmail();
      if (!reelId || !startTimeRef.current || !userEmail) return;
      const duration = (Date.now() - startTimeRef.current) / 1000; 
      const reel = reels.find(r => r.id === reelId);
      if (reel) {
          recommendationService.recordInteraction(userEmail, reel, 'view_time', duration);
      }
      startTimeRef.current = Date.now();
  };

  useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  const index = Number(entry.target.getAttribute('data-index'));
                  setActiveReelIndex(index);
                  const reel = reels[index];
                  if (reel && !viewedReels.current.has(reel.id)) {
                      viewedReels.current.add(reel.id);
                      reelsService.incrementView(reel.id);
                  }
                  startTimeRef.current = Date.now();
              }
          });
      }, { threshold: 0.6 });
      const elements = container.querySelectorAll('.reel-container-wrapper');
      elements.forEach(el => observer.observe(el));
      return () => observer.disconnect();
  }, [reels]);

  const handleLike = async (reelId: string) => {
    await reelsService.toggleLike(reelId);
  };

  const handleDeleteReel = async (reelId: string) => {
      const confirmed = await showConfirm("Excluir Reel", "Tem certeza que deseja excluir este reel? A ação não pode ser desfeita.", "Excluir", "Cancelar");
      if (confirmed) {
          await postService.deletePost(reelId);
          setReels(prev => prev.filter(r => r.id !== reelId));
      }
  };

  const handleCommentClick = (reelId: string) => {
    const post = postService.getPostById(reelId);
    if (post) {
        setActiveReelId(reelId);
        setCurrentComments(post.commentsList || []);
        setIsCommentModalOpen(true);
    }
  };

  const handleSendComment = async () => {
      if (!activeReelId || !commentText.trim()) return;
      const u = authService.getCurrentUser();
      if (!u) return;

      const username = u.profile?.name || 'user';
      const userAvatar = u.profile?.photoUrl;

      if (replyingTo) {
          const success = postService.addReply(activeReelId, replyingTo.id, commentText.trim(), username, userAvatar);
          if (success) setReplyingTo(null);
      } else {
          await postService.addComment(activeReelId, commentText.trim(), username, userAvatar);
          if (u.email) {
              const post = reels.find(r => r.id === activeReelId);
              if (post) recommendationService.recordInteraction(u.email, post, 'comment');
          }
      }
      setCommentText('');
      // O DB subscribe atualizará a lista
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!activeReelId) return;
    if (await showConfirm("Excluir comentário", "Deseja excluir este comentário?", "Excluir", "Cancelar")) {
        await postService.deleteComment(activeReelId, commentId);
    }
  };

  const handleCommentLike = (commentId: string) => {
      if (!activeReelId) return;
      postService.toggleCommentLike(activeReelId, commentId);
  };

  const handleShare = async (reel: Post) => {
      const url = `${window.location.origin}/#/post/${reel.id}`;
      if (navigator.share) {
          try { 
              await navigator.share({ title: 'Confira este Reel!', url: url }); 
              postService.incrementShare(reel.id); 
          } catch (err) {}
      } else {
          navigator.clipboard.writeText(url); 
          alert("Link copiado!"); 
          postService.incrementShare(reel.id);
      }
  };

  return (
    <div className="reels-page">
      <style>{`
        .reels-page { position: relative; background: #000; height: 100dvh; width: 100%; overflow: hidden; font-family: 'Inter', sans-serif; color: white; overscroll-behavior: none; }
        .view-buttons-container { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 20; display: flex; gap: 15px; background: rgba(0, 0, 0, 0.3); backdrop-filter: blur(10px); padding: 5px 15px; border-radius: 20px; }
        .view-btn { background: none; border: none; color: rgba(255, 255, 255, 0.6); font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.3s; }
        .view-btn.active { color: #fff; text-shadow: 0 0 10px rgba(255, 255, 255, 0.5); border-bottom: 2px solid #fff; }
        #searchIcon { position: fixed; top: 25px; right: 20px; z-index: 20; font-size: 22px; cursor: pointer; filter: drop-shadow(0 0 5px rgba(0,0,0,0.5)); }
        #reelsContent { height: 100%; width: 100%; overflow-y: scroll; scroll-snap-type: y mandatory; scroll-behavior: smooth; overscroll-behavior: none; }
        #reelsContent::-webkit-scrollbar { display: none; }
        .reel-container-wrapper { height: 100%; width: 100%; scroll-snap-align: start; scroll-snap-stop: always; position: relative; }
        .reel { width: 100%; height: 100%; position: relative; background: #111; display: flex; justify-content: center; align-items: center; }
        .reel-actions { position: absolute; right: 15px; bottom: 120px; display: flex; flex-direction: column; gap: 20px; z-index: 10; align-items: center; }
        .reel-actions button { background: none; border: none; color: #fff; display: flex; flex-direction: column; align-items: center; gap: 5px; font-size: 28px; cursor: pointer; text-shadow: 0 2px 5px rgba(0,0,0,0.5); }
        .reel-actions span { font-size: 12px; font-weight: 600; }
        .liked-heart { color: #ff4d4d; animation: pop 0.3s ease; }
        .reel-desc-overlay { position: absolute; bottom: 0; left: 0; width: 100%; padding: 20px; padding-bottom: 40px; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); display: flex; flex-direction: column; gap: 8px; z-index: 5; pointer-events: none; }
        .reel-desc-overlay > * { pointer-events: auto; }
        .reel-username { font-weight: 700; font-size: 16px; display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .adult-badge { background: #ff4d4d; font-size: 10px; padding: 2px 6px; border-radius: 4px; }
        .sponsored-badge { background: rgba(255,255,255,0.2); font-size: 10px; padding: 2px 6px; border-radius: 4px; }
        .reel-title { font-size: 14px; line-height: 1.4; max-width: 85%; }
        .reel-read-more { color: #aaa; font-weight: 600; cursor: pointer; margin-left: 5px; }
        .reel-group-btn { display: flex; align-items: center; gap: 8px; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; color: #fff; width: fit-content; cursor: pointer; margin-bottom: 5px; transition: all 0.2s; }
        .reel-group-btn:hover { transform: scale(1.05); }
        .video-error { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: #aaa; }
        .retry-btn { margin-top: 10px; padding: 8px 16px; background: #333; border: 1px solid #555; color: #fff; border-radius: 8px; cursor: pointer; }
        @keyframes pop { 0% { transform: scale(1); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }
      `}</style>
      
      <div className="view-buttons-container">
          <button className="view-btn" onClick={() => navigate('/feed')}>Feed</button>
          <button className="view-btn active">Reels</button>
      </div>

      <div id="searchIcon" onClick={() => navigate('/reels-search')}>
        <i className="fa-solid fa-magnifying-glass"></i>
      </div>

      <div id="reelsContent" ref={containerRef}>
        {reels.length === 0 ? (
            <div className="flex items-center justify-center h-full flex-col gap-4">
                <i className="fa-solid fa-video-slash text-4xl text-gray-600"></i>
                <p className="text-gray-500">Nenhum Reel disponível.</p>
                <button onClick={() => navigate('/create-reel')} className="px-4 py-2 bg-[#00c2ff] text-black rounded-lg font-bold shadow-[0_4px_10px_rgba(0,194,255,0.3)]">Criar Reel Agora</button>
            </div>
        ) : (
            reels.map((reel, index) => (
                <div key={reel.id} className="reel-container-wrapper" data-index={index}>
                    <ReelItem 
                        reel={reel}
                        isActive={index === activeReelIndex}
                        onLike={() => handleLike(reel.id)}
                        onComment={() => handleCommentClick(reel.id)}
                        onShare={() => handleShare(reel)}
                        onDelete={() => handleDeleteReel(reel.id)}
                        isOwner={reel.authorId === authService.getCurrentUserId()}
                        onUserClick={() => navigate(`/user/${reel.username.replace('@', '')}`)}
                        getDisplayName={(u) => authService.getUserByHandle(u)?.profile?.nickname || u}
                        getUserAvatar={(u) => authService.getUserByHandle(u)?.profile?.photoUrl}
                        isExpanded={expandedReels.has(reel.id)}
                        onToggleExpand={(e) => toggleReadMore(reel.id, e)}
                        reportWatchTime={reportWatchTime}
                        onCtaClick={(l) => l?.startsWith('http') ? window.open(l, '@blank') : navigate(l || '')}
                        onGroupClick={(gid, g) => navigate(g.isVip ? `/vip-group-sales/${gid}` : `/group-landing/${gid}`)}
                    />
                </div>
            ))
        )}
      </div>

      <CommentSheet 
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          title={`Comentários (${currentComments.length})`}
          comments={currentComments}
          commentText={commentText}
          onCommentTextChange={setCommentText}
          onSend={handleSendComment}
          onLike={handleCommentLike}
          onDelete={handleDeleteComment}
          onUserClick={(u) => navigate(`/user/${u.replace('@', '')}`)}
          currentUserId={currentUserId}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
          onReplyClick={(cid, user) => setReplyingTo({ id: cid, username: user })}
      />
    </div>
  );
};