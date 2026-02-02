
import { PixelUserData } from '../../../types/pixel.types';

export const advancedMatcher = {
  /**
   * Captura dados técnicos do navegador para aumentar o Match Quality.
   */
  enrich: (data: PixelUserData = {}): PixelUserData => {
    const cookies = document.cookie.split(';').reduce((acc: any, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = value;
      return acc;
    }, {});

    return {
      ...data,
      fbp: cookies['_fbp'], // Facebook Browser ID
      fbc: cookies['_fbc'], // Facebook Click ID
      userAgent: navigator.userAgent,
      // externalId idealmente é o e-mail ou CPF, o hasher será chamado no provider
      externalId: data.email || data.externalId
    };
  }
};
