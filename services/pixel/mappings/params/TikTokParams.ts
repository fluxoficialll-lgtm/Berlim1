import { PixelUserData, PixelEventData } from '../../../../types/pixel.types';

/**
 * Traduz os dados do app para o padrão TikTok Pixel.
 */
export const mapToTikTokParams = (userData: PixelUserData = {}, eventData: PixelEventData = {}) => {
  return {
    // TikTok Identify
    user_info: {
      email: userData.email,
      phone_number: userData.phone,
      external_id: userData.externalId
    },
    
    // Event Data
    properties: {
      value: eventData.value,
      currency: eventData.currency || 'BRL',
      content_type: eventData.content_type || 'product',
      contents: eventData.content_ids?.map(id => ({
        content_id: id,
        content_name: eventData.content_name
      }))
    }
  };
};
