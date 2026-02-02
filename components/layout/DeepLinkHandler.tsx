
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { trackingService } from '../../services/trackingService';

export const DeepLinkHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const listener = CapacitorApp.addListener('appUrlOpen', (data) => {
      console.log("🚀 Deep Link Opened:", data.url);
      try {
        const url = new URL(data.url);
        const path = url.pathname;
        const search = url.search;
        
        // Garante captura de parâmetros vindos do link externo
        trackingService.captureUrlParams();

        // Rotas permitidas para deep link direto
        const allowedDeepPaths = [
          'vip-group-sales', 
          'group-landing', 
          'post/', 
          'user/', 
          'chat/', 
          'product/',
          'reset-password'
        ];

        if (allowedDeepPaths.some(p => path.includes(p))) {
          navigate(path + search);
        }
      } catch (e) {
        console.error("Erro ao processar Deep Link", e);
      }
    });

    return () => {
      listener.then(f => f.remove());
    };
  }, [navigate]);

  return null;
};
