import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { reelsService } from '../services/reelsService';
import { postService } from '../services/postService';
import { authService } from '../services/authService';
import { recommendationService } from '../services/recommendationService';
import { db } from '@/database';
import { useModal } from '../components/ModalSystem';
import { Post, Comment } from '../types';

export const useReels = () => {
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

  const loadReels = useCallback(async () => {
    try {
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
    } catch (error) {
        console.error("Failed to load reels, reloading.", error);
        loadReels();
    }
  }, [id, navState?.authorId]);

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
  }, [loadReels]);

  useEffect(() => {
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
        
        if (isCommentModalOpen && activeReelId) {
            const latest = postService.getPostById(activeReelId);
            if (latest && latest.commentsList) {
                setCurrentComments(latest.commentsList);
            }
        }
    });

    return () => {
        unsubscribe();
    };
  }, [isCommentModalOpen, activeReelId]);

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
      if (!container || reels.length === 0) return;
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
    // Instant UI update for better UX
    setReels(prevReels => prevReels.map(r => {
        if (r.id === reelId) {
            const newLiked = !r.liked;
            const newLikes = r.likes + (newLiked ? 1 : -1);
            return { ...r, liked: newLiked, likes: newLikes };
        }
        return r;
    }));
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
  
  const handleCtaClick = (link?: string) => {
    if (link?.startsWith('http')) {
        window.open(link, '_blank'); // Bug Fix: Changed '@blank' to '_blank'
    } else if (link) {
        navigate(link);
    }
  };

  return {
      navigate,
      containerRef,
      reels,
      activeReelIndex,
      expandedReels,
      isCommentModalOpen,
      setIsCommentModalOpen,
      currentComments,
      commentText,
      setCommentText,
      replyingTo,
      setReplyingTo,
      currentUserId,
      toggleReadMore,
      handleLike,
      handleDeleteReel,
      handleCommentClick,
      handleSendComment,
      handleDeleteComment,
      handleCommentLike,
      handleShare,
      reportWatchTime,
      handleCtaClick
  };
};
