import React from 'react';
import { GeoData } from '../../services/geoService';

interface VipSalesPriceBadgeProps {
    geoData: GeoData | null;
}

export const VipSalesPriceBadge: React.FC<VipSalesPriceBadgeProps> = ({ geoData }) => {
    if (!geoData) return null;

    return (
        <div className="location-badge animate-fade-in inline-flex items-center gap-5 bg-white/10 p-[4px_10px] rounded-[20px] text-[10px] text-[#aaa] mb-[10px] border border-white/5">
            <i className="fa-solid fa-earth-americas"></i> 
            Valores em {geoData.currency} para {geoData.countryName}
        </div>
    );
};