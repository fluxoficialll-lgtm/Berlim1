
import React, { useState, useEffect, useRef } from 'react';
import { paypalService } from '../../services/paypalService';
import { authService } from '../../services/authService';
import { metaPixelService } from '../../services/metaPixelService';
import { Group } from '../../types';
import { ConversionResult } from '../../services/currencyService';
import { RedirectionBridgeCard } from './RedirectionBridgeCard';

interface PayPalModelProps {
    group: Group;
    onSuccess: () => void;
    onError: (msg: string) => void;
    onTransactionId: (id: string) => void;
    convertedPriceInfo: ConversionResult | null;
}

export const PayPalModel: React.FC<PayPalModelProps> = ({ group, onSuccess, onError, onTransactionId, convertedPriceInfo }) => {
    const [approvalUrl, setApprovalUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const pollingInterval = useRef<any>(null);

    useEffect(() => {
        return () => { if (pollingInterval.current) clearInterval(pollingInterval.current); };
    }, []);

    const generateOrder = async () => {
        const email = authService.getCurrentUserEmail() || localStorage.getItem('guest_email_capture');
        if (!email) { onError("E-mail necessário."); return; }

        setIsLoading(true);
        try {
            const finalValue = convertedPriceInfo?.amount || parseFloat(group.price || '0');
            const finalCurrency = convertedPriceInfo?.currency || group.currency || 'BRL';

            if (group.pixelId) {
                metaPixelService.trackInitiateCheckout(group.pixelId, {
                    content_ids: [group.id],
                    content_type: 'product_group',
                    content_name: group.name,
                    value: finalValue,
                    currency: finalCurrency
                }, { email });
            }

            const translatedGroup = {
                ...group,
                price: finalValue.toString(),
                currency: finalCurrency as any
            };

            const order = await paypalService.createOrder(translatedGroup, group.creatorEmail!);
            if (order.approvalLink) {
                onTransactionId(order.id);
                setApprovalUrl(order.approvalLink);
                startPolling(order.id);
            }
        } catch (err: any) {
            onError(err.message || "Erro ao iniciar PayPal.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRedirect = () => {
        if (approvalUrl) {
            window.open(approvalUrl, '_blank');
        } else {
            generateOrder();
        }
    };

    const startPolling = (orderId: string) => {
        if (pollingInterval.current) clearInterval(pollingInterval.current);
        pollingInterval.current = setInterval(async () => {
            try {
                const res = await paypalService.checkOrderStatus(orderId, group.creatorEmail!);
                if (res.status === 'paid') {
                    clearInterval(pollingInterval.current);
                    onSuccess();
                }
            } catch (e) {}
        }, 4000);
    };

    return (
        <RedirectionBridgeCard 
            provider="paypal"
            price={convertedPriceInfo?.formatted || '...'}
            isLoading={isLoading}
            onConfirm={handleRedirect}
            onBack={() => window.location.reload()} // No modal context, recarregar reseta o estado do pai
        />
    );
};
