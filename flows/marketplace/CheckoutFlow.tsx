
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MarketplaceItem, Group } from '../../types';
import { metaPixelService } from '../../services/metaPixelService';
import { geoService } from '../../services/geoService';
import { currencyService } from '../../services/currencyService';
import { authService } from '../../services/authService';

export const useCheckoutFlow = () => {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const startCheckout = async (target: MarketplaceItem | Group) => {
        setIsProcessing(true);
        try {
            const guestEmail = localStorage.getItem('guest_email_capture');
            const isVip = 'isVip' in target && target.isVip;
            const geo = await geoService.detectCountry();
            const baseCurrency = ('currency' in target ? target.currency : 'BRL') || 'BRL';
            const priceValue = parseFloat(String(target.price || 0));
            
            const conversion = await currencyService.convert(
                priceValue, 
                baseCurrency, 
                geo.currency || 'BRL'
            );

            const targetPixelId = 'pixelId' in target ? target.pixelId : undefined;
            if (targetPixelId) {
                metaPixelService.trackInitiateCheckout(targetPixelId, {
                    content_ids: [target.id],
                    content_type: isVip ? 'product_group' : 'product',
                    content_name: ('name' in target ? target.name : (target as MarketplaceItem).title) || 'Produto',
                    value: conversion.amount,
                    currency: conversion.currency
                }, guestEmail ? { email: guestEmail } : undefined);
            }

            const provider = geo.countryCode === 'BR' ? 'syncpay' : 'stripe';

            return { provider, geo, conversion, mustCaptureEmail: !guestEmail };
        } catch (error) {
            console.error("[CheckoutFlow] Error:", error);
            throw error;
        } finally {
            setIsProcessing(false);
        }
    };

    const finalizeAccess = (targetId: string, isGroup: boolean = true) => {
        const email = authService.getCurrentUserEmail() || localStorage.getItem('guest_email_capture');
        
        if (!email) {
            // Se o usuário pagou mas não está logado, força o registro com destino salvo
            sessionStorage.setItem('redirect_after_login', isGroup ? `/group-chat/${targetId}` : `/marketplace/product/${targetId}`);
            navigate('/register', { replace: true });
            return;
        }

        const path = isGroup ? `/group-chat/${targetId}` : `/marketplace/product/${targetId}`;
        navigate(path, { replace: true });
    };

    return { startCheckout, finalizeAccess, isProcessing };
};
