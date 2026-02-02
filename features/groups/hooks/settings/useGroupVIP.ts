
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Group, VipMediaItem } from '../../../../types';

export const useGroupVIP = (group: Group | null) => {
  const [vipPrice, setVipPrice] = useState('');
  const [vipCurrency, setVipCurrency] = useState<'BRL' | 'USD'>('BRL');
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [pixelId, setPixelId] = useState('');
  const [pixelToken, setPixelToken] = useState('');
  const [vipDoorText, setVipDoorText] = useState('');
  const [vipButtonText, setVipButtonText] = useState('');
  const [vipMediaItems, setVipMediaItems] = useState<VipMediaItem[]>([]);

  useEffect(() => {
    if (group?.isVip) {
      setVipPrice(group.price || '');
      setVipCurrency((group.currency as any) || 'BRL');
      setSelectedProviderId(group.selectedProviderId || null);
      setPixelId(group.pixelId || '');
      setPixelToken(group.pixelToken || '');
      setVipDoorText(group.vipDoor?.text || '');
      setVipButtonText(group.vipDoor?.buttonText || '');
      setVipMediaItems(group.vipDoor?.mediaItems || (group.vipDoor?.media ? [{url: group.vipDoor.media, type: 'image'}] : []));
    }
  }, [group]);

  const moveVipMediaItem = (index: number, direction: 'left' | 'right') => {
    const newItems = [...vipMediaItems];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    // Swap
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setVipMediaItems(newItems);
  };

  const pixelConfig = useMemo(() => ({
    metaId: pixelId,
    metaToken: pixelToken
  }), [pixelId, pixelToken]);

  const updatePlatformPixel = (platform: string, data: { pixelId: string, pixelToken: string }) => {
    if (platform === 'meta') {
      setPixelId(data.pixelId);
      setPixelToken(data.pixelToken);
    }
  };

  return {
    state: { 
      vipPrice, 
      vipCurrency, 
      selectedProviderId,
      pixelId, 
      pixelToken, 
      vipDoorText, 
      vipButtonText, 
      vipMediaItems,
      pixelConfig 
    },
    actions: { 
      setVipPrice, 
      setVipCurrency, 
      setSelectedProviderId,
      setPixelId, 
      setPixelToken, 
      setVipDoorText, 
      setVipButtonText, 
      setVipMediaItems,
      updatePlatformPixel,
      moveVipMediaItem
    },
    getVipPayload: () => ({
      price: vipPrice.replace(',', '.'),
      currency: vipCurrency,
      selectedProviderId: selectedProviderId || undefined,
      pixelId,
      pixelToken,
      vipDoor: group?.isVip ? { 
        ...group.vipDoor, 
        text: vipDoorText, 
        buttonText: vipButtonText, 
        mediaItems: vipMediaItems 
      } : undefined
    })
  };
};
