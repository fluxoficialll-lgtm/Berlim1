import { PixelEventName } from '../../../types/pixel.types';

/**
 * Mapeamento de Engajamento Granular
 * Transforma micro-interações em eventos otimizáveis para as IAs das plataformas.
 */
export const EngagementMapping: Record<string, PixelEventName> = {
  // Usuário interessado nos detalhes (Provas sociais, fotos)
  'GALLERY_ZOOM': 'ViewContent',
  
  // Usuário engajado com a leitura da copy/oferta
  'TIME_STAY_30S': 'ViewContent',
  'SCROLL_DEPTH_50': 'ViewContent',
  
  // Usuário verificando preços em outras moedas (Alta intenção)
  'SIMULATOR_USED': 'Search',
  
  // Intenção de compartilhamento ou salvar conteúdo
  'SHARE_INTENT': 'Contact'
};