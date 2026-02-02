
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackingService } from '../../services/trackingService';
import { metaPixelService } from '../../services/metaPixelService';

export const GlobalTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Capturar UTMs e Ref da URL atual
    trackingService.captureUrlParams();

    // Rastreio de Afiliado (Se houver ?ref=...)
    const ref = trackingService.getAffiliateRef();
    if (ref) {
      metaPixelService.trackRecruitmentAccess(ref);
    }

    // Track Page View Global (Pixel da Plataforma)
    // @ts-ignore
    const globalPixelId = process.env.VITE_PIXEL_ID || ""; 
    if (globalPixelId) {
      metaPixelService.trackPageView(globalPixelId);
    }
  }, [location]);

  return null;
};
