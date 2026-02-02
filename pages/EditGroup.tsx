
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { groupService } from '../services/groupService';
import { metaPixelService } from '../services/metaPixelService';
import { postService } from '../services/postService';
import { Group, VipMediaItem } from '../types';
import { CurrencySelectorModal } from '../components/groups/CurrencySelectorModal';
import { UploadProgressCard } from '../features/groups/components/platform/UploadProgressCard';

export const EditGroup: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Form States
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<string | undefined>(undefined);
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<'BRL' | 'USD' | 'EUR'>('BRL');
  const [accessType, setAccessType] = useState<'lifetime' | 'temporary'>('lifetime');
  const [expirationDate, setExpirationDate] = useState('');
  const [originalGroup, setOriginalGroup] = useState<Group | null>(null);
  
  // Advanced Marketing
  const [pixelId, setPixelId] = useState('');
  const [pixelToken, setPixelToken] = useState('');
  const [marketingStatus, setMarketingStatus] = useState<'active' | 'inactive'>('inactive');
  const [isTestingPixel, setIsTestingPixel] = useState(false);

  // Modal States
  const [isVipDoorModalOpen, setIsVipDoorModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  
  // Vip Door Settings
  const [vipDoorMediaItems, setVipDoorMediaItems] = useState<{file?: File, url: string, type: 'image' | 'video'}[]>([]);
  const [vipDoorText, setVipDoorText] = useState('');
  const [vipButtonText, setVipButtonText] = useState(''); 

  // Upload Progress States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadCurrent, setUploadCurrent] = useState(0);
  const [uploadTotal, setUploadTotal] = useState(0);

  useEffect(() => {
      if (!id) {
          navigate('/groups');
          return;
      }
      const group = groupService.getGroupById(id);
      if (!group) {
          alert("Grupo não encontrado.");
          navigate('/groups');
          return;
      }

      setOriginalGroup(group);
      setGroupName(group.name);
      setDescription(group.description);
      setCoverImage(group.coverImage);
      setPixelId(group.pixelId || '');
      setPixelToken(group.pixelToken || '');
      
      if (group.pixelId) setMarketingStatus('active');
      
      if (group.price) {
          const numeric = parseFloat(group.price);
          if (!isNaN(numeric)) {
              setPrice(numeric.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
          } else {
              setPrice(group.price);
          }
      }
      
      setCurrency((group.currency as any) || 'BRL');
      setAccessType(group.accessType as any || 'lifetime');
      setExpirationDate(group.expirationDate || '');
      
      if (group.vipDoor) {
          setVipDoorText(group.vipDoor.text || '');
          setVipButtonText(group.vipDoor.buttonText || '');
          if (group.vipDoor.mediaItems) {
              setVipDoorMediaItems(group.vipDoor.mediaItems);
          } else if (group.vipDoor.media) {
              setVipDoorMediaItems([{ 
                  url: group.vipDoor.media, 
                  type: (group.vipDoor.mediaType as any) || 'image' 
              }]);
          }
      }
  }, [id, navigate]);

  useEffect(() => {
      if (pixelId.length > 5) setMarketingStatus('active');
      else setMarketingStatus('inactive');
  }, [pixelId]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedCoverFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setCoverImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVipDoorMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files) as File[];
    if (vipDoorMediaItems.length + fileArray.length > 10) {
        alert("Máximo de 10 mídias.");
        return;
    }
    const newItems = fileArray.map(f => ({
        file: f,
        url: URL.createObjectURL(f),
        type: f.type.startsWith('video/') ? 'video' as const : 'image' as const
    }));
    setVipDoorMediaItems(prev => [...prev, ...newItems]);
  };

  const removeMediaItem = (index: number) => {
      setVipDoorMediaItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleAccessTypeChange = (type: 'lifetime' | 'temporary') => {
    setAccessType(type);
    if (type === 'temporary') setIsDateModalOpen(true);
    else setExpirationDate('');
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      value = value.replace(/\D/g, "");
      if (value === "") { setPrice(""); return; }
      const numericValue = parseFloat(value) / 100;
      setPrice(numericValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalGroup || isUploading) return;

    const rawPrice = price.replace(/\./g, '').replace(',', '.');
    const numericPrice = parseFloat(rawPrice);

    if (originalGroup.isVip && (isNaN(numericPrice) || numericPrice < 6)) {
        alert("⚠️ O preço mínimo para um grupo VIP é R$ 6,00.");
        return;
    }

    setIsUploading(true);
    try {
        const filesToUpload = vipDoorMediaItems.filter(i => i.file);
        const staticItems = vipDoorMediaItems.filter(i => !i.file);
        const totalToUpload = filesToUpload.length + (selectedCoverFile ? 1 : 0);
        
        setUploadTotal(totalToUpload);
        setUploadCurrent(0);
        setUploadProgress(0);

        let finalCoverUrl = coverImage;
        let uploadedCount = 0;

        if (selectedCoverFile) {
            uploadedCount++;
            setUploadCurrent(uploadedCount);
            finalCoverUrl = await postService.uploadMedia(selectedCoverFile, 'avatars');
            setUploadProgress(Math.round((uploadedCount / totalToUpload) * 100));
        }

        const uploadedVipMedia: VipMediaItem[] = [];
        for (const item of filesToUpload) {
            uploadedCount++;
            setUploadCurrent(uploadedCount);
            const url = await postService.uploadMedia(item.file!, 'vips_doors');
            uploadedVipMedia.push({ url, type: item.type });
            setUploadProgress(Math.round((uploadedCount / totalToUpload) * 100));
        }

        const finalMediaGallery = [...staticItems.map(i => ({ url: i.url, type: i.type })), ...uploadedVipMedia];

        const updatedGroup: Group = {
          ...originalGroup,
          name: groupName,
          description: description,
          coverImage: finalCoverUrl,
          price: numericPrice.toString(),
          currency: currency,
          accessType: accessType,
          expirationDate: expirationDate,
          vipDoor: {
            mediaItems: finalMediaGallery,
            text: vipDoorText,
            buttonText: vipButtonText
          },
          pixelId: pixelId || undefined,
          pixelToken: pixelToken || undefined
        };

        await groupService.updateGroup(updatedGroup);
        
        setTimeout(() => {
            setIsUploading(false);
            navigate('/groups');
        }, 800);

    } catch (e) {
        alert("Erro ao atualizar grupo.");
        setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-x-hidden">
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Inter',sans-serif; }
        header { display:flex; align-items:center; justify-content:space-between; padding:16px 32px; background: #0c0f14; position:fixed; width:100%; z-index:10; border-bottom:1px solid rgba(255,255,255,0.1); top: 0; height: 80px; }
        header button { background:none; border:none; color:#00c2ff; font-size:18px; cursor:pointer; transition:0.3s; }
        main { flex-grow:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-start; width:100%; padding-top: 100px; padding-bottom: 150px; }
        #groupCreationForm { width:100%; max-width:500px; padding:0 20px; display: flex; flex-direction: column; gap: 20px; }
        .form-group { display: flex; flex-direction: column; }
        .form-group label { font-size: 14px; color: #00c2ff; margin-bottom: 8px; font-weight: 600; }
        .form-group input, .form-group textarea { background: #1e2531; border: 1px solid rgba(0,194,255,0.3); border-radius: 8px; color: #fff; padding: 12px; font-size: 16px; transition: border-color 0.3s; }
        .form-group input:focus, .form-group textarea:focus { border-color: #00c2ff; outline: none; box-shadow: 0 0 5px rgba(0,194,255,0.5); }
        #coverPreview { width: 100%; aspect-ratio: 1 / 1; background: #1e2531; border: 2px dashed rgba(0,194,255,0.5); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #00c2ff; font-size: 16px; cursor: pointer; position: relative; overflow: hidden; }
        #coverPreview img { width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; }
        .common-button { background: #00c2ff; border: none; border-radius: 8px; color: #000; padding: 12px 20px; font-size: 18px; font-weight: 700; cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 8px rgba(0,194,255,0.3); }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 100; opacity: 0; visibility: hidden; transition: 0.3s; }
        .modal-overlay.open { opacity: 1; visibility: visible; }
        .modal-content { background: #0c0f14; padding: 20px; border-radius: 16px; width: 90%; max-width: 400px; transform: translateY(20px); transition: transform 0.3s; box-shadow: 0 8px 25px rgba(0,194,255,0.4); }
        .modal-option { background: #1e2531; color: #fff; padding: 15px; margin-bottom: 10px; border-radius: 10px; display: flex; flex-direction: column; gap: 10px; }
        .media-preview-gallery { display: flex; gap: 10px; overflow-x: auto; width: 100%; padding-bottom: 5px; }
        .media-preview-item { flex: 0 0 100px; height: 125px; position: relative; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
        .media-preview-item img, .media-preview-item video { width: 100%; height: 100%; object-fit: cover; }
        .remove-media-btn { position: absolute; top: 2px; right: 2px; background: rgba(0,0,0,0.7); color: #ff4d4d; border: none; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 12px; }
        #media-upload-trigger { width: 100%; padding: 20px; background: #0c0f14; border: 1px dashed rgba(0,194,255,0.5); border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #00c2ff; }
        .price-input-container { display: flex; align-items: center; background: #1e2531; border: 1px solid rgba(0,194,255,0.3); border-radius: 8px; overflow: hidden; margin-bottom: 20px; }
        .price-input-container span { padding: 12px; background: #28303f; color: #aaa; font-size: 16px; font-weight: 700; min-width: 50px; text-align: center; }
        .price-input-container input { flex-grow: 1; border: none; background: none; padding: 12px; text-align: right; color: #fff; font-weight: 700; }
        .custom-radio { flex: 1; display: flex; align-items: center; justify-content: center; padding: 10px 15px; background: #1e2531; border: 1px solid rgba(0,194,255,0.3); border-radius: 8px; color: #fff; cursor: pointer; transition: background 0.3s; font-size: 14px; font-weight: 600; }
        .custom-radio.selected { background: #00c2ff; color: #000; }
        .selector-trigger { width: 100%; background: #1e2531; border: 1px solid rgba(0, 194, 255, 0.3); border-radius: 12px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: 0.3s; margin-bottom: 5px; }
        .status-badge { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 12px; text-transform: uppercase; }
        .status-badge.active { background: rgba(0, 255, 130, 0.1); color: #00ff82; border: 1px solid #00ff82; }
      `}</style>

      <header>
        <button onClick={() => navigate('/groups')}><i className="fa-solid fa-xmark"></i></button>
        <div className="absolute left-1/2 -translate-x-1/2 w-[60px] h-[60px] bg-white/5 rounded-2xl flex justify-center items-center z-20 cursor-pointer shadow-[0_0_20px_rgba(0,194,255,0.3),inset_0_0_20px_rgba(0,194,255,0.08)]" onClick={() => navigate('/feed')}>
             <div className="absolute w-[40px] h-[22px] rounded-[50%] border-[3px] border-[#00c2ff] rotate-[25deg]"></div>
             <div className="absolute w-[40px] h-[22px] rounded-[50%] border-[3px] border-[#00c2ff] -rotate-[25deg]"></div>
        </div>
      </header>

      <main>
        <h1 style={{color: '#00c2ff', marginBottom: '20px'}}>Editar Grupo</h1>
        <form id="groupCreationForm" onSubmit={handleSubmit}>
            
            <div className="form-group">
                <label htmlFor="groupName">Nome do Grupo</label>
                <input type="text" id="groupName" value={groupName} onChange={(e) => setGroupName(e.target.value)} required />
            </div>

            <div className="form-group">
                <label>Capa do Grupo</label>
                <div id="coverPreview" onClick={() => document.getElementById('coverImageInput')?.click()}>
                    {coverImage ? <img src={coverImage} alt="Cover" /> : <span>Selecionar Capa</span>}
                </div>
                <input type="file" id="coverImageInput" accept="image/*" style={{display: 'none'}} onChange={handleCoverChange} />
            </div>
            
            <div className="form-group">
                <label htmlFor="groupDescription">Descrição</label>
                <textarea id="groupDescription" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
            
            <button type="button" className="common-button" onClick={() => setIsVipDoorModalOpen(true)}>
                <i className="fa-solid fa-gear"></i> Editar Porta do VIP
            </button>
            
            <div className="price-group">
                <label>Tipo de Acesso</label>
                <div className="radio-group-container flex gap-2">
                    <div className={`custom-radio ${accessType === 'lifetime' ? 'selected' : ''}`} onClick={() => handleAccessTypeChange('lifetime')}>
                        <i className="fa-solid fa-infinity"></i> Vitalício
                    </div>
                    <div className={`custom-radio ${accessType === 'temporary' ? 'selected' : ''}`} onClick={() => handleAccessTypeChange('temporary')}>
                        <i className="fa-solid fa-clock"></i> Temporário
                    </div>
                </div>

                <div className="selector-trigger mt-4" onClick={() => setIsCurrencyModalOpen(true)}>
                    <div className="flex flex-col text-left">
                        <span className="label">Moeda:</span>
                        <span className="value">{currency}</span>
                    </div>
                    <i className="fa-solid fa-chevron-right text-[#00c2ff]"></i>
                </div>

                <div className="price-input-container">
                    <span>{currency === 'BRL' ? 'R$' : '$'}</span>
                    <input type="text" value={price} onChange={handlePriceChange} required />
                </div>
            </div>

            <div className="price-group">
                <div className="flex items-center justify-between mb-4">
                    <h3 style={{fontSize: '14px', color: '#FFD700', textTransform: 'uppercase'}}>Marketing Avançado</h3>
                    <div className={`status-badge ${marketingStatus}`}>
                        {marketingStatus === 'active' ? 'Ativo' : 'Inativo'}
                    </div>
                </div>
                <div className="form-group mb-4">
                    <label>Pixel ID</label>
                    <input type="text" value={pixelId} onChange={(e) => setPixelId(e.target.value)} placeholder="Meta Pixel ID" />
                </div>
                <div className="form-group">
                    <label>Token CAPI</label>
                    <input type="text" value={pixelToken} onChange={(e) => setPixelToken(e.target.value)} placeholder="Access Token" />
                </div>
            </div>

            <button type="submit" className="common-button" disabled={isUploading}>
                {isUploading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <><i className="fa-solid fa-save"></i> Salvar Alterações</>}
            </button>
        </form>

        <UploadProgressCard 
            progress={uploadProgress}
            current={uploadCurrent}
            total={uploadTotal}
            isVisible={isUploading}
        />
      </main>

      <div className={`modal-overlay ${isVipDoorModalOpen ? 'open' : ''}`} onClick={() => setIsVipDoorModalOpen(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Porta do VIP</h3>
            <div className="modal-option">
                <div className="media-preview-gallery">
                    {vipDoorMediaItems.map((item, idx) => (
                        <div key={idx} className="media-preview-item">
                            {item.type === 'video' ? <video src={item.url} /> : <img src={item.url} />}
                            <button className="remove-media-btn" onClick={() => removeMediaItem(idx)}><i className="fa-solid fa-xmark"></i></button>
                        </div>
                    ))}
                </div>
                <div id="media-upload-trigger" onClick={() => document.getElementById('vipDoorMediaInput')?.click()}>
                    <i className="fa-solid fa-photo-film"></i>
                    <span>Adicionar Mídia</span>
                </div>
                <input type="file" id="vipDoorMediaInput" accept="image/*,video/*" multiple style={{display: 'none'}} onChange={handleVipDoorMediaChange} />
            </div>
            <div className="modal-option">
                <textarea value={vipDoorText} onChange={(e) => setVipDoorText(e.target.value)} placeholder="Texto de boas-vindas"></textarea>
                <input type="text" value={vipButtonText} onChange={(e) => setVipButtonText(e.target.value)} placeholder="Texto do botão" />
            </div>
            <button className="common-button w-full" onClick={() => setIsVipDoorModalOpen(false)}>Concluir</button>
        </div>
      </div>

      <CurrencySelectorModal 
        isOpen={isCurrencyModalOpen} 
        onClose={() => setIsCurrencyModalOpen(false)} 
        currentCurrency={currency} 
        onSelect={(curr) => setCurrency(curr as any)} 
      />
    </div>
  );
};
