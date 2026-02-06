
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postService } from '../services/postService';
import { Post } from '../types';
import { FeedItem } from '../components/feed/FeedItem';
import { FeedComments } from '../components/feed/FeedComments';
import { authService } from '../services/authService';

export const PostDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const currentUserId = authService.getCurrentUserId();

  useEffect(() => {
    if (id) {
      const foundPost = postService.getPostById(id);
      if (foundPost) {
        setPost(foundPost);
      } else {
        navigate('/feed');
      }
    }
  }, [id, navigate]);

  const handleLike = (postId: string) => {
    postService.toggleLike(postId).then(updatedPost => {
        if(updatedPost) setPost(updatedPost);
    });
  };

  const handleShare = async (p: Post) => {
      const url = `${window.location.origin}/#/post/${p.id}`;
      if (navigator.share) await navigator.share({ url });
      else { navigator.clipboard.writeText(url); alert('Link copiado!'); }
  };
  
  const handleVote = (postId: string, index: number) => {
    if (post && post.id === postId && post.votedOptionIndex === null) {
      const updatedPost = postService.voteOnPoll(postId, index);
      setPost(updatedPost);
    }
  };

  const handleCtaClick = (link?: string) => {
      if (link?.startsWith('http')) {
          window.open(link, '_blank');
      } else if (link) {
          navigate(link);
      }
  };

  if (!post) return <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-white">Carregando...</div>;

  return (
    <div className="min-h-[100dvh] flex flex-col font-['Inter'] overflow-hidden bg-[#0c0f14] text-white">
      <header className="flex items-center justify-between p-4 bg-[#0c0f14] fixed w-full top-0 z-50 border-b border-white/10 h-[65px]">
        <button onClick={() => navigate(-1)} className="text-[#00c2ff] text-xl p-2 hover:bg-white/5 rounded-full transition-all">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <span className="text-xs font-black uppercase tracking-[2px]">Publicação</span>
        <div className="w-10"></div>
      </header>

      <main className="pt-[75px] pb-[130px] w-full max-w-[500px] mx-auto flex-grow overflow-y-auto no-scrollbar px-3">
        <FeedItem 
          post={post} 
          currentUserId={currentUserId}
          onLike={handleLike} 
          onDelete={() => {}} // A exclusão é tratada no feed
          onUserClick={(u) => navigate(`/user/${u.replace('@','')}`)} 
          onCommentClick={() => {}} 
          onShare={handleShare} 
          onVote={handleVote}
          onCtaClick={handleCtaClick}
        />
        {id && <FeedComments postId={id} />}
      </main>
    </div>
  );
};
