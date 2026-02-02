import { PixelEventName, PixelEventData, PixelUserData } from '../../../types/pixel.types';

export interface IPixelProvider {
  id: string;
  init(pixelId: string): void;
  /**
   * Dispara um evento para o provedor específico.
   * @param eventName Nome do evento (pode ser um evento interno que será mapeado pelo provedor)
   */
  // Fix: Broadened eventName from PixelEventName to string to allow mapping of internal events inside providers
  track(eventName: string, data?: PixelEventData, userData?: PixelUserData): Promise<void>;
}