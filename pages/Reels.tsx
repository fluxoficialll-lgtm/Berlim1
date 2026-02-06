
import React, { useState } from 'react';
import { useReels } from '../hooks/useReels';
import { ReelItem } from '../features/reels/components/ReelItem';
import { ReelComments } from '../features/reels/components/ReelComments';
import { authService } from '../services/authService';
import ReelsErrorBoundary from '../features/reels/components/ReelsErrorBoundary';
import { Post } from '../types';

export const Reels: React.FC = () => {
  const {
    navigate,
    containerRef,
    reels,
    activeReelIndex,
    expandedReels,
    toggleReadMore,
    handleLike,
    handleDeleteReel,
    handleShare,
    reportWatchTime,
    handleCtaClick
  } = useReels();
  
  const [activeReel, setActiveReel] = useState<Post | null>(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const handleCommentClick = (reelId: string) => {
      const reel = reels.find(r => r.id === reelId);
      if (reel) {
          setActiveReel(reel);
          setIsCommentModalOpen(true);
      }
  }

  return (
    <ReelsErrorBoundary>
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
                        onCtaClick={handleCtaClick}
                        onGroupClick={(gid, g) => navigate(g.isVip ? `/vip-group-sales/${gid}` : `/group-landing/${gid}`)}
                    />
                </div>
            ))
        )}
      </div>

      <ReelComments
        reel={activeReel}
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
      />
      </div>
    </ReelsErrorBoundary>
  );
};
