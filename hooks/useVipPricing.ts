
import { useState, useEffect } from 'react';
import { GeoData } from '../services/geoService';
import { ConversionResult } from '../services/currencyService';
import { VipPriceResolver } from '../services/real/vip/VipPriceResolver';
import { Group } from '../types';

export const useVipPricing = (group: Group | null) => {
    const [geoData, setGeoData] = useState<GeoData | null>(null);
    const [displayPriceInfo, setDisplayPriceInfo] = useState<ConversionResult | null>(null);

    useEffect(() => {
        const detect = async () => {
            const detected = await VipPriceResolver.detectUserGeo();
            setGeoData(detected);
        };
        detect();
    }, []);

    useEffect(() => {
        const updatePrice = async () => {
            if (group && geoData) {
                const conversion = await VipPriceResolver.resolvePrice(group, geoData);
                setDisplayPriceInfo(conversion);
            }
        };
        updatePrice();
    }, [group, geoData]);

    return { geoData, displayPriceInfo, setGeoData };
};
