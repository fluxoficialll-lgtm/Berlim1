
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReelsData } from './useReelsData';
import { useReelInteractions } from './useReelInteractions';
import { useReelPlayer } from './useReelPlayer';

export const useReels = () => {
  const navigate = useNavigate();
  const { reels, setReels } = useReelsData();
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeReelIndex, reportWatchTime } = useReelPlayer(reels, containerRef);
  const { handleLike, handleDeleteReel, handleShare } = useReelInteractions(setReels);
  
  const [expandedReels, setExpandedReels] = useState<Set<string>>(new Set());

  const toggleReadMore = (reelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedReels(prev => {
        const next = new Set(prev);
        if (next.has(reelId)) next.delete(reelId);
        else next.add(reelId);
        return next;
    });
  };

  const handleCtaClick = (link?: string) => {
    if (link?.startsWith('http')) {
        window.open(link, '_blank');
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
      toggleReadMore,
      handleLike,
      handleDeleteReel,
      handleShare,
      reportWatchTime,
      handleCtaClick
  };
};
