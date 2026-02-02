
import { hashPixelData } from '../utils/pixelHasher';

/**
 * Gera um ID de evento determinístico.
 * Essencial para que o Meta Ads saiba que o evento do Navegador e do Servidor são o mesmo.
 */
export const generateDeterministicEventId = async (
  eventName: string, 
  userContext: string, 
  contentId?: string
): Promise<string> => {
  // Base: Nome do Evento + E-mail/ID do usuário + ID do Grupo
  const rawId = `${eventName}_${userContext}_${contentId || 'global'}`;
  
  // Transforma em um hash curto e seguro de 16 caracteres
  const fullHash = await hashPixelData(rawId);
  return `flux_${fullHash.substring(0, 16)}`;
};
