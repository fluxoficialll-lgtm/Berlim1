
import { geoService, GeoData } from '../geoService';
import { currencyService, ConversionResult } from '../currencyService';
import { Group } from '../../../types';

export const VipPriceResolver = {
    /**
     * Resolve a geolocalização do usuário.
     */
    async detectUserGeo(): Promise<GeoData> {
        return await geoService.detectCountry();
    },

    /**
     * Resolve o preço final baseado na moeda do grupo vs moeda local do usuário.
     */
    async resolvePrice(group: Group, geo: GeoData): Promise<ConversionResult> {
        const baseCurrency = group.currency || 'BRL';
        const basePrice = parseFloat(group.price || '0');
        const targetCurrency = geo.currency || 'BRL';

        return await currencyService.convert(basePrice, baseCurrency, targetCurrency);
    }
};
