
import { useState, useEffect, useRef, useCallback } from 'react';
import { groupService } from '../services/groupService';
import { authService } from '../services/authService';
import { vipSalesTracker } from '../services/pixel/trackers/VipSalesTracker';
import { VipPlaybackController } from '../services/real/vip/VipPlaybackController';
import { useVipPricing } from './useVipPricing';
import { Group } from '../types';

export const useVipGroupSales = (groupId: string | undefined) => {
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [isPurchaseEnabled, setIsPurchaseEnabled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const [modals, setModals] = useState({
    pix: false,
    email: false,
    simulator: false,
    zoomIndex: null as number | null
  });

  const [hasCapturedEmail, setHasCapturedEmail] = useState(!!localStorage.getItem('guest_email_capture'));
  const { geoData, displayPriceInfo, setGeoData } = useVipPricing(group);

  useEffect(() => {
    const loadData = async () => {
      if (!groupId) return;
      
      try {
        const foundGroup = await groupService.fetchGroupById(groupId);
        if (foundGroup) {
          setGroup(foundGroup);
          
          const user = authService.getCurrentUser();
          const ownerFlag = !!user && (foundGroup.creatorId === user.id || foundGroup.creatorEmail === user.email);
          setIsCreator(ownerFlag);

          // DISPARO DE PAGE VIEW E VIEW CONTENT
          vipSalesTracker.trackLanding(foundGroup);

          setIsPurchaseEnabled(foundGroup.status === 'active' || foundGroup.status === undefined);
          setLoading(false);
        } else {
          setError(true);
          setLoading(false);
        }
      } catch (e) {
        setError(true);
        setLoading(false);
      }
    };
    loadData();
  }, [groupId]);

  // Lógica de Vídeo delegada ao Controller
  const handleToggleVideo = useCallback((index: number) => {
    setPlayingIndex(prev => VipPlaybackController.togglePlayback(prev, index));
    
    // Rastreia interação com galeria ao dar play em vídeo
    if (group) {
        vipSalesTracker.trackGalleryInteraction(group);
    }
  }, [group]);

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const width = carouselRef.current.offsetWidth;
      const index = Math.round(scrollLeft / width);
      
      if (index !== currentSlide) {
        setCurrentSlide(index);
        
        // Rastreia interação ao trocar de mídia na galeria
        if (group) {
            vipSalesTracker.trackGalleryInteraction(group);
        }

        if (VipPlaybackController.shouldStopOnScroll(index, playingIndex)) {
            setPlayingIndex(null);
        }
      }
    }
  };

  const handlePurchaseClick = () => {
    if (!hasCapturedEmail) {
      setModals(prev => ({ ...prev, email: true }));
      return;
    }
    
    if (group) {
        vipSalesTracker.trackCheckoutIntent(group);
    }
    
    setModals(prev => ({ ...prev, pix: true }));
  };

  const openSimulator = () => {
    setModals(prev => ({ ...prev, simulator: true }));
  };

  const onEmailSuccess = (email: string) => {
    setHasCapturedEmail(true);
    if (group) {
      vipSalesTracker.trackLead(group, email);
      vipSalesTracker.trackCheckoutIntent(group);
    }
    setModals(prev => ({ ...prev, email: false, pix: true }));
  };

  const closeModals = () => setModals({ pix: false, email: false, simulator: false, zoomIndex: null });

  const setZoom = (index: number) => {
    setModals(prev => ({ ...prev, zoomIndex: index }));
    // Rastreia interação ao abrir zoom
    if (group) {
        vipSalesTracker.trackGalleryInteraction(group);
    }
  };

  return {
    group,
    loading,
    error,
    isCreator,
    isPurchaseEnabled,
    modals,
    currentSlide,
    playingIndex,
    carouselRef,
    displayPriceInfo,
    geoData,
    setGeoData,
    handleScroll,
    handleToggleVideo,
    handlePurchaseClick,
    openSimulator,
    closeModals,
    setZoom,
    onEmailSuccess
  };
};
