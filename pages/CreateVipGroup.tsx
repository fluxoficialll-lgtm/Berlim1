
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupService } from '../../services/groupService';
import { authService } from '../../services/authService';
import { postService } from '../../services/postService';
import { Group, VipMediaItem } from '../../types';
import { PixelSettingsModal } from '../../components/groups/PixelSettingsModal';
import { AccessTypeModal } from '../../components/groups/AccessTypeModal';
import { CurrencySelectorModal, CurrencyType } from '../../components/groups/CurrencySelectorModal';
import { ProviderSelectorModal } from '../../components/groups/ProviderSelectorModal';
import { ImageCropModal } from '../../components/ui/ImageCropModal';
import { GATEWAY_CURRENCIES, DEFAULT_CURRENCY_FOR_GATEWAY } from '../../services/gatewayConfig';
import { UploadProgressCard } from '../../features/groups/components/platform/UploadProgressCard';
import { VipHeader } from '../../features/groups/components/create-vip/VipHeader';
import { VipCover } from '../../features/groups/components/create-vip/VipCover';
import { VipInfo } from '../../features/groups/components/create-vip/VipInfo';
import { VipGallery } from '../../features/groups/components/create-vip/VipGallery';
import { VipDoorCopy } from '../../features/groups/components/create-vip/VipDoorCopy';
import { VipPricing } from '../../features/groups/components/create-vip/VipPricing';
import { VipMarketing } from '../../features/groups/components/create-vip/VipMarketing';

export const CreateVipGroup: React.FC = () => {
  const navigate = useNavigate();
  
  // Form States
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<string | undefined>(undefined);
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  
  // VIP Door States
  const [vipMediaItems, setVipMediaItems] = useState<{file?: File, url: string, type: 'image' | 'video'}[]>([]);
  const [vipDoorText, setVipDoorText] = useState('');
  const [vipButtonText, setVipButtonText] = useState(''); 

  // Price & Access States
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<CurrencyType>('BRL');
  const [accessType, setAccessType] = useState<'lifetime' | 'temporary' | 'one_time'>('lifetime');
  const [accessConfig, setAccessConfig] = useState<any>(null);
  
  // Provider State
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);

  // Advanced Marketing
  const [pixelId, setPixelId] = useState('');
  const [pixelToken, setPixelToken] = useState('');
  const [isPixelModalOpen, setIsPixelModalOpen] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  
  // Crop states
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [rawImage, setRawImage] = useState<string>('');

  const [isCreating, setIsCreating] = useState(false);
  const [hasProvider, setHasProvider] = useState(false);

  // Upload Progress States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadCurrent, setUploadCurrent] = useState(0);
  const [uploadTotal, setUploadTotal] = useState(0);

  useEffect(() => {
      const user = authService.getCurrentUser();
      const connected = !!user?.paymentConfig?.isConnected || !!Object.values(user?.paymentConfigs || {}).some(c => c.isConnected);
      setHasProvider(connected);
      
      if (user?.paymentConfig?.isConnected) {
          setSelectedProviderId(user.paymentConfig.providerId);
      } else if (user?.paymentConfigs) {
          const firstConnected = Object.values(user.paymentConfigs).find(c => c.isConnected);
          if (firstConnected) setSelectedProviderId(firstConnected.providerId);
      }
  }, []);

  const allowedCurrencies = useMemo(() => {
      if (!selectedProviderId) return [];
      const supported = GATEWAY_CURRENCIES[selectedProviderId] || ['BRL'];
      return supported.filter(c => ['BRL', 'USD', 'EUR'].includes(c));
  }, [selectedProviderId]);

  const handleProviderSelect = (pid: string) => {
      setSelectedProviderId(pid);
      const supported = GATEWAY_CURRENCIES[pid] || ['BRL'];
      const filteredSupported = supported.filter(c => ['BRL', 'USD', 'EUR'].includes(c));
      if (!filteredSupported.includes(currency)) {
          setCurrency((DEFAULT_CURRENCY_FOR_GATEWAY[pid] || filteredSupported[0] || 'BRL') as CurrencyType);
      }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setRawImage(ev.target?.result as string);
        setIsCropOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCroppedImage = (croppedBase64: string) => {
    setCoverImage(croppedBase64);
    fetch(croppedBase64)
      .then(res => res.blob())
      .then(blob => {
          const file = new File([blob], "group_cover.jpg", { type: "image/jpeg" });
          setSelectedCoverFile(file);
      });
  };

  const handleVipMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files) as File[];
    if (vipMediaItems.length + fileArray.length > 10) {
        alert("Máximo de 10 itens na galeria.");
        return;
    }
    const newEntries = fileArray.map(file => ({
        file: file,
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' as const : 'image' as const
    }));
    setVipMediaItems(prev => [...prev, ...newEntries]);
  };

  const moveVipMediaItem = (index: number, direction: 'left' | 'right') => {
    const newItems = [...vipMediaItems];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    // Swap position in array
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setVipMediaItems(newItems);
  };

  const removeMediaItem = (index: number) => {
      setVipMediaItems(prev => prev.filter((_, i) => i !== index));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      value = value.replace(/\D/g, "");
      if (value === "") { setPrice(""); return; }
      const numericValue = parseFloat(value) / 100;
      setPrice(numericValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
  };

  const handleSavePixel = (data: { pixelId: string, pixelToken: string }) => {
      setPixelId(data.pixelId);
      setPixelToken(data.pixelToken);
  };

  const getCurrencySymbol = () => {
    switch (currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      default: return 'R$';
    }
  };

  const getAccessTypeLabel = () => {
      if (accessType === 'lifetime') return 'Vitalício';
      if (accessType === 'temporary' && accessConfig) return `Renova a cada ${accessConfig.interval} dias (Máx 2x)`;
      if (accessType === 'one_time' && accessConfig) return `Expira em ${accessConfig.days}d ${accessConfig.hours}h`;
      return 'Escolher';
  };

  const getProviderLabel = () => {
      if (!selectedProviderId) return 'Escolher';
      if (selectedProviderId === 'syncpay') return 'SyncPay (Pix)';
      if (selectedProviderId === 'stripe') return 'Stripe';
      if (selectedProviderId === 'paypal') return 'PayPal';
      return selectedProviderId.toUpperCase();
  };

  const handleBack = () => {
      navigate('/create-group', { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating || isUploading) return;

    if (!selectedProviderId) {
        alert("⚠️ Selecione um provedor de pagamento para continuar.");
        setIsProviderModalOpen(true);
        return;
    }

    const rawPrice = price.replace(/\./g, '').replace(',', '.');
    const numericPrice = parseFloat(rawPrice);
    if (isNaN(numericPrice) || numericPrice < 6.00) {
        alert("⚠️ O preço mínimo para criar um grupo VIP é R$ 6,00.");
        return;
    }

    setIsCreating(true);
    setIsUploading(true);
    
    try {
        const currentUserId = authService.getCurrentUserId();
        const currentUserEmail = authService.getCurrentUserEmail();
        
        const totalToUpload = vipMediaItems.filter(i => i.file).length + (selectedCoverFile ? 1 : 0);
        setUploadTotal(totalToUpload);
        setUploadCurrent(0);
        setUploadProgress(0);

        // 1. Upload Capa
        let finalCoverUrl = coverImage;
        if (selectedCoverFile) {
            setUploadCurrent(prev => prev + 1);
            finalCoverUrl = await postService.uploadMedia(selectedCoverFile, 'avatars');
            setUploadProgress(Math.round((1 / totalToUpload) * 100));
        }

        // 2. Upload Galeria sequencial para progresso preciso
        const uploadedVipMedia: VipMediaItem[] = [];
        const filesToUpload = vipMediaItems.filter(i => i.file);
        const staticItems = vipMediaItems.filter(i => !i.file);

        let uploadedCount = selectedCoverFile ? 1 : 0;

        for (const item of filesToUpload) {
            uploadedCount++;
            setUploadCurrent(uploadedCount);
            const url = await postService.uploadMedia(item.file!, 'vips_doors');
            uploadedVipMedia.push({ url, type: item.type });
            setUploadProgress(Math.round((uploadedCount / totalToUpload) * 100));
        }

        const finalMediaGallery = [...staticItems.map(i => ({ url: i.url, type: i.type })), ...uploadedVipMedia];

        let expirationValue = undefined;
        if (accessType === 'temporary') expirationValue = accessConfig?.interval;
        else if (accessType === 'one_time') expirationValue = `${accessConfig?.days}d${accessConfig?.hours}h`;

        const newGroup: Group = {
          ...({} as any), // Base object
          id: Date.now().toString(),
          name: groupName,
          description: description,
          coverImage: finalCoverUrl,
          isVip: true,
          price: numericPrice.toString(),
          currency: currency as any,
          accessType: accessType,
          selectedProviderId: selectedProviderId,
          expirationDate: expirationValue,
          vipDoor: {
            mediaItems: finalMediaGallery,
            text: vipDoorText || "Bem-vindo ao VIP!",
            buttonText: vipButtonText
          },
          lastMessage: "Grupo criado. Configure os conteúdos.",
          time: "Agora",
          creatorId: currentUserId || '',
          creatorEmail: currentUserEmail || undefined,
          memberIds: currentUserId ? [currentUserId] : [],
          adminIds: currentUserId ? [currentUserId] : [],
          status: 'active',
          pixelId: pixelId || undefined,
          pixelToken: pixelToken || undefined
        };
        await groupService.createGroup(newGroup);
        
        setTimeout(() => {
            setIsUploading(false);
            navigate('/groups', { replace: true });
        }, 800);
        
    } catch (e) {
        alert("Erro ao criar grupo VIP.");
        setIsCreating(false);
        setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-x-hidden">
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Inter',sans-serif; }
        header {
            display:flex; align-items:center; justify-content:space-between; padding:16px 32px;
            background: #0c0f14; position:fixed; width:100%; z-index:10; border-bottom:1px solid rgba(255,255,255,0.1);
            top: 0; left:0; height: 80px;
        }
        header button { background:none; border:none; color:#00c2ff; font-size:18px; cursor:pointer; transition:0.3s; }
        header button:hover { color:#fff; }
        main { flex-grow:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-start; width:100%; padding-top: 100px; padding-bottom: 150px; }
        #groupCreationForm { width:100%; max-width:500px; padding:0 20px; display: flex; flex-direction: column; gap: 20px; }
        h1 { font-size: 24px; text-align: center; margin-bottom: 20px; background: -webkit-linear-gradient(145deg, #FFD700, #B8860B); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 700; }
        .cover-upload-container { display: flex; flex-direction: column; align-items: center; margin-bottom: 10px; }
        .cover-preview { width: 120px; height: 120px; border-radius: 50%; border: 3px solid #FFD700; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 0 20px rgba(255, 215, 0, 0.2); }
        .cover-preview:hover { border-color: #fff; box-shadow: 0 0 25px rgba(255, 215, 0, 0.4); }
        .cover-preview img { width: 100%; height: 100%; object-fit: cover; }
        .cover-icon { font-size: 40px; color: rgba(255,255,255,0.3); }
        .cover-label { margin-top: 10px; font-size: 14px; color: #FFD700; cursor: pointer; font-weight: 600; }
        .form-group { display: flex; flex-direction: column; }
        .form-group label { font-size: 13px; color: #FFD700; margin-bottom: 8px; font-weight: 600; }
        .form-group input, .form-group textarea { background: #1e2531; border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 8px; color: #fff; padding: 12px; font-size: 16px; transition: border-color 0.3s; }
        .form-group input:focus, .form-group textarea:focus { border-color: #FFD700; outline: none; box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
        .form-group textarea { resize: vertical; min-height: 100px; }
        .vip-door-section { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin-top: 10px; }
        .section-title { font-size: 16px; color: #FFD700; font-weight: 700; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; }
        
        .media-preview-item { width: 80px; height: 100px; flex-shrink: 0; border-radius: 12px; overflow: hidden; position: relative; border: 1px solid rgba(255, 215, 0, 0.2); background: #000; }
        .media-preview-item img, .media-preview-item video { width: 100%; height: 100%; object-fit: cover; }
        
        /* Controls Overlay */
        .media-controls-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 6px; opacity: 0; transition: 0.2s; }
        .media-preview-item:hover .media-controls-overlay { opacity: 1; }
        
        .reorder-btn { width: 22px; height: 22px; border-radius: 6px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 9px; }
        .reorder-btn:hover { background: #00c2ff; color: #000; border-color: #00c2ff; }
        .reorder-btn:disabled { opacity: 0.2; cursor: not-allowed; }
        
        .remove-media-btn-new { width: 22px; height: 22px; border-radius: 6px; background: rgba(255, 77, 77, 0.2); border: 1px solid rgba(255, 77, 77, 0.4); color: #ff4d4d; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 9px; }
        .remove-media-btn-new:hover { background: #ff4d4d; color: #fff; }

        .add-media-btn { width: 80px; height: 100px; flex-shrink: 0; border-radius: 12px; border: 1px dashed #FFD700; background: rgba(255, 215, 0, 0.05); display: flex; flex-direction: column; align-items: center; justify-content: center; color: #FFD700; cursor: pointer; gap: 5px; }
        .add-media-btn:hover { background: rgba(255, 215, 0, 0.1); }
        .add-media-btn span { font-size: 10px; font-weight: 600; text-align: center; }
        .common-button { background: #FFD700; border: none; border-radius: 8px; color: #000; padding: 16px 20px; font-size: 18px; font-weight: 700; cursor: pointer; transition: background 0.3s, transform 0.1s; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 8px rgba(255, 215, 0, 0.3); margin-top: 20px; }
        .common-button:hover { background: #e6c200; }
        .common-button:active { transform: scale(0.99); }
        .common-button:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .price-group { display: flex; flex-direction: column; gap: 10px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); }
        .price-group label { font-size: 16px; color: #FFD700; font-weight: 700; }
        .price-input-container { display: flex; align-items: center; background: #1e2531; border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 8px; overflow: hidden; margin-bottom: 5px; }
        .price-input-container span { padding: 12px; background: #28303f; color: #aaa; font-size: 16px; font-weight: 700; min-width: 50px; text-align: center; }
        .price-input-container input { flex-grow: 1; border: none; background: none; padding: 12px; text-align: right; color: #fff; font-weight: 700; }
        
        .selector-trigger {
            width: 100%;
            background: #1e2531;
            border: 1px solid rgba(255, 215, 0, 0.3);
            border-radius: 12px;
            padding: 14px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            transition: 0.3s;
            margin-bottom: 5px;
        }
        .selector-trigger:hover {
            border-color: #FFD700;
            background: rgba(255, 215, 0, 0.05);
        }
        .selector-trigger .label { font-size: 13px; color: #888; font-weight: 500; }
        .selector-trigger .value { font-size: 14px; color: #fff; font-weight: 700; display: flex; align-items: center; gap: 10px; text-align: right; }
        .selector-trigger .value span.curr-sym { width: 32px; text-align: center; color: #FFD700; font-weight: 900; }

        .add-pixel-btn { width: 100%; padding: 14px; background: rgba(255, 255, 255, 0.05); border: 1px dashed #FFD700; border-radius: 12px; color: #FFD700; font-weight: 700; font-size: 14px; cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .add-pixel-btn:hover { background: rgba(255, 215, 0, 0.1); }
      `}</style>

      <VipHeader onBack={handleBack} />

      <main>
        <form id="groupCreationForm" onSubmit={handleSubmit}>
            <h1>Novo Grupo VIP</h1>
            
            {!hasProvider && (
                <div style={{ background: 'rgba(234, 179, 8, 0.1)', border: '1px solid #eab308', borderRadius: '8px', padding: '12px', marginBottom: '20px', fontSize: '13px', color: '#fef08a' }}>
                    <i className="fa-solid fa-triangle-exclamation" style={{marginRight:'8px'}}></i>
                    Nenhum provedor conectado. <button type="button" onClick={() => navigate('/financial/providers')} style={{textDecoration:'underline', fontWeight:'bold', background:'none', border:'none', color:'inherit', cursor:'pointer'}}>Conectar agora</button>
                </div>
            )}

            <VipCover coverImage={coverImage} onCoverChange={handleCoverChange} />
            <VipInfo 
              groupName={groupName} 
              onGroupNameChange={(e) => setGroupName(e.target.value)} 
              description={description} 
              onDescriptionChange={(e) => setDescription(e.target.value)} 
            />
            <VipGallery 
              vipMediaItems={vipMediaItems} 
              onVipMediaChange={handleVipMediaChange} 
              onMoveVipMediaItem={moveVipMediaItem} 
              onRemoveMediaItem={removeMediaItem} 
            />
            <VipDoorCopy 
              vipDoorText={vipDoorText} 
              onVipDoorTextChange={(e) => setVipDoorText(e.target.value)} 
              vipButtonText={vipButtonText} 
              onVipButtonTextChange={(e) => setVipButtonText(e.target.value)} 
            />
            <VipPricing 
              selectedProviderId={selectedProviderId} 
              onProviderClick={() => setIsProviderModalOpen(true)} 
              getProviderLabel={getProviderLabel} 
              accessType={accessType} 
              onAccessClick={() => setIsAccessModalOpen(true)} 
              getAccessTypeLabel={getAccessTypeLabel} 
              currency={currency} 
              onCurrencyClick={() => setIsCurrencyModalOpen(true)} 
              getCurrencySymbol={getCurrencySymbol} 
              price={price} 
              onPriceChange={handlePriceChange} 
            />
            <VipMarketing pixelId={pixelId} onPixelClick={() => setIsPixelModalOpen(true)} />

            <button type="submit" className="common-button" disabled={isCreating || isUploading}>
                {isCreating || isUploading ? <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> : "Criar Grupo"}
            </button>
        </form>

        <UploadProgressCard 
            progress={uploadProgress}
            current={uploadCurrent}
            total={uploadTotal}
            isVisible={isUploading}
        />
      </main>

      <ProviderSelectorModal 
        isOpen={isProviderModalOpen}
        onClose={() => setIsProviderModalOpen(false)}
        selectedProviderId={selectedProviderId}
        onSelect={handleProviderSelect}
      />

      <PixelSettingsModal 
        isOpen={isPixelModalOpen}
        onClose={() => setIsPixelModalOpen(false)}
        initialData={{ metaId: pixelId, metaToken: pixelToken }}
        onSave={(platform, data) => handleSavePixel(data)}
      />

      <AccessTypeModal 
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
        currentType={accessType}
        onSelect={(type, config) => {
            setAccessType(type);
            setAccessConfig(config);
        }}
      />

      <CurrencySelectorModal 
        isOpen={isCurrencyModalOpen}
        onClose={() => setIsCurrencyModalOpen(false)}
        currentCurrency={currency}
        onSelect={(curr) => setCurrency(curr)}
        allowedCurrencies={allowedCurrencies}
      />

      <ImageCropModal 
        isOpen={isCropOpen}
        imageSrc={rawImage}
        onClose={() => setIsCropOpen(false)}
        onSave={handleCroppedImage}
      />
    </div>
  );
};
